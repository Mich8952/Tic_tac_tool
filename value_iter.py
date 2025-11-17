from board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy

import itertools
import pickle

def value_iteration(n=3,gamma=1.0,thresh=0.4):
    
    all_states = list(itertools.product(["X", "O", "_"], repeat=n*n)) # cartesian prodcut
    refined_states = []
    terminal_states = []
    non_terminal_states = []
    
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
    

    V = {tuple(state): 0.0 for state in all_states}

    print("Initializing terminal states...")
    for state in terminal_states:
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape(n, n)
        reward = env.check_game_status()
        V[tuple(state)] = reward

    non_terminal_states.sort(key=lambda s: s.count('_'))
    
    print("Running value iteration...")
    iteration = 0
    while True:
        delta = 0
        iteration += 1
        
        for state in non_terminal_states:
            env = TicTacToeEnv(n)
            env.state = np.array(state).reshape(n, n)
            skey = tuple(state)
            
            env.set_player_auto()
            possible_actions = env.get_possible_actions()
            
            if len(possible_actions) == 0:
                continue
            
            values = []
            for action in possible_actions:
                next_env = TicTacToeEnv(n)
                next_env.state = env.state.copy() 
                next_env.current_player = env.current_player
                next_env.step(action)
                next_state = tuple(next_env.get_flat_state())
                values.append(gamma * V[next_state])
            
            old_v = V[skey]
            if env.current_player == 1:
                V[skey] = max(values)
            else:
                V[skey] = min(values)
            
            delta = max(delta, abs(old_v - V[skey]))
        
        print(f"Iteration {iteration}, Delta: {delta:.6f}")
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
                

