import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy
import itertools
import random
import pickle

from Evaluate.eval import eval_policy

def get_states(n=3):
    all_states = list(itertools.product(["X", "O", "_"], repeat=n*n)) # cartesian prodcut
    refined_states = []
    terminal_states = []
    non_terminal_states = []
    
    for state in tqdm(all_states): # remove all impossible states
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        status = env.check_game_status()
        counts = env.return_play_counts()
        x_count = counts['X']
        o_count = counts['O']
        
        if (x_count == o_count or x_count == o_count + 1):
            is_terminal = status is not None
            refined_states.append([state, is_terminal])
            if is_terminal:
                terminal_states.append([state, True])
            else:
                non_terminal_states.append([state, False])
    
    print(f"Total valid: {len(refined_states)}, Terminal: {len(terminal_states)}, Non-terminal: {len(non_terminal_states)}")
    return refined_states, terminal_states, non_terminal_states

class PolicyItr:
    def __init__(self,n=3):
        self.all_states, self.terminal_states, self.non_terminal_states = get_states(n=n)
        self.n = n
        self.baseline_results = []
        self.random_results = []
        self.iter_at_eval = []
        self.action_calls_in_iteration = 0

    @staticmethod 
    def set_policy_random(all_states, n):
        pi = {}
        pi_bar = {}
        for state in tqdm(all_states):
            env = TicTacToeEnv(n)
            env.state = np.array(state[0]).reshape((n, n))
            env.set_player_auto()  
            possible_actions = env.get_possible_actions()
            
            if env.check_game_status() is None:
                pi[tuple(state[0])] = random.choice(possible_actions).item()
                pi_bar[tuple(state[0])] = random.choice(possible_actions).item()
        return pi, pi_bar
        
    def eval(self, pi_X, pi_O, V, epsilon=0.1, gamma=0.9, slip_prob=0.0,MaxIter=10):
        print("EVAL")
        for state in tqdm(self.all_states):
            if state[1]:
                env = TicTacToeEnv(self.n)
                env.state = np.array(state[0]).reshape((self.n, self.n))
                reward = env.check_game_status()
                V[tuple(state[0])] = float(reward) if reward is not None else 0.0
        
        delta = float('inf')
        k = 0
        
        while delta > epsilon and k < MaxIter:
            delta = 0  
            V_new = V.copy()
            
            for state in tqdm(self.non_terminal_states):
                    
                state_tuple = tuple(state[0])
                env = TicTacToeEnv(self.n)
                env.state = np.array(state[0]).reshape((self.n, self.n))
                env.set_player_auto()
                possible_actions = env.get_possible_actions()
                self.action_calls_in_iteration += 1
                
                if env.current_player == 1:
                    intended_action = pi_X[state_tuple]
                else:
                    intended_action = pi_O[state_tuple]
                
                expected_value = 0.0
                
                next_env = TicTacToeEnv(self.n)
                next_env.state = env.state.copy()
                next_env.current_player = env.current_player
                next_env.step(intended_action)
                next_state_tuple = tuple(next_env.state.flatten())
                reward = next_env.check_game_status()
                if reward is None:
                    reward = 0.0
                else:
                    reward = float(reward)
                
                expected_value += (1 - slip_prob) * (reward + gamma * V[next_state_tuple])
                # probability of taking the intended action is 1-epsilon
                
                # we also have a probaiblity of not taking that action - i.e. the random action
                random_value = 0.0
                for random_action in possible_actions:
                    next_env_random = TicTacToeEnv(self.n)
                    next_env_random.state = env.state.copy()
                    next_env_random.current_player = env.current_player
                    next_env_random.step(random_action)
                    next_state_random = tuple(next_env_random.state.flatten())
                    reward_random = next_env_random.check_game_status()
                    if reward_random is None:
                        reward_random = 0.0
                    else:
                        reward_random = float(reward_random)
                    random_value += reward_random + gamma * V[next_state_random]
                
                random_value = random_value / len(possible_actions)  # we want expectation over random actions treating the random sampling as uniform (because it was)
                expected_value += slip_prob * random_value # this adding completes the probability (1-epsilon) + epsilon = 1
                
                V_new[state_tuple] = expected_value
                
                delta = max(delta, abs(V_new[state_tuple] - V[state_tuple]))
            
            V = V_new
            k += 1
            
            if k % 10 == 0:
                print(f"Iteration {k} with delta: {delta}")
        
        return V 
    
    def improve(self, V, gamma=0.9, slip_prob=0.0):
        pi_X = {}
        pi_O = {}
        print("IMRPOV")
        for state in tqdm(self.non_terminal_states):
                
            env = TicTacToeEnv(self.n)
            env.state = np.array(state[0]).reshape((self.n, self.n))
            env.set_player_auto()

            possible_actions = env.get_possible_actions()
            self.action_calls_in_iteration += 1

            if len(possible_actions) == 0:
                continue

            action_values = []
            for intended_action in possible_actions:
                expected_value = 0.0
                
                next_env = TicTacToeEnv(self.n)
                next_env.state = env.state.copy()
                next_env.current_player = env.current_player
                next_env.step(intended_action)
                rwd = next_env.check_game_status()
                next_state_tuple = tuple(next_env.state.flatten())

                if rwd is None:
                    rwd = 0.0
                else:
                    rwd = float(rwd)
                    
                expected_value += (1 - slip_prob) * (rwd + gamma * V[next_state_tuple])
                # probability of taking the intended action is 1-epsilon
                
                # we also have a probaiblity of not taking that action - i.e. the random action
                random_value = 0.0
                for random_action in possible_actions:
                    next_env_random = TicTacToeEnv(self.n)
                    next_env_random.state = env.state.copy()
                    next_env_random.current_player = env.current_player
                    next_env_random.step(random_action)
                    rwd_random = next_env_random.check_game_status()
                    next_state_random = tuple(next_env_random.state.flatten())
                    if rwd_random is None:
                        rwd_random = 0.0
                    else:
                        rwd_random = float(rwd_random)
                    random_value += rwd_random + gamma * V[next_state_random]
                
                random_value = random_value / len(possible_actions)  # we want expectation over random actions treating the random sampling as uniform (because it was)
                expected_value += slip_prob * random_value # this adding completes the probability (1-slip_prob) + slip_prob = 1
                
                action_values.append(expected_value)
            
            
            if env.current_player == 1:
                best_idx = np.argmax(action_values)
                pi_X[tuple(state[0])] = possible_actions[best_idx].item()
            else:
                best_idx = np.argmin(action_values)
                pi_O[tuple(state[0])] = possible_actions[best_idx].item()
  
        return pi_X, pi_O
            
        
            
    def loop(self, max_iters=100, gamma=0.9, slip_prob=0.0, epsilon=0.1, track_progress=False):
        pi_X,pi_X_bar = PolicyItr.set_policy_random(self.all_states, self.n)
        pi_O,pi_O_bar = PolicyItr.set_policy_random(self.all_states, self.n)

        V = {tuple(state[0]): 0.0 if state[1] else random.random() for state in self.all_states}

        i = 0
        while (pi_X != pi_X_bar or pi_O != pi_O_bar) and i < max_iters:
            
            self.action_calls_in_iteration = 0  # Reset counter at start of each iteration
            
            V = self.eval(pi_X, pi_O, V, gamma=gamma, slip_prob=slip_prob, epsilon=epsilon)
            
            
            pi_X = pi_X_bar.copy()
            pi_O = pi_O_bar.copy()
            
            
            pi_X_bar, pi_O_bar = self.improve(V, gamma=gamma, slip_prob=slip_prob)
            
            i += 1
            if i % 10 == 0:
                print(f"Iteration {i}")
            
            if track_progress:
                print(f"Evaluating policy at iteration {i} (action_calls: {self.action_calls_in_iteration})")
                self.baseline_results.append(eval_policy(n=self.n, o_policy=pi_O_bar, x_policy=pi_X_bar, runs=5000, opponent='baseline', epsilon=slip_prob))
                self.random_results.append(eval_policy(n=self.n, x_policy=pi_X_bar, o_policy=pi_O_bar, runs=5000, opponent='random', epsilon=slip_prob))
                self.iter_at_eval.append([i, self.action_calls_in_iteration])

        tracked_results = {
            "baseline_results": self.baseline_results,
            "random_results": self.random_results,
            "iter_at_eval": self.iter_at_eval
        }
        
        return pi_X_bar, pi_O_bar, V, tracked_results


if __name__ == "__main__":
    n = 4
    gamma = 0.9
    slip_prob = 0.25
    epsilon = 0.1 # this is for a thresh, kind of a misnomer tbh and I should change #TODO

    piter = PolicyItr(n=n)
    pi_X, pi_O, V, tracked_results = piter.loop(max_iters=8, gamma=gamma, slip_prob=slip_prob, epsilon=epsilon, track_progress=True)

    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    policy_dir = os.path.join(script_dir, f"Policies/PI/{n}_{gamma}_{slip_prob}")
    os.makedirs(policy_dir, exist_ok=True)
    with open(os.path.join(policy_dir, "temp_policy_x.pkl"), "wb") as f:
        pickle.dump(pi_X, f) # agent plays first
    
    with open(os.path.join(policy_dir, "temp_policy_o.pkl"), "wb") as f:
        pickle.dump(pi_O, f) # agent plays second
    
    with open(os.path.join(policy_dir, "tracked_results.pkl"), "wb") as f:
        pickle.dump(tracked_results, f)

    print("done")
