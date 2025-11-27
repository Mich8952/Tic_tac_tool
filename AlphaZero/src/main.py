import torch
import torch.nn as nn
from torch.optim import SGD
from torch.utils.data import DataLoader, TensorDataset
import argparse
import os
import sys
from multiprocessing import get_context

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from Resnet import ResNet
import MCTS
from Config import Config
from Utils.TicTacToeAdapter import TicTacToeAdapter
import numpy as np
import matplotlib.pyplot as plt

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
#print(f"Using device: {device}")

def get_tree(config, agent, game, device, dirichlet_noise=True):
    tree = MCTS.MCTS(game, game.get_board(), agent, config, device)
    return tree

def data_generation_worker(args):
    game, agent, config, num_sim, games, gpu_id = args
    worker_device = torch.device(f'cuda:{gpu_id}' if torch.cuda.is_available() else 'cpu')
    agent = agent.to(worker_device)

    x = []
    y_policy = []
    y_value = []

    for _ in range(games):
        game.reset()
        history = []
        policy_targets = []
        player_moved_list = []
        positions = []

        while not game.is_final():
            tree = get_tree(config, agent, game, worker_device)
            tree.search_series(num_sim)
            temp_move = tree.get_temperature_move(tree.root)
            history.append(temp_move)
            policy_targets.append(np.array(tree.get_posterior_probabilities()))
            player_moved_list.append(game.get_turn())
            positions.append(np.array(game.get_board()))

            game.execute_move(temp_move)

        game_outcome = game.get_outcome()
        value_targets = [game_outcome[x] for x in player_moved_list]

        x = x + positions
        y_policy = y_policy + policy_targets
        y_value = y_value + value_targets

    return np.array(x), np.array(y_policy), np.array(y_value).reshape(-1, 1)

def generate_data(game, agent, config, device, num_sim=100, games=4500, num_workers=30):
    games_per_worker = games // num_workers

    print(f"Generating {games} games with {num_workers} workers ({games_per_worker} games each)...")

    with get_context("spawn").Pool(processes=num_workers) as pool:
        args = [(game, agent, config, num_sim, games_per_worker, i % 2) for i in range(num_workers)]
        worker_results = pool.map(data_generation_worker, args)

    # Aggregate results from all workers
    x = np.concatenate([result[0] for result in worker_results])
    y_policy = np.concatenate([result[1] for result in worker_results])
    y_value = np.concatenate([result[2] for result in worker_results])

    return x, y_policy, y_value

def train(game, config, num_filters, num_res_blocks, boardSize, num_sim=125, epochs=50, games_each_epoch=4500, batch_size=1024, num_train_epochs=10, num_workers=30):
    model_dir = f"Models/size_{boardSize}"
    os.makedirs(model_dir, exist_ok=True)

    h, w, d = config.board_dims[1:]
    agent = ResNet(h, w, d, num_filters, config.policy_output_dim, num_res_blocks = num_res_blocks)
    agent = agent.to(device)
    optimizer = SGD(agent.parameters(), lr = 0.001, momentum = 0.9, weight_decay = 0.0001)
    loss_policy = nn.CrossEntropyLoss()
    loss_value = nn.MSELoss()

    total_loss_history = []
    policy_loss_history = []
    value_loss_history = []

    for epoch in range(epochs):
        x, y_pol, y_val = generate_data(game, agent, config, device, num_sim=num_sim, games=games_each_epoch, num_workers=num_workers)

        x_tensor = torch.from_numpy(x).float()
        x_tensor = x_tensor.transpose(1,3).transpose(2,3)
        y_pol_tensor = torch.from_numpy(y_pol).float()
        y_val_tensor = torch.from_numpy(y_val).float()

        dataset = TensorDataset(x_tensor, y_pol_tensor, y_val_tensor)
        dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

        agent.train()
        epoch_loss_p = 0
        epoch_loss_v = 0
        num_batches = 0

        for _ in range(num_train_epochs):
            for x_batch, y_pol_batch, y_val_batch in dataloader:
                x_batch = x_batch.to(device)
                y_pol_batch = y_pol_batch.to(device)
                y_val_batch = y_val_batch.to(device)

                optimizer.zero_grad()
                policy_pred, value_pred = agent(x_batch)
                loss_p = loss_policy(policy_pred, y_pol_batch)
                loss_v = loss_value(value_pred, y_val_batch)
                total_loss = loss_p + loss_v
                total_loss.backward()
                optimizer.step()

                epoch_loss_p += loss_p.item()
                epoch_loss_v += loss_v.item()
                num_batches += 1

        # Calculate final losses for this epoch
        loss_p = epoch_loss_p / num_batches
        loss_v = epoch_loss_v / num_batches
        total_loss = loss_p + loss_v

        total_loss_history.append(total_loss)
        policy_loss_history.append(loss_p)
        value_loss_history.append(loss_v)

        torch.save(agent.state_dict(), f"{model_dir}/{epoch}.pt")

    _, axes = plt.subplots(1, 3, figsize=(15, 4))

    axes[0].plot(total_loss_history, linewidth=2)
    axes[0].set_title('Total Loss per Epoch')
    axes[0].set_xlabel('Epoch')
    axes[0].set_ylabel('Loss')
    axes[0].grid(True, alpha=0.3)

    axes[1].plot(policy_loss_history, linewidth=2, color='orange')
    axes[1].set_title('Policy Loss per Epoch')
    axes[1].set_xlabel('Epoch')
    axes[1].set_ylabel('Loss')
    axes[1].grid(True, alpha=0.3)

    axes[2].plot(value_loss_history, linewidth=2, color='green')
    axes[2].set_title('Value Loss per Epoch')
    axes[2].set_xlabel('Epoch')
    axes[2].set_ylabel('Loss')
    axes[2].grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig(f'{model_dir}/training_plot.png', dpi=150)

    return agent


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("--boardSize", type=int, default=3)
    boardSize = parser.parse_args().boardSize

    config = Config(boardSize)
    train(TicTacToeAdapter(boardSize), config, 128, 4, boardSize)