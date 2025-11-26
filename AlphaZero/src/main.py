import torch
import torch.nn as nn
from torch.optim import SGD
import argparse
import os
import sys

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
print(f"Using device: {device}")

def get_tree(config, agent, game, device, dirichlet_noise=True):
    tree = MCTS.MCTS(game, game.get_board(), agent, config, device)
    return tree

def generate_data(game, agent, config, device, num_sim=100, games=1):
    tree = get_tree(config, agent, game, device)

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
            tree.reset_search()
            tree.root.board_state = game.get_board()
            tree.search_series(num_sim)
            temp_move = tree.get_temperature_move(tree.root)
            history.append(temp_move)
            policy_targets.append(np.array(tree.get_posterior_probabilities()))
            player_moved_list.append(game.get_turn())
            positions.append(np.array(game.get_board()))

            game.execute_move(temp_move)
            print("________________")
            game.print_board()
            print("________________")

        game_outcome = game.get_outcome()
        value_targets = [game_outcome[x] for x in player_moved_list]

        x = x + positions
        y_policy = y_policy + policy_targets
        y_value = y_value + value_targets

    return np.array(x), np.array(y_policy), np.array(y_value)

def train(game, config, num_filters, num_res_blocks, boardSize, num_sim=125, epochs=50, games_each_epoch=10, batch_size=32, num_train_epochs=10):
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
        x, y_pol, y_val = generate_data(game, agent, config, device, num_sim=num_sim, games=games_each_epoch)
        print("Epoch")
        print(x.shape)

        for num in range(len(x)):
            print("targets-predictions")
            print(y_pol[num], y_val[num])

        x_tensor = torch.from_numpy(x).float().to(device)
        x_tensor = x_tensor.transpose(1,3).transpose(2,3)
        y_pol_tensor = torch.from_numpy(y_pol).float().to(device)
        y_val_tensor = torch.from_numpy(y_val).float().to(device)

        agent.train()
        for _ in range(num_train_epochs):
            optimizer.zero_grad()
            policy_pred, value_pred = agent(x_tensor)
            loss_p = loss_policy(policy_pred, y_pol_tensor)
            loss_v = loss_value(value_pred, y_val_tensor)
            total_loss = loss_p + loss_v
            total_loss.backward()
            optimizer.step()

        # Calculate final losses for this epoch
        agent.eval()
        with torch.no_grad():
            policy_pred, value_pred = agent(x_tensor)
            loss_p = loss_policy(policy_pred, y_pol_tensor).item()
            loss_v = loss_value(value_pred, y_val_tensor).item()
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