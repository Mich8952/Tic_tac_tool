# this code is for evaluating a given policy versus a random baseline

# input as a policy and output as the win rate over n simulations versus specified opponent

import sys
import os
import pickle
import json
import matplotlib.pyplot as plt
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np



def play_policy(env, epsilon, policy):
    state = tuple(env.get_flat_state())
    state = tuple([x.item() for x in state])
    
    if np.random.random() < epsilon:
        action = np.random.choice(env.get_possible_actions()).item()
    else:
        action = policy[state]

    return action

"""
def play_opp(env, epsilon, O_policy):
    action = O_policy[tuple([x.item() for x in env.get_flat_state()])]

    return action
"""

def eval_policy(n, x_policy : dict, o_policy : dict, runs = 10, epsilon=0.0):
    wins = 0 
    draws = 0
    losses = 0

    halfway = runs // 2

    for run in range(halfway):  
        terminated = False
        env = TicTacToeEnv(n=n)
        env.reset()

        while not terminated:
            env.set_player_1() # player 1 will be the policy
            action = play_policy(env, epsilon, x_policy)
            env.step(action)

            result = env.check_game_status() 
            terminated = result is not None

            if terminated:
                break

            env.set_player_2()
            action = play_policy(env, epsilon, o_policy)
            env.step(action)

            result = env.check_game_status() 
            terminated = result is not None

            #dont need to do the if terminated break here because the loop is done here
        
        if result == 1:
            wins+=1
        elif result == -1:
            losses+=1
        elif result == 0:
            draws+=1
        else:
            raise Exception("unexpected result, debug please")

        
    return {"win_rate" : wins/runs, "draw_rate": draws/runs, "loss_rate": losses/runs}
    
    


if __name__ == "__main__":
    RUNS = 5000
    epsilon = 0.25
    
    # set x policy
    X_POLICY = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/VI/3_0.2_0.9_0.25/temp_policy_x.pkl"
    with open(X_POLICY,"rb") as f:
        x_policy = pickle.load(f)


    # set O policy
    O_POLICY = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/VI/3_0.2_0.9_0.25/temp_policy_o.pkl"
    with open(O_POLICY,"rb") as f:
        o_policy = pickle.load(f)


    res = eval_policy(n=3,x_policy=x_policy,o_policy=o_policy, runs=RUNS,epsilon=epsilon)

    print(res)

    #NOTE TODO: save to csv but let both sides of the pliocy play
    


    

