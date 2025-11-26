import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy
import itertools
import pickle

from Evaluate.eval import eval_policy

def value_iteration(n=3,gamma=1.0,thresh=0.4, epsilon = 0.25, track_progress=False):
    
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
    

    V = {tuple(state): 0.0 for state in all_states}

    print("Initializing terminal states...")
    for state in terminal_states:
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape(n, n)
        reward = env.check_game_status()
        V[tuple(state)] = reward # the reward of a terminal state depends on who won so this loop is needed

    non_terminal_states.sort(key=lambda s: s.count('_')) 

    # lets eval 4 times per iteration

    cutoff = len(non_terminal_states) // 4
    
    print("Running value iteration...")
    iteration = 0
    while True:
        delta = 0
        iteration += 1
        
        for j,state in tqdm(enumerate(non_terminal_states)):
            env = TicTacToeEnv(n)
            env.state = np.array(state).reshape(n, n)
            skey = tuple(state)
            
            env.set_player_auto()
            possible_actions = env.get_possible_actions()
            
            if len(possible_actions) == 0:
                continue # this shouldnt happen anyways since we are iterating over non-terminal states, but have it just in case
            
            Q = []
            for intended_action in possible_actions:
                expected_value = 0.0

                next_env = TicTacToeEnv(n)
                next_env.state = env.state.copy() 
                next_env.current_player = env.current_player
                next_env.step(intended_action)
                next_state = tuple(next_env.get_flat_state())
                expected_value += (1 - epsilon) *gamma * V[next_state] 
                # probability of taking the intended action is 1-epsilon

                # we also have a probaiblity of not taking that action - i.e. the random action
                random_value = 0.
                for random_action in possible_actions:
                    next_env_random = TicTacToeEnv(n)
                    next_env_random.state = env.state.copy()
                    next_env_random.current_player = env.current_player
                    next_env_random.step(random_action)
                    next_state_random = tuple(next_env_random.get_flat_state())
                    random_value += V[next_state_random]

                random_value = random_value / len(possible_actions)  # we want expectation over random actions treating the random sampling as uniform (because it was)
                expected_value += epsilon * gamma * random_value # this adding completes the probability (1-epsilon) + epsilon = 1

                Q.append(expected_value)
            
            old_v = V[skey]
            if env.current_player == 1:
                V[skey] = max(Q)
            else:
                V[skey] = min(Q)
            
            delta = max(delta, abs(old_v - V[skey]))

            if track_progress and (j % cutoff)-2 == 0: #-2 just in case
                pi_X, pi_O, V_temp = get_policy(all_states, V, n, gamma, epsilon)
                            
                baseline_results.append(eval_policy(n=n,o_policy=pi_O, x_policy=pi_X, runs=5000, opponent='baseline',epsilon=epsilon))
                random_results.append(eval_policy(n=n, x_policy=pi_X, o_policy=pi_O, runs=5000, opponent='random',epsilon=epsilon))
                iter_at_eval.append([iteration,j])

                    
        print(f"Iteration {iteration}, Delta: {delta:.6f}")
        if delta < thresh:
            break
    
    tracked_results = {
        "baseline_results": baseline_results,
        "random_results": random_results,
        "iter_at_eval": iter_at_eval
    }


    pi_X, pi_O, V = get_policy(all_states, V, n, gamma, epsilon)

    policies = {
        "pi_X": pi_X,
        "pi_O": pi_O,
        "V": V
    }

    return tracked_results, policies



def get_policy(all_states, V, n, gamma, epsilon):
    # Get the policies now
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
        for intended_action in possible_actions:
            expected_value = 0.0
            
            # 1-epsilon case for the intended action
            next_env = deepcopy(env)
            next_env.step(intended_action)
            next_state = tuple(next_env.get_flat_state())
            expected_value += (1 - epsilon) * gamma * V[next_state]
            
            # epsilon case for the random action
            random_value = 0.0
            for random_action in possible_actions:
                next_env_random = deepcopy(env)
                next_env_random.step(random_action)
                next_state_random = tuple(next_env_random.get_flat_state())
                random_value += V[next_state_random]
            
            random_value  = random_value / len(possible_actions)
            expected_value += epsilon * gamma * random_value 
            
            action_values.append(expected_value)
        
        if env.current_player == 1:  
            best_idx = np.argmax(action_values)
            pi_X[tuple(state)] = possible_actions[best_idx].item()
        else:  
            best_idx = np.argmin(action_values)
            pi_O[tuple(state)] = possible_actions[best_idx].item()

    return pi_X, pi_O, V




if __name__ == "__main__":
    n = 4
    thresh = 0.2
    gamma = 0.9
    epsilon = 0.25

    tracked_results, (pi_X, pi_O, V) = value_iteration(n=n, thresh=thresh, gamma=gamma, epsilon=epsilon, track_progress = True) # gamma should not be 1
    
    os.makedirs(f"Policies/VI/{n}_{thresh}_{gamma}_{epsilon}", exist_ok=True)
    with open(f"Policies/VI/{n}_{thresh}_{gamma}_{epsilon}/temp_policy_x.pkl", "wb") as f: 
        pickle.dump(pi_X, f)  # agent plays first
    
    with open(f"Policies/VI/{n}_{thresh}_{gamma}_{epsilon}/temp_policy_o.pkl", "wb") as f:
        pickle.dump(pi_O, f)  # agent plays second


    #also save this results to a pickle in the same dir
    with open(f"Policies/VI/{n}_{thresh}_{gamma}_{epsilon}/tracked_results.pkl", "wb") as f:
        pickle.dump(tracked_results, f)
    
    print("done")
                

