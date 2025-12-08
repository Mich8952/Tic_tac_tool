from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from Evaluate.dqn_adapter import DQNPolicyWrapper
from Evaluate.ch_adapter import ChPolicyWrapper

app = Flask(__name__)
CORS(app, origins='*', supports_credentials=True)

# Get the base directory (root of Tic_tac_tool)
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))

POLICIES = {"VI_3": os.path.join(BASE_DIR, "Policies/VI/3_0.2_0.9_0.25"),
            "VI_4": os.path.join(BASE_DIR, "Policies/VI/4_0.2_0.9_0.25"),
            "PI_3": os.path.join(BASE_DIR, "Policies/PI/3_0.9_0.25"),
            "DQN_3": os.path.join(BASE_DIR, "Policies/DQN/3_1_0.25_winner"),
            "DQN_4": os.path.join(BASE_DIR, "Policies/DQN/4_1_0.25_winner"),
            "DQN_5": os.path.join(BASE_DIR, "Policies/DQN/5_1_0.25_winner_good"),
            "DQN_6": os.path.join(BASE_DIR, "Policies/DQN/6_1_0.25_winner"),
            "DQN_7": os.path.join(BASE_DIR, "Policies/DQN/7_1_0.25_winner"),
            "SARSA_4": os.path.join(BASE_DIR, "Policies/SARSA/q_values_sarsa.pkl"),
            "QL_4": os.path.join(BASE_DIR, "Policies/QL/DEC6_q_learning_4x4_eps=8000000.pkl"),
            "MC_4": os.path.join(BASE_DIR, "Policies/MC/mc_4x4.pkl")}

CURRENT_X_POLICY_CACHE = [None,None]
CURRENT_O_POLICY_CACHE = [None,None]

def get_n(board):
    return int(np.sqrt(len(board)))

def convert_board_to_state(board):
    flattened_board = []
    for row in board:
        for cell in row:
            if cell is None:
                flattened_board.append('_')
            elif cell == 'X':
                flattened_board.append("X") #backend expects 1 for X and 2 for O
            elif cell == 'O':
                flattened_board.append("O")

    return tuple(flattened_board)


@app.route('/api/get-ai-move', methods=['POST', 'OPTIONS'])
def get_ai_move():
    global CURRENT_O_POLICY_CACHE
    global CURRENT_X_POLICY_CACHE
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200  # Preflight response
    
    data = request.json
    state = convert_board_to_state(data['board'])
    n = get_n(state)

    algo = data['algorithm']

    if CURRENT_X_POLICY_CACHE[0] is None or CURRENT_X_POLICY_CACHE[1] != f"{algo}_{n}":
        if algo in ["VI","PI"]:
            with open(f'{POLICIES[f"{algo}_" + str(n)]}/temp_policy_o.pkl', 'rb') as f:
                O_policy = pickle.load(f)
            with open(f'{POLICIES[f"{algo}_" + str(n)]}/temp_policy_x.pkl', 'rb') as f:
                X_policy = pickle.load(f)
        elif algo in ["SARSA", "QL", "MC"]:
            policy_path = POLICIES[f'{algo}_' + str(n)]
            is_sarsa = (algo == "SARSA")
            O_policy = ChPolicyWrapper(policy_path, player='O', isSARSA=is_sarsa)
            X_policy = ChPolicyWrapper(policy_path, player='X', isSARSA=is_sarsa)
        else:
            model_path = os.path.join(POLICIES[f'{algo}_' + str(n)], "q_network.pt")
            O_policy = DQNPolicyWrapper(n, model_path, player='O')
            X_policy = DQNPolicyWrapper(n, model_path, player='X')

        print(f"USING the policies for {algo} with n={n}")
        CURRENT_O_POLICY_CACHE[0] = O_policy
        CURRENT_X_POLICY_CACHE[0] = X_policy

        CURRENT_O_POLICY_CACHE[1] = f"{algo}_{n}"
        CURRENT_X_POLICY_CACHE[1] = f"{algo}_{n}"
    else:
        O_policy = CURRENT_O_POLICY_CACHE[0]
        X_policy = CURRENT_X_POLICY_CACHE[0]
    

    # this api needs to determine whos turn it is. So lets simply count states
    # if we have equal X and Os, its Xs turn else itss O
    num_X = state.count("X")
    num_O = state.count("O")
    current_player = "X" if num_X == num_O else "O"

    if current_player == "X":
        policy = X_policy
    else:
        policy = O_policy


    # Check if game is already over (board is full or terminal state)
    if '_' not in state:
        return jsonify({'error': 'Game is already over (board is full)'}), 400

    # need this form (np.str_('X'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'))
    state = tuple(np.str_(s) for s in state)

    try:
        action = policy[state]
    except KeyError:
        return jsonify({'error': 'State not found in policy (likely a terminal state)'}), 400

    # convert flat index into row,col
    row, col = divmod(action, n) # n=3 in this case

    print(row,col)
    return jsonify({'row': row, 'col': col})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)