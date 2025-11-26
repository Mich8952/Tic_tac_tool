from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle

app = Flask(__name__)
CORS(app, supports_credentials=True)


with open('Policies/VI/3_0.2_0.9_0.25/temp_policy_o.pkl', 'rb') as f:
    policy = pickle.load(f)


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
    # need this form (np.str_('X'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'), np.str_('_'))
    state = tuple(np.str_(s) for s in state)
    action = policy[state]
    # convert flat index into row,col
    row, col = divmod(action, 3) # n=3 in this case
    
    print(row,col)
    return jsonify({'row': row, 'col': col})

'''
@app.route('/api/get-ai-move', methods=['POST'])
def get_ai_move():
    data = request.json
    board = data['board']  # get the board state from frontend
    player = data['player']  # get whos turn it is from the frontend
    
    state = convert_board_to_state(board)
    action = policy[state]
    row, col = action
    
    return jsonify({'row': row, 'col': col})
'''
if __name__ == '__main__':
    app.run(port=5001, debug=True)