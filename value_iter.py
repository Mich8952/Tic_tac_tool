from board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy

import itertools

def value_iteration(n=3,gamma=1.0,thresh=0.4):
    
    all_states = list(itertools.product(["X", "O", "_"], repeat=n*n)) # cartesian prodcut
    refined_states = []
    for state in tqdm(all_states): # remove all impossible states
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        counts = env.return_play_counts()
        x_count = counts['X']
        o_count = counts['O']
        #if (x_count == o_count or x_count == o_count + 1): # impossible is like if one player played a lot more than the other
        refined_states.append(state)
    all_states = refined_states

    
    V = {tuple(state): 0.0 for state in all_states} # start with all values at 0

    while True:
        delta = 0
        for i,state in enumerate(all_states):
            env = TicTacToeEnv(n)
            env.state = np.array(state).reshape(n, n)
            reward = env.check_game_status()
            skey = tuple(env.get_flat_state())
            if reward is not None:
                V[skey] = reward
                continue # break out of this iter
            env.set_player_auto()
            possible_actions = env.get_possible_actions()
            values = []
            for action in possible_actions:
                next_env = deepcopy(env)
                next_env.step(action)
                next_state = tuple(next_env.get_flat_state())
                values.append(gamma * V[next_state])
            old_v = deepcopy(V[skey])
            if env.current_player == 1:
                V[skey] = max(values) # max the x player
            else:
                V[skey] = min(values) # min the other (0) player
            delta = max(delta, abs(old_v - V[skey])) # tracking delta here and the max of differtnail
        if delta < thresh:
            break

    return V

if __name__ == "__main__":
    res = value_iteration(n=3)
    print("done")
                

