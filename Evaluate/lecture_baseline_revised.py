from Utils.board_util import TicTacToeEnv
import numpy as np

class LectureBaselinePolicyWrapper:
    def __init__(self, n):
        self.n = n
        self.letter = "O"
    
    def __getitem__(self, state_tuple):
        env = TicTacToeEnv(n=self.n)
        env.state = np.array(state_tuple).reshape((self.n, self.n))
        return choose_move(env, self.letter)


def choose_move(game: TicTacToeEnv, letter: str):
    board = list(game.get_flat_state())
    n = game.n
    player = letter
    opponent = 'O' if player == 'X' else 'X'

    def empty():
        return [i for i, cell in enumerate(board) if cell == '_']

    def lines():
        all_lines = []
        for i in range(n):
            all_lines.append([i*n+j for j in range(n)])
        for j in range(n):
            all_lines.append([i*n+j for i in range(n)])
        all_lines.append([i*n+i for i in range(n)])
        all_lines.append([i*n+(n-1-i) for i in range(n)])
        return all_lines

    def can_win(marker):
        winning_moves = []
        for line in lines():
            vals = [board[i] for i in line]
            if vals.count(marker) == n-1 and vals.count('_') == 1:
                winning_moves.append(line[vals.index('_')])
        return winning_moves

    empty_cells = empty()
    our_wins = can_win(player)
    opp_wins = can_win(opponent)

    # 1. if no chance of losing, then we play the next cell 
    if not opp_wins: # checks if its empty
        first_empty = empty_cells[0]
        current_row = first_empty // n
        next_in_row = first_empty + 1
        
        if next_in_row < (current_row + 1) * n and next_in_row in empty_cells: # checks if its in the same row
            return next_in_row
        
        cell_below = first_empty + n # if its not in the same row then try the cell below
        if cell_below < n*n and cell_below in empty_cells:
            return cell_below
        
        return np.random.choice(empty_cells).item() # otherwise just play random
    
    # 2. block opponent
    if opp_wins:
        return np.random.choice(opp_wins).item()
    
    # 3. win if we can
    if our_wins:
        return our_wins[0]
    ####REND
