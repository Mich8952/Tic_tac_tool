from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app, supports_credentials=True)


POLICIES = {"3": "Policies/VI/3_0.2_0.9_0.25",
            "4": "Policies/VI/4_0.2_0.9_0.0"}

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
    if request.method == 'OPTIONS':
        return jsonify({'status': 'OK'}), 200  # Preflight response
    
    data = request.json
    state = convert_board_to_state(data['board'])

    n = get_n(state)

    with open(f'{POLICIES[str(n)]}/temp_policy_o.pkl', 'rb') as f:
        O_policy = pickle.load(f)
    with open(f'{POLICIES[str(n)]}/temp_policy_x.pkl', 'rb') as f:
        X_policy = pickle.load(f)
    

    # this api needs to determine whos turn it is. So lets simply count states
    # if we have equal X and Os, its Xs turn else itss O
    num_X = state.count("X")
    num_O = state.count("O")
    current_player = "X" if num_X == num_O else "O"

    if current_player == "X":
        policy = X_policy
    else:
        policy = O_policy


    # need this form (np.str_('X'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'))
    state = tuple(np.str_(s) for s in state)
    action = policy[state]
    # convert flat index into row,col
    row, col = divmod(action, n) # n=3 in this case
    
    print(row,col)
    return jsonify({'row': row, 'col': col})

if __name__ == '__main__':
    app.run(port=5001, debug=True)