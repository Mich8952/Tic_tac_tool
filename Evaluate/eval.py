# this code is for evaluating a given policy versus a random baseline

# input as a policy and output as the win rate over n simulations versus specified opponent

import sys
import os
import json
import matplotlib.pyplot as plt
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
import random
from Evaluate.baseline import RandomPolicyWrapper#, BaselinePolicyWrapper
from Evaluate.lecture_baseline import LectureBaselinePolicyWrapper as BaselinePolicyWrapper
#from Evaluate.lecture_baseline_revised import LectureBaselinePolicyWrapper as BaselinePolicyWrapper

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
    if opponent == "baseline":
        ... #print(f"first half win rate : wins: {wins}, losses: {losses}, draws: {draws}")
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


def plot_results(results_dict, title):
    baseline = results_dict['baseline_results']
    random = results_dict['random_results']

    baseline_win_rates = [x['win_rate'] for x in baseline]
    random_win_rates = [x['win_rate'] for x in random]

    baseline_draw_rates = [x['draw_rate'] for x in baseline]
    random_draw_rates = [x['draw_rate'] for x in random]

    baseline_loss_rates = [x['loss_rate'] for x in baseline]
    random_loss_rates = [x['loss_rate'] for x in random]

    iterations = results_dict['iter_at_eval']
    # convert to true iteration
    total_states = max(it[1] for it in iterations) + 1 # approx number of states
    iteration_steps = [(it[0]-1) * total_states + it[1] for it in iterations] #-1 because in VI we start counting at 1


    fig, ax = plt.subplots(1,2, figsize=(12,5))
    ax[0].set_title('Baseline Rates')
    ax[0].plot(iteration_steps, baseline_win_rates, label='Win Rate')
    ax[0].plot(iteration_steps, baseline_draw_rates, label='Draw Rate')
    ax[0].plot(iteration_steps, baseline_loss_rates, label='Loss Rate')
    ax[0].set_xlabel('Evaluation Step')
    ax[0].legend()
    ax[0].set_ylabel('Rate')

    ax[1].set_title('Random Rates')
    ax[1].plot(iteration_steps, random_win_rates, label='Win Rate')
    ax[1].plot(iteration_steps, random_draw_rates, label='Draw Rate')
    ax[1].plot(iteration_steps, random_loss_rates, label='Loss Rate')
    ax[1].set_xlabel('Evaluation Step')

    ax[1].legend()
    ax[1].set_ylabel('Rate')

    fig.suptitle(title)

    plt.show()



def export_results_to_json(results_dir):
    with open(results_dir, 'rb') as f:
        results_dict = pickle.load(f)
        
    baseline = results_dict['baseline_results']
    random = results_dict['random_results']
    
    baseline_win_rates = [x['win_rate'] for x in baseline]
    random_win_rates = [x['win_rate'] for x in random]
    baseline_draw_rates = [x['draw_rate'] for x in baseline]
    random_draw_rates = [x['draw_rate'] for x in random]
    baseline_loss_rates = [x['loss_rate'] for x in baseline]
    random_loss_rates = [x['loss_rate'] for x in random]
    
    iters = np.array([x for x in results_dict['iter_at_eval']])
    iteration_steps = [it[1].item() for it in iters]
    
    json_data = {
        'iteration_steps': iteration_steps,
        'baseline': {
            'win_rates': baseline_win_rates,
            'draw_rates': baseline_draw_rates,
            'loss_rates': baseline_loss_rates
        },
        'random': {
            'win_rates': random_win_rates,
            'draw_rates': random_draw_rates,
            'loss_rates': random_loss_rates
        }
    }

    with open(f"{results_dir}_jsonified.json", 'w') as f:
        json.dump(json_data, f, indent=2)
    
    


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

    #print("\n")
    #print("----3x3----")
    
    #3x3
    with open("Policies/VI/3_0.2_0.9_0.25/temp_policy_x.pkl", "rb") as f:
        x_policy = pickle.load(f)
    
    with open("Policies/VI/3_0.2_0.9_0.25/temp_policy_o.pkl", "rb") as f:
        o_policy = pickle.load(f)

    results_dir = "Policies/VI/3_0.2_0.9_0.25/tracked_results.pkl"
    with open("Policies/VI/3_0.2_0.9_0.25/tracked_results.pkl", "rb") as f:
        tracked_results = pickle.load(f)

    export_results_to_json(results_dir)

    print(f"Number of iterations = {RUNS}")
    results_baseline = eval_policy(n=3, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='baseline',epsilon=0.25)
    results_random = eval_policy(n=3, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='random',epsilon=0.25)
    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")



    with open("Policies/VI/4_0.2_0.9_0.25/temp_policy_x.pkl", "rb") as f:
        x_policy = pickle.load(f)
    
    with open("Policies/VI/4_0.2_0.9_0.25/temp_policy_o.pkl", "rb") as f:
        o_policy = pickle.load(f)

    #results_dir = "Policies/VI/3_0.2_0.9_0.25/tracked_results.pkl"
    #with open("Policies/VI/3_0.2_0.9_0.25/tracked_results.pkl", "rb") as f:
    #    tracked_results = pickle.load(f)

    #export_results_to_json(results_dir)

    print(f"Number of iterations = {RUNS}")
    results_baseline = eval_policy(n=4, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='baseline',epsilon=0.25)
    results_random = eval_policy(n=4, x_policy=x_policy, o_policy=o_policy, runs=RUNS, opponent='random',epsilon=0.25)
    print(f"Playing Against Baseline: {results_baseline}")
    print(f"Playing Against Random: {results_random}")


    #plot_results(tracked_results, title="Value Iteration on 3x3 Tic Tac Toe with 25% Skipping Probability") 
    

    """
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


    #Playing Against Baseline1: {'win_rate': 0.596, 'draw_rate': 0.1898, 'loss_rate': 0.2142}
    #Playing Against Baseline: {'win_rate': 0.4636, 'draw_rate': 0.2922, 'loss_rate': 0.2442}