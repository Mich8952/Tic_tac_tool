from board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy

import itertools
import random

def get_states(n=3):
    all_states = list(itertools.product(["X", "O", "_"], repeat=n*n)) # cartesian prodcut
    refined_states = []
    for state in tqdm(all_states): # remove all impossible states
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        status = env.check_game_status()
        counts = env.return_play_counts()
        x_count = counts['X']
        o_count = counts['O']
        if (x_count == o_count or x_count == o_count + 1): # impossible is like if one player played a lot more than the other
            refined_states.append([state,status is not None])
    return refined_states

class PolicyItr:
    def __init__(self,n=3):
        self.all_states = get_states(n=3)
        self.n = n


        print("")

    @staticmethod 
    def set_policy_random(pi, all_states, n):
        pi = {}
        for state in all_states:
            env = TicTacToeEnv(n)
            env.state = np.array(state[0]).reshape((n, n))
            env.set_player_auto()  
            possible_actions = env.get_possible_actions()
            
            if env.check_game_status() is None:
                pi[tuple(state[0])] = random.choice(possible_actions).item()
        return pi
        
    def eval(self, pi, V, epsilon=1e-4, gamma=0.9):
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
            V_new = deepcopy(V)
            
            for state in self.all_states:
                if state[1]:  
                    continue # the value is zero and continues to be zero so just keep going (ignore the below)
                    
                state_tuple = tuple(state[0])
                env = TicTacToeEnv(self.n)
                env.state = np.array(state[0]).reshape((self.n, self.n))
                env.set_player_auto()
                
                action = pi[state_tuple] # get next action
                
                env_copy = deepcopy(env)
                env_copy.step(action)
                next_state_tuple = tuple(env_copy.get_flat_state()) # next state after taking that action
                
                
                reward = env_copy.check_game_status()
                if reward is None: # not terminated
                    reward = 0.0
                else:
                    reward = float(reward) # terminated game
                
                
                
                V_new[state_tuple] = reward + gamma* V[next_state_tuple]
                
                
                delta = max(delta, abs(V_new[state_tuple] - V[state_tuple]))
            
            V = V_new
            k += 1
            
            if k % 10 == 0:
                print(f"Iteration {k} with delta: {delta}")
        
        return V 
    
    def improve(self,V, gamma= 0.9):
        pi_star = {}
        for state in self.all_states:
            if state[1]: # terminal skipp
                continue
            env = TicTacToeEnv(self.n)
            env.state = np.array(state[0]).reshape((self.n, self.n))
            env.set_player_auto()  

            possible_actions = env.get_possible_actions()

            if len(possible_actions) == 0:
                continue

            action_values = []
            for action in possible_actions:
                clone_env = deepcopy(env)
                clone_env.step(action)
                rwd = clone_env.check_game_status()
                next_state_tuple = tuple(clone_env.get_flat_state())

                if rwd is None:
                    rwd = 0.0 # recheck because this is also a draw, but we dont want to return none
                else:
                    rwd = float(rwd)
                    
                q = rwd + gamma*V[next_state_tuple]
                action_values.append(q)
                    
            if env.current_player == 1:  # X player
                best_idx = np.argmax(action_values)
            else:  # y player
                best_idx = np.argmin(action_values)  
            
            pi_star[tuple(state[0])] = possible_actions[best_idx].item()
  
        return pi_star
            
        
            
    def loop(self, max_iters=100):
        pi = {}
        pi_bar = {}
        
        pi_bar = PolicyItr.set_policy_random(pi_bar, self.all_states,self.n)
        pi = PolicyItr.set_policy_random(pi, self.all_states,self.n)
        V = {tuple(state[0]): 0.0 if state[1] else random.random() for state in self.all_states}

        i =0 
        while pi != pi_bar and i < max_iters:
            V = self.eval(pi, V)
            pi = deepcopy(pi_bar) # weird lecture thing
            pi_bar = self.improve(V)
            i+=1

            if i % 10 == 0:
                print(i)

        return pi_bar, V


if __name__ == "__main__":
    piter = PolicyItr(n=3)
    optimal_policy, optimal_values = piter.loop()  
    print("EOF")
