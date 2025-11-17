from board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy

import itertools
import pickle

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
        for i,state in enumerate(tqdm(all_states)):
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
            print(delta)
        if delta < thresh:
            break
    
    pi_X = {}
    pi_O = {}
    
    for state in tqdm(all_states):
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        
        if env.check_game_status() is not None:
            continue #ignore terminal states
            
        env.set_player_auto()
        possible_actions = env.get_possible_actions()
        
        if len(possible_actions) == 0:
            continue
        
        action_values = []
        for action in possible_actions:
            next_env = deepcopy(env)
            next_env.step(action)
            next_state = tuple(next_env.get_flat_state())
            action_values.append(gamma *V[next_state]) # no inmediate reward because rwds are just 0 for any step that doesnt terminate
        
        if env.current_player == 1:  
            best_idx = np.argmax(action_values)
            pi_X[tuple(state)] = possible_actions[best_idx].item()
        else:  
            best_idx = np.argmin(action_values)
            pi_O[tuple(state)] = possible_actions[best_idx].item()

    return pi_X, pi_O, V

if __name__ == "__main__":
    pi_X, pi_O, V = value_iteration(n=4, thresh=0.2,gamma=0.9) # gamma should not be 1
    
    with open("temp_policy_vi/temp_policy_x.pkl", "wb") as f: 
        pickle.dump(pi_X, f)  # agent plays first
    
    with open("temp_policy_vi/temp_policy_o.pkl", "wb") as f:
        pickle.dump(pi_O, f)  # agent plays second
    
    print("done")
                

