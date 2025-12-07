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
        return [i for i, cell in enumerate(board) if cell == '_'] # should really just use the env.get_possible_actions()

    def lines():
        all_lines = []
        for i in range(n):
            all_lines.append([i*n+j for j in range(n)])
        for j in range(n):
            all_lines.append([i*n+j for i in range(n)])
        # diag
        all_lines.append([i*n+i for i in range(n)])
        # off-diag
        all_lines.append([i*n+(n-1-i) for i in range(n)])
        return all_lines

    def can_win(marker):
        winning_moves = []
        for line in lines():
            vals = [board[i] for i in line]
            if vals.count(marker) == n-1 and vals.count('_') == 1:
                winning_moves.append(line[vals.index('_')])
        return winning_moves # return the list of indicies for winning moves

    # if our wins is not empty then play any of those moves to win (here just pick the first)
    our_wins = can_win(player)
    if our_wins:
        return our_wins[0]

    # if the opponent can win then we just block the move. From the lecture we should just pick it randomly
    opp_wins = can_win(opponent)
    if opp_wins:
        return np.random.choice(opp_wins).item()
    
    # if we cant win and they cant win just play the next cell as per the lecture
    empty_cells = empty()
    #if not empty_cells:
        #return 0 # this wont happen
    
    first_empty = empty_cells[0] # min(empty_cells) # here im just going to pick the first empty cell, could have just done empty_cells[0]
    
    # play sequentially in the row first
    current_row = first_empty//n # recall that these are flattened indices
    next_in_row = first_empty + 1 # next cell in the same row
    
    # if its truly on the same row and empty then play it, otherwise it might wrap around and not make snese
    if next_in_row < (current_row + 1) * n and next_in_row in empty_cells:
        return next_in_row
    
    # now, if thats the case, then try the cell below
    cell_below = first_empty + n
    if cell_below < n*n and cell_below in empty_cells: # so if its actually valid (which it should be) and its empty then play it
        return cell_below
    
    # else play randomly
    return np.random.choice(empty_cells).item()
