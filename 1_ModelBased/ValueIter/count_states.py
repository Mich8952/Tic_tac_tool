
from tqdm import tqdm
import numpy as np
import itertools
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np


def count_refined_states(n):
    all_states = list(itertools.product(["X", "O", "_"], repeat=n*n)) # cartesian prodcut
    refined_states = []
    terminal_states = []
    non_terminal_states = []

    baseline_results = []
    random_results = []
    iter_at_eval = []
    
    print("Filtering valid states...")
    for state in tqdm(all_states): # remove all impossible states
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        counts = env.return_play_counts()
        x_count = counts['X']
        o_count = counts['O']
        
        if (x_count == o_count or x_count == o_count + 1):
            refined_states.append(state)
            if env.check_game_status() is not None:
                terminal_states.append(state)
            else:
                non_terminal_states.append(state)
    
    all_states = refined_states
    print(f"Valid states: {len(all_states)}, Terminal: {len(terminal_states)}, Non-terminal: {len(non_terminal_states)}")

if __name__ == "__main__":
    n = 4
    count_refined_states(n)