import torch
import torch.nn as nn
import numpy as np
import os
import sys
import argparse
import csv
from pathlib import Path
from tqdm import tqdm
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from Resnet import ResNet
from baseline import BaselinePolicyWrapper, RandomPolicyWrapper
import MCTS
from TicTacToe.Config import Config
from TicTacToe.TicTacToeAdapter import TicTacToeAdapter


device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")


def play_game(agent, config, opponent_policy, board_size, mcts_simulations=100, alphazero_first=True):
    game = TicTacToeAdapter(board_size)
    tree = MCTS.MCTS(game, game.get_board(), agent, config, device)
    az_player = 'X' if alphazero_first else 'O'
    opponent_player = 'O' if alphazero_first else 'X'

    while not game.is_final():
        turn = game.get_turn()
        current_player = 'X' if turn == 0 else 'O'

        if current_player == az_player:
            tree.reset_search()
            tree.root.board_state = game.get_board()
            tree.search_series(mcts_simulations)

            move = tree.get_temperature_move(tree.root)
        else:
            board_state = tuple(game.env.state.flatten())
            move = opponent_policy[board_state]

        game.execute_move(move)

    outcome = game.get_outcome()
    az_outcome = outcome[0] if az_player == 'X' else outcome[1]

    if az_outcome == 1:
        return 'win'
    elif az_outcome == -1:
        return 'loss'
    else:
        return 'draw'


def evaluate_checkpoint(model_path, config, board_size, games_per_epoch=50, mcts_simulations=100, opponent_type='baseline'):

    h, w, d = config.board_dims[1:]
    agent = ResNet(h, w, d, filters=128, policy_output_dim=config.policy_output_dim, num_res_blocks=4)
    agent = agent.to(device)
    agent.load_state_dict(torch.load(model_path, map_location=device))
    agent.eval()

    if opponent_type == 'baseline':
        opponent_policy = BaselinePolicyWrapper(board_size)
    elif opponent_type == 'random':
        opponent_policy = RandomPolicyWrapper(board_size)
    else:
        raise ValueError(f"Unknown opponent type: {opponent_type}")

    results = {'win': 0, 'loss': 0, 'draw': 0}
    for i in range(games_per_epoch):
        alphazero_first = (i < games_per_epoch // 2)
        outcome = play_game(agent, config, opponent_policy, board_size, mcts_simulations, alphazero_first)
        results[outcome] += 1
    total = sum(results.values())
    results['win_rate'] = results['win'] / total
    results['loss_rate'] = results['loss'] / total
    results['draw_rate'] = results['draw'] / total

    return results


def evaluate_all_checkpoints(model_dir, board_size, games_per_epoch=50, mcts_simulations=100, opponent_type='baseline'):
    config = Config(board_size)
    pt_files = sorted([f for f in os.listdir(model_dir) if f.endswith('.pt')], key=lambda x: int(x.split('.')[0]))

    results = []
    print(f"Evaluating {len(pt_files)} checkpoints with MCTS ({mcts_simulations} simulations per move) vs {opponent_type}...")

    for pt_file in tqdm(pt_files):
        epoch = int(pt_file.split('.')[0])
        model_path = os.path.join(model_dir, pt_file)

        print(f"  Evaluating epoch {epoch}...")
        eval_results = evaluate_checkpoint(model_path, config, board_size, games_per_epoch, mcts_simulations, opponent_type)

        results.append({
            'epoch': epoch,
            'wins': eval_results['win'],
            'losses': eval_results['loss'],
            'draws': eval_results['draw'],
            'win_rate': eval_results['win_rate'],
            'loss_rate': eval_results['loss_rate'],
            'draw_rate': eval_results['draw_rate'],
        })

    return results


def save_results_to_csv(results, output_path):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    fieldnames = ['epoch', 'wins', 'losses', 'draws', 'win_rate', 'loss_rate', 'draw_rate']

    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    print(f"Results saved to {output_path}")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--model_dir', required=True)
    parser.add_argument('--board_size', type=int, default=3)
    parser.add_argument('--games_per_epoch', type=int, default=50)
    parser.add_argument('--mcts_simulations', type=int, default=100)
    parser.add_argument('--opponent', type=str, default='baseline', choices=['baseline', 'random'],
                       help='Opponent type: baseline (heuristic) or random')
    parser.add_argument('--output_dir', default='/home/thomas-nguyen/Projects/AlphaZero/evaluation')

    args = parser.parse_args()
    if not os.path.isdir(args.model_dir):
        print(f"Error: Model directory not found: {args.model_dir}")
        exit(1)

    if args.board_size == 3 and 'size_' in args.model_dir:
        try:
            args.board_size = int(args.model_dir.split('size_')[-1])
            print(f"Detected board size: {args.board_size}")
        except:
            pass

    results = evaluate_all_checkpoints(args.model_dir, args.board_size, args.games_per_epoch, args.mcts_simulations, args.opponent)
    output_filename = f"evaluation_{args.board_size}x{args.board_size}_{args.opponent}.csv"
    output_path = os.path.join(args.output_dir, output_filename)
    save_results_to_csv(results, output_path)

    print("\nEvaluation Summary:")
    print(f"Best epoch: {max(results, key=lambda x: x['win_rate'])['epoch']} "
          f"(win_rate: {max(results, key=lambda x: x['win_rate'])['win_rate']:.2%})")
    print(f"Final epoch win_rate: {results[-1]['win_rate']:.2%}")