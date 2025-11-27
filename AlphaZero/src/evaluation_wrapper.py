import torch
import numpy as np
import os
import sys
import pickle
import argparse
from multiprocessing import Pool, get_context

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from Resnet import ResNet
import MCTS
from Config import Config
from Utils.TicTacToeAdapter import TicTacToeAdapter
from Utils.board_util import TicTacToeEnv
from Evaluate.eval import eval_policy, export_results_to_json

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

class AlphaZeroPolicy:

    def __init__(self, model, config, device, board_size, mcts_simulations=100):
        self.model = model
        self.config = config
        self.device = device
        self.board_size = board_size
        self.mcts_simulations = mcts_simulations

    def __getitem__(self, state_tuple):
        board = self._reconstruct_board(state_tuple)

        adapter = TicTacToeAdapter(self.board_size)
        adapter.env.state = board.copy()
        adapter.env.terminated = False

        x_count = np.sum(board == 'X')
        o_count = np.sum(board == 'O')
        num_moves = x_count + o_count
        adapter.history = list(range(num_moves))
        adapter.state_stack = []

        tree = MCTS.MCTS(adapter, adapter.get_board(), self.model, self.config, self.device)
        tree.search_series(self.mcts_simulations)

        move = tree.get_most_searched_move(tree.root)
        return move

    def _reconstruct_board(self, state_tuple):
        board = np.array(state_tuple, dtype=str).reshape((self.board_size, self.board_size))
        return board


def eval_worker(args):
    model_path, board_size, mcts_simulations, epsilon, games, opponent, gpu_id = args
    worker_device = torch.device(f'cuda:{gpu_id}' if torch.cuda.is_available() else 'cpu')
    config = Config(board_size)
    h, w, d = config.board_dims[1:]
    model = ResNet(h, w, d, filters=128, policy_output_dim=config.policy_output_dim, num_res_blocks=4)
    model.to(worker_device)
    model.load_state_dict(torch.load(model_path, map_location=worker_device, weights_only=True))
    model.eval()
    policy = AlphaZeroPolicy(model, config, worker_device, board_size, mcts_simulations)
    result = eval_policy(n=board_size, x_policy=policy, o_policy=policy, runs=games, opponent=opponent, epsilon=epsilon)
    return result


def aggregate_results(results_list):
    avg_win = np.mean([r['win_rate'] for r in results_list])
    avg_draw = np.mean([r['draw_rate'] for r in results_list])
    avg_loss = np.mean([r['loss_rate'] for r in results_list])
    return {'win_rate': avg_win, 'draw_rate': avg_draw, 'loss_rate': avg_loss}


def evaluate_checkpoints(model_dir, board_size, games_per_checkpoint, mcts_simulations, epsilon, output_dir, evaluate_every, num_workers=30):
    
    pt_files = sorted([f for f in os.listdir(model_dir) if f.endswith('.pt')], key=lambda x: int(x.split('.')[0]))
    pt_files_to_eval = pt_files[::evaluate_every]

    print(f"Found {len(pt_files)} total checkpoints")
    print(f"Evaluating {len(pt_files_to_eval)} checkpoints (every {evaluate_every})")
    print(f"Games per checkpoint: {games_per_checkpoint}")
    print(f"MCTS simulations per move: {mcts_simulations}")
    print(f"Epsilon: {epsilon}\n")

    baseline_results = []
    random_results = []
    iter_at_eval = []

    for i, pt_file in enumerate(pt_files_to_eval):
        epoch = int(pt_file.split('.')[0])
        model_path = os.path.join(model_dir, pt_file)

        print(f"[{i+1}/{len(pt_files_to_eval)}] Evaluating checkpoint {epoch}...")

        # Distribute games across workers
        games_per_worker = games_per_checkpoint // num_workers

        print(f"  Running baseline evaluation with {num_workers} workers ({games_per_worker} games each)...")
        with get_context("spawn").Pool(processes=num_workers) as pool:
            baseline_args = [(model_path, board_size, mcts_simulations, epsilon, games_per_worker, 'baseline', i % 2) for i in range(num_workers)]
            baseline_worker_results = pool.map(eval_worker, baseline_args)
        baseline_result = aggregate_results(baseline_worker_results)

        print(f"  Running random evaluation with {num_workers} workers ({games_per_worker} games each)...")
        with get_context("spawn").Pool(processes=num_workers) as pool:
            random_args = [(model_path, board_size, mcts_simulations, epsilon, games_per_worker, 'random', i % 2) for i in range(num_workers)]
            random_worker_results = pool.map(eval_worker, random_args)
        random_result = aggregate_results(random_worker_results)

        baseline_results.append(baseline_result)
        random_results.append(random_result)
        iter_at_eval.append([epoch, 0])

        print(f"Baseline: W={baseline_result['win_rate']:.2%} D={baseline_result['draw_rate']:.2%} L={baseline_result['loss_rate']:.2%}")
        print(f"Random:   W={random_result['win_rate']:.2%} D={random_result['draw_rate']:.2%} L={random_result['loss_rate']:.2%}\n")

    results = {
        'baseline_results': baseline_results,
        'random_results': random_results,
        'iter_at_eval': iter_at_eval
    }

    if output_dir is None:
        output_dir = model_dir
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, 'alphazero_evaluation.pkl')
    with open(output_path, 'wb') as f:
        pickle.dump(results, f)

    return results

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--model_dir', required=True)
    parser.add_argument('--board_size', type=int, default=3)
    parser.add_argument('--games', type=int, default=4500)
    parser.add_argument('--mcts_sims', type=int, default=100)
    parser.add_argument('--epsilon', type=float, default=0.25)
    parser.add_argument('--output_dir', default = None)
    parser.add_argument('--every', type=int, default=5)
    parser.add_argument('--workers', type=int, default=30)

    args = parser.parse_args()

    results = evaluate_checkpoints(
        model_dir = args.model_dir,
        board_size=args.board_size,
        games_per_checkpoint=args.games,
        mcts_simulations=args.mcts_sims,
        epsilon=args.epsilon,
        output_dir = args.output_dir,
        evaluate_every=args.every,
        num_workers=args.workers
    )

    board_size_dir = os.path.basename(args.model_dir.rstrip('/'))
    output_dir = os.path.join(r"/home/thomas-nguyen/Projects/Tic_tac_tool/Policies/AlphaZero", board_size_dir)
    export_results_to_json(results, output_dir)