# this code is for evaluating a given policy versus a random baseline

# input as a policy and output as the win rate over n simulations versus specified opponent

from board_util import TicTacToeEnv
import numpy as np
import random
from baseline import BaselinePolicyWrapper, RandomPolicyWrapper


def eval_policy(n, policy : dict, opponent='random', runs = 10, epsilon=0.0): # explicit type setting for policy because its ambigious otherwise 
    # ASSUMPTION 1; LET THE POLICY PLAY FIRST (we can do 50/50 next time)
    
    wins = 0 # policy wins
    draws = 0
    losses = 0

    if opponent == 'baseline':
        O_policy = BaselinePolicyWrapper(n)
    elif opponent == 'random':
        O_policy = RandomPolicyWrapper(n)

    for run in range(runs):
        terminated = False
        env = TicTacToeEnv(n=n)
        env.reset()

        while not terminated:
            env.set_player_1() # player 1 will be the policy
            state = tuple(env.get_flat_state())
            
            if np.random.random() < epsilon:
                action = np.random.choice(env.get_possible_actions()).item()
            else:
                action = policy[state]

            env.step(action)

            result = env.check_game_status() 
            terminated = result is not None

            if terminated:
                break

            env.set_player_2()
            
            if np.random.random() < epsilon:
                action = np.random.choice(env.get_possible_actions()).item()
            else:
                action = O_policy[tuple(env.get_flat_state())]

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
    print("\n\n\n\n\n")
    import pickle
    RUNS = 1000
    #4x4
    print("----4x4----")
    with open("temp_policy_vi_good/temp_policy_x.pkl", "rb") as f:
        policy = pickle.load(f)

    results_baseline = eval_policy(n=4, policy=policy, runs=RUNS, opponent='baseline')
    results_random = eval_policy(n=4, policy=policy, runs=RUNS, opponent='random')

    print(f"Number of iterations = {RUNS}")
    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")

    print("\n")
    print("----3x3----")
    
    #3x3
    with open("temp_policy_vi/temp_policy_x.pkl", "rb") as f:
        policy = pickle.load(f)

    print(f"Number of iterations = {RUNS}")
    results_baseline = eval_policy(n=3, policy=policy, runs=RUNS, opponent='baseline')
    results_random = eval_policy(n=3, policy=policy, runs=RUNS, opponent='random')

    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")