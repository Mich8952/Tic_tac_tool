import sys
import os
import argparse
import csv
import numpy as np
import matplotlib.pyplot as plt

# Add src directory to path to handle imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


def load_csv(csv_path):
    results = {
        'epoch': [],
        'wins': [],
        'losses': [],
        'draws': [],
        'win_rate': [],
        'loss_rate': [],
        'draw_rate': []
    }

    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            results['epoch'].append(int(row['epoch']))
            results['wins'].append(int(row['wins']))
            results['losses'].append(int(row['losses']))
            results['draws'].append(int(row['draws']))
            results['win_rate'].append(float(row['win_rate']))
            results['loss_rate'].append(float(row['loss_rate']))
            results['draw_rate'].append(float(row['draw_rate']))

    return results


def plot_results(results, output_path=None):
    epochs = results['epoch']
    win_rates = results['win_rate']
    loss_rates = results['loss_rate']
    draw_rates = results['draw_rate']

    fig, axes = plt.subplots(1, 2, figsize=(16, 5))
    fig.suptitle('AlphaZero Training Evaluation vs Baseline', fontsize=16, fontweight='bold')

    # Plot 1: All Outcome Rates
    ax = axes[0]
    ax.plot(epochs, win_rates, 'g-', linewidth=2, label='Win Rate')
    ax.plot(epochs, loss_rates, 'r-', linewidth=2, label='Loss Rate')
    ax.plot(epochs, draw_rates, 'b-', linewidth=2, label='Draw Rate')
    ax.set_xlabel('Epoch', fontsize=11)
    ax.set_ylabel('Rate', fontsize=11)
    ax.set_title('All Outcome Rates', fontsize=12, fontweight='bold')
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3)
    ax.set_ylim([0, 1])

    # Plot 2: Game Counts Stacked Bar
    ax = axes[1]
    wins = results['wins']
    losses = results['losses']
    draws = results['draws']
    ax.bar(epochs, wins, label='Wins', color='green', alpha=0.7)
    ax.bar(epochs, losses, bottom=wins, label='Losses', color='red', alpha=0.7)
    ax.bar(epochs, draws, bottom=np.array(wins)+np.array(losses), label='Draws', color='blue', alpha=0.7)
    ax.set_xlabel('Epoch', fontsize=11)
    ax.set_ylabel('Game Count', fontsize=11)
    ax.set_title('Game Outcomes (Stacked)', fontsize=12, fontweight='bold')
    ax.legend(fontsize=10)
    ax.grid(True, alpha=0.3, axis='y')

    plt.tight_layout()
    if output_path:
        plt.savefig(output_path, dpi=150, bbox_inches='tight')
        print(f"Plot saved to {output_path}")
    else:
        plt.show()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--csv_file', required=True)
    parser.add_argument('--output', default=None)
    parser.add_argument('--output_dir', default='/home/thomas-nguyen/Projects/AlphaZero/evaluation_plots')
    parser.add_argument('--no_plot', action='store_true')
    args = parser.parse_args()

    # Verify CSV exists
    if not os.path.isfile(args.csv_file):
        print(f"Error: CSV file not found: {args.csv_file}")
        exit(1)

    # Load results
    print(f"Loading results from {args.csv_file}...")
    results = load_csv(args.csv_file)

    # Generate plot
    if not args.no_plot:
        if args.output is None:
            os.makedirs(args.output_dir, exist_ok=True)
            base_name = os.path.splitext(os.path.basename(args.csv_file))[0]
            args.output = os.path.join(args.output_dir, f"{base_name}_plot.png")

        plot_results(results, args.output)
    else:
        print("(Plot generation skipped with --no_plot flag)")


if __name__ == '__main__':
    main()
