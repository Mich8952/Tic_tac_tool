from board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy

import itertools
import random
import pickle

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
        
        if (x_count == o_count or x_count == o_count + 1): # only valid states
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
        
    def eval(self, pi_X, pi_O, V, epsilon=0.1, gamma=0.9):
        
        for state in self.all_states:
            if state[1]:
                env = TicTacToeEnv(self.n)
                env.state = np.array(state[0]).reshape((self.n, self.n))
                reward = env.check_game_status()
                V[tuple(state[0])] = float(reward) if reward is not None else 0.0
        
        delta = float('inf')
        k = 0
        
        while delta > epsilon:
            delta = 0  
            V_new = V.copy()
            
            for state in self.non_terminal_states: 
                    
                state_tuple = tuple(state[0])
                env = TicTacToeEnv(self.n)
                env.state = np.array(state[0]).reshape((self.n, self.n))
                env.set_player_auto()
                
                
                if env.current_player == 1:  # Xs turn
                    action = pi_X[state_tuple]
                else:  # y s turn
                    action = pi_O[state_tuple]
                
                next_env = TicTacToeEnv(self.n)
                next_env.state = env.state.copy()
                next_env.current_player = env.current_player
                next_env.step(action)
                next_state_tuple = tuple(next_env.state.flatten())
                
                reward = next_env.check_game_status()
                if reward is None:
                    reward = 0.0
                else:
                    reward = float(reward)
                
                V_new[state_tuple] = reward + gamma * V[next_state_tuple]
                
                delta = max(delta, abs(V_new[state_tuple] - V[state_tuple]))
            
            V = V_new
            k += 1
            
            if k % 10 == 0:
                print(f"Iteration {k} with delta: {delta}")
        
        return V 
    
    def improve(self, V, gamma=0.9):
        pi_X = {}
        pi_O = {}
        
        for state in tqdm(self.non_terminal_states):
                
            env = TicTacToeEnv(self.n)
            env.state = np.array(state[0]).reshape((self.n, self.n))
            env.set_player_auto()

            possible_actions = env.get_possible_actions()

            if len(possible_actions) == 0:
                continue

            action_values = []
            for action in possible_actions:
                next_env = TicTacToeEnv(self.n)
                next_env.state = env.state.copy()
                next_env.current_player = env.current_player
                next_env.step(action)
                rwd = next_env.check_game_status()
                next_state_tuple = tuple(next_env.state.flatten())

                if rwd is None: # this is redundant since we check terminal states earlier, but leave it for now
                    rwd = 0.0
                else:
                    rwd = float(rwd)
                    
                q = rwd + gamma * V[next_state_tuple]
                action_values.append(q)
            
            
            if env.current_player == 1:  # X player maximizes
                best_idx = np.argmax(action_values)
                pi_X[tuple(state[0])] = possible_actions[best_idx].item()
            else:  # y player minimizes
                best_idx = np.argmin(action_values)
                pi_O[tuple(state[0])] = possible_actions[best_idx].item()
  
        return pi_X, pi_O
            
        
            
    def loop(self, max_iters=100):
        pi_X,pi_X_bar = PolicyItr.set_policy_random(self.all_states, self.n)
        pi_O,pi_O_bar = PolicyItr.set_policy_random(self.all_states, self.n)

        V = {tuple(state[0]): 0.0 if state[1] else random.random() for state in self.all_states}

        i = 0
        while (pi_X != pi_X_bar or pi_O != pi_O_bar) and i < max_iters:
            
            V = self.eval(pi_X, pi_O, V)
            
            
            pi_X = pi_X_bar.copy()
            pi_O = pi_O_bar.copy()
            
            
            pi_X_bar, pi_O_bar = self.improve(V)
            
            i += 1
            if i % 10 == 0:
                print(f"Iteration {i}")

        return pi_X_bar, pi_O_bar, V


if __name__ == "__main__":
    # the delta i have set by default seems a little bit extreme
    piter = PolicyItr(n=4)
    pi_X, pi_O, V = piter.loop(max_iters=8)  

    with open("temp_policy_pi/temp_policy_x.pkl", "wb") as f:
        pickle.dump(pi_X, f) # agent plays first
    
    with open("temp_policy_pi/temp_policy_o.pkl", "wb") as f:
        pickle.dump(pi_O, f) # agent plays second

    print("EOF")
