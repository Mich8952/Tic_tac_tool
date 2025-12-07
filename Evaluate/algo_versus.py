# this code is for evaluating a given policy versus a random baseline

# input as a policy and output as the win rate over n simulations versus specified opponent

import sys
import os
import seaborn as sns
import pickle
import json
import pandas as pd
import matplotlib.pyplot as plt
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
from Evaluate.dqn_adapter import DQNPolicyWrapper
from Evaluate.ch_adapter import ChPolicyWrapper



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

def eval_policy(n, x_policy_1, o_policy_1, x_policy_2, o_policy_2, runs = 10, epsilon=0.0):
    assert runs % 2 == 0 # this should be even for evals
    
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
            action = play_policy(env, epsilon, x_policy_1)
            env.step(action)

            result = env.check_game_status() 
            terminated = result is not None

            if terminated:
                break

            env.set_player_2()
            action = play_policy(env, epsilon, o_policy_2)
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


    for run in range(halfway):  
        terminated = False
        env = TicTacToeEnv(n=n)
        env.reset()

        while not terminated:
            env.set_player_1() # player 1 will be the policy
            action = play_policy(env, epsilon, x_policy_2)
            env.step(action)

            result = env.check_game_status() 
            terminated = result is not None

            if terminated:
                break

            env.set_player_2()
            action = play_policy(env, epsilon, o_policy_1)
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
        
    return {"win_rate" : 100*wins/runs, "draw_rate": 100*draws/runs, "loss_rate": 100*losses/runs}
    
    


if __name__ == "__main__":
    RUNS = 5000
    epsilon = 0.25

    # this really should follow better programming practices and modular programming, but for now its fine.
    
    VI_DIR = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/VI/4_0.2_0.9_0.25"
    DQN_DIR = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/DQN/4_1_0.25_winner"
    MC_DIR = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/MC/mc_4x4.pkl"
    QL_DIR = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/QL/q_values_ql.pkl"
    SARSA_DIR = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/SARSA/q_values_sarsa.pkl"
    
    df_comparison = pd.DataFrame()
    compare_from = []
    compare_to = []
    win_rate = []
    draw_rate = []
    loss_rate = []
    
    ### COMPARING VI_N=4 TO DQN_N=4 START
    with open(f"{VI_DIR}/temp_policy_x.pkl","rb") as f:
        x_policy_1 = pickle.load(f)
    with open(f"{VI_DIR}/temp_policy_o.pkl","rb") as f:
        o_policy_1 = pickle.load(f)

    x_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("VI")
    compare_to.append("DQN")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING VI_N=4 TO DQN_N=4 END


    ### COMPARING VI_N=4 TO MC_N=4 START
    with open(f"{VI_DIR}/temp_policy_x.pkl","rb") as f:
        x_policy_1 = pickle.load(f)
    with open(f"{VI_DIR}/temp_policy_o.pkl","rb") as f:
        o_policy_1 = pickle.load(f)

    x_policy_2 = ChPolicyWrapper(MC_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(MC_DIR, player='O')
    
    
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("VI")
    compare_to.append("MC")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING VI_N=4 TO MC_N=4 END

    

    ### COMPARING DQN_N=4 TO MC_N=4 START
    x_policy_1 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_1 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')

    x_policy_2 = ChPolicyWrapper(MC_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(MC_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("DQN")
    compare_to.append("MC")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING DQN_N=4 TO MC_N=4 END


    ### COMPARING VI_N=4 TO SARSA_N=4 START
    with open(f"{VI_DIR}/temp_policy_x.pkl","rb") as f:
        x_policy_1 = pickle.load(f)
    with open(f"{VI_DIR}/temp_policy_o.pkl","rb") as f:
        o_policy_1 = pickle.load(f)

    x_policy_2 = ChPolicyWrapper(SARSA_DIR, player='X',isSARSA=True)
    o_policy_2 = ChPolicyWrapper(SARSA_DIR, player='O',isSARSA=True)
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("VI")
    compare_to.append("SARSA")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING VI_N=4 TO SARSA_N=4 END



    ### COMPARING DQN_N=4 TO SARSA_N=4 START
    x_policy_1 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_1 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')

    x_policy_2 = ChPolicyWrapper(SARSA_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(SARSA_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("DQN")
    compare_to.append("SARSA")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING DQN_N=4 TO SARSA_N=4 END


    ### COMPARING MC_N=4 TO SARSA_N=4 START
    x_policy_1 = ChPolicyWrapper(MC_DIR, player='X')
    o_policy_1 = ChPolicyWrapper(MC_DIR, player='O')

    x_policy_2 = ChPolicyWrapper(SARSA_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(SARSA_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("MC")
    compare_to.append("SARSA")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING MC_N=4 TO SARSA_N=4 END


    ### COMPARING VI_N=4 TO QL_N=4 START
    with open(f"{VI_DIR}/temp_policy_x.pkl","rb") as f:
        x_policy_1 = pickle.load(f)
    with open(f"{VI_DIR}/temp_policy_o.pkl","rb") as f:
        o_policy_1 = pickle.load(f)

    x_policy_2 = ChPolicyWrapper(QL_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(QL_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("VI")
    compare_to.append("QL")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING VI_N=4 TO QL_N=4 END


    ### COMPARING DQN_N=4 TO QL_N=4 START
    x_policy_1 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_1 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')

    x_policy_2 = ChPolicyWrapper(QL_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(QL_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("DQN")
    compare_to.append("QL")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING DQN_N=4 TO QL_N=4 END


    ### COMPARING MC_N=4 TO QL_N=4 START
    x_policy_1 = ChPolicyWrapper(MC_DIR, player='X')
    o_policy_1 = ChPolicyWrapper(MC_DIR, player='O')

    x_policy_2 = ChPolicyWrapper(QL_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(QL_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("MC")
    compare_to.append("QL")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING MC_N=4 TO QL_N=4 END


    ### COMPARING SARSA_N=4 TO QL_N=4 START
    x_policy_1 = ChPolicyWrapper(SARSA_DIR, player='X')
    o_policy_1 = ChPolicyWrapper(SARSA_DIR, player='O')

    x_policy_2 = ChPolicyWrapper(QL_DIR, player='X')
    o_policy_2 = ChPolicyWrapper(QL_DIR, player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("SARSA")
    compare_to.append("QL")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING SARSA_N=4 TO QL_N=4 END


    ### COMPARING MC_N=4 TO DQN_N=4 START
    x_policy_1 = ChPolicyWrapper(MC_DIR, player='X')
    o_policy_1 = ChPolicyWrapper(MC_DIR, player='O')

    x_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("MC")
    compare_to.append("DQN")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING MC_N=4 TO DQN_N=4 END


    ### COMPARING SARSA_N=4 TO DQN_N=4 START
    x_policy_1 = ChPolicyWrapper(SARSA_DIR, player='X')
    o_policy_1 = ChPolicyWrapper(SARSA_DIR, player='O')

    x_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("SARSA")
    compare_to.append("DQN")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING SARSA_N=4 TO DQN_N=4 END


    ### COMPARING QL_N=4 TO DQN_N=4 START
    x_policy_1 = ChPolicyWrapper(QL_DIR, player='X')
    o_policy_1 = ChPolicyWrapper(QL_DIR, player='O')

    x_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='X')
    o_policy_2 = DQNPolicyWrapper(4, f"{DQN_DIR}/q_network.pt", player='O')
        
    res = eval_policy(n=4,x_policy_1=x_policy_1,o_policy_1=o_policy_1,x_policy_2=x_policy_2,o_policy_2=o_policy_2, runs=RUNS,epsilon=epsilon)

    compare_from.append("QL")
    compare_to.append("DQN")
    win_rate.append(res["win_rate"])
    draw_rate.append(res["draw_rate"])
    loss_rate.append(res["loss_rate"])
    ### COMPARING QL_N=4 TO DQN_N=4 END


    df_comparison['compare_from'] = compare_from
    df_comparison['compare_to'] = compare_to
    df_comparison['win_rate'] = win_rate
    df_comparison['draw_rate'] = draw_rate
    df_comparison['loss_rate'] = loss_rate

    print(df_comparison)
    
    algorithms = ['VI', 'MC', 'SARSA', 'QL', 'DQN']
    matrix_win = pd.DataFrame(index=algorithms, columns=algorithms)
    
    for i, row in df_comparison.iterrows():
        from_algo = row['compare_from']
        to_algo = row['compare_to']

        matrix_win.loc[to_algo, from_algo] = row['win_rate']
        matrix_win.loc[from_algo, to_algo] = row['loss_rate']

    
    for algo in algorithms:
        matrix_win.loc[algo, algo] = np.nan
    
    print("Win Rate:")
    print("Compare From (top header)")
    print(matrix_win)