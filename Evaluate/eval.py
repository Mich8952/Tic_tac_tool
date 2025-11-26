# this code is for evaluating a given policy versus a random baseline

# input as a policy and output as the win rate over n simulations versus specified opponent

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
import random
from Evaluate.baseline import BaselinePolicyWrapper, RandomPolicyWrapper

def play_policy(env, epsilon, policy):
    state = tuple(env.get_flat_state())
    state = tuple([x.item() for x in state])
    
    if np.random.random() < epsilon:
        action = np.random.choice(env.get_possible_actions()).item()
    else:
        action = policy[state]

    return action


def play_opp(env, epsilon, O_policy):
    if np.random.random() < epsilon:
        action = np.random.choice(env.get_possible_actions()).item()
    else:
        action = O_policy[tuple(env.get_flat_state())]

    return action

def eval_policy(n, x_policy : dict, o_policy : dict, opponent='random', runs = 10, epsilon=0.0): # explicit type setting for policy because its ambigious otherwise 
    # ASSUMPTION 1; LET THE POLICY PLAY FIRST (we can do 50/50 next time)
    
    wins = 0 # policy wins
    draws = 0
    losses = 0

    halfway = runs // 2

    if opponent == 'baseline':
        Opp_policy = BaselinePolicyWrapper(n)
    elif opponent == 'random':
        Opp_policy = RandomPolicyWrapper(n)

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
            action = play_opp(env, epsilon, Opp_policy)
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
        
    for run in range(halfway):   # start with player 2
        terminated = False
        env = TicTacToeEnv(n=n)
        env.reset()

        while not terminated:
            env.set_player_1()
            action = play_opp(env, epsilon, Opp_policy)
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
        
        if result == -1:
            wins+=1
        elif result == 1:
            losses+=1
        elif result == 0:
            draws+=1
        else:
            raise Exception("unexpected result, debug please")
        
        
    return {"win_rate" : wins/runs, "draw_rate": draws/runs, "loss_rate": losses/runs}


if __name__ == "__main__":
    print("\n\n\n\n\n")
    
    import pickle
    
    RUNS = 5000
    """
    #4x4
    print("WITH SKIPPING PROBABILITY 30%")
    print("----4x4----")
    with open("temp_policy_vi_good/temp_policy_x.pkl", "rb") as f:
        x_policy = pickle.load(f)

    with open("temp_policy_vi_good/temp_policy_o.pkl", "rb") as f:
        o_policy = pickle.load(f)

    results_baseline = eval_policy(n=4,o_policy=o_policy, x_policy=x_policy, runs=RUNS, opponent='baseline',epsilon=0.3)
    results_random = eval_policy(n=4, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='random',epsilon=0.3)

    print(f"Number of iterations = {RUNS}")
    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")
    """

    print("\n")
    print("----3x3----")
    
    #3x3
    #with open("Policies/PI/3_0.9_0.25/temp_policy_x.pkl", "rb") as f:
    #    x_policy = pickle.load(f)
    
    #with open("Policies/PI/3_0.9_0.25/temp_policy_o.pkl", "rb") as f:
    #    o_policy = pickle.load(f)

    #print(f"Number of iterations = {RUNS}")
    #results_baseline = eval_policy(n=3, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='baseline',epsilon=0.25)
    #results_random = eval_policy(n=3, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='random',epsilon=0.25)
    #print(f"Playing Against Baseline: {results_baseline}")
    #print(f"Playing Against Random: {results_random}")  

    
    print("\n")
    print("WITH SKIPPING PROBABILITY 0%")
    print("----4x4----")
    with open("Policies/VI/4_0.2_0.9_0.0/temp_policy_x.pkl", "rb") as f:
        x_policy = pickle.load(f)

    with open("Policies/VI/4_0.2_0.9_0.0/temp_policy_o.pkl", "rb") as f:
        o_policy = pickle.load(f)

    results_baseline = eval_policy(n=4,o_policy=o_policy, x_policy=x_policy, runs=RUNS, opponent='baseline',epsilon=0.0)
    results_random = eval_policy(n=4, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='random',epsilon=0.0)

    print(f"Number of iterations = {RUNS}")
    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")

    """

    print("\n")
    print("----3x3----")
    
    #3x3
    with open("temp_policy_vi/temp_policy_x.pkl", "rb") as f:
        x_policy = pickle.load(f)
    
    with open("temp_policy_vi/temp_policy_o.pkl", "rb") as f:
        o_policy = pickle.load(f)

    print(f"Number of iterations = {RUNS}")
    results_baseline = eval_policy(n=3, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='baseline',epsilon=0.0)
    results_random = eval_policy(n=3, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='random',epsilon=0.0)
    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")  
    """