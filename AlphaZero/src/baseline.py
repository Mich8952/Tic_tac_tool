from TicTacToe.board_util import TicTacToeEnv
import numpy as np

class BaselinePolicyWrapper:
    def __init__(self, n):
        self.n = n
        self.letter = "O"
    def __getitem__(self, state_tuple): #as if its a dict
        env = TicTacToeEnv(n=self.n)
        env.state = np.array(state_tuple).reshape((self.n, self.n))
        return choose_move(env, self.letter)

class RandomPolicyWrapper:
    def __init__(self, n):
        self.n = n
    def __getitem__(self, state_tuple): # this is as if its a dict
        env = TicTacToeEnv(n=self.n)
        env.state = np.array(state_tuple).reshape((self.n, self.n))
        possible_actions = env.get_possible_actions()
        return np.random.choice(possible_actions).item()


# THE FOLLOWING IS ADAPTED FROM CHARLOTTES CODE
# THE FOLLOWING IS ADAPTED FROM CHARLOTTES CODE
# THE FOLLOWING IS ADAPTED FROM CHARLOTTES CODE
def choose_move(game: TicTacToeEnv, letter: str):
    board = list(game.get_flat_state())
    n = game.n
    player = letter
    opponent = 'O' if player == 'X' else 'X'

    def empty():
        return [i for i, cell in enumerate(board) if cell == '_']  # should really just use the env.get_possible_actions()

    def lines():
        all_lines = []
        for i in range(n):
            all_lines.append([i*n+j for j in range(n)]) 
            # for each i row and down j column
        
        for j in range(n):
            all_lines.append([i*n+j for i in range(n)])
            # for each j column and go across rows
        
        # now the diagonals and off diagonals
        all_lines.append([i*n+i for i in range(n)]) 
        #basically saying like look at row i, then column i+n+i
        # so for n=3 this is indicies 0,4,8 the main diagonal
        all_lines.append([i*n+(n-1-i) for i in range(n)])
        # and this is the inverse diagonal so [2,4,6]
        
        return all_lines

    def can_win(p):
        for line in lines():
            vals = [board[i] for i in line]
            if vals.count(p) == n-1 and vals.count('_') == 1:
                return line[vals.index('_')]
        return None

    def creates_fork(p, idx):
        board[idx] = p
        wins = 0
        for line in lines():
            vals = [board[i] for i in line]
            if vals.count(p) == n-1 and vals.count('_') == 1:
                wins += 1
        board[idx] = '_'
        return wins >= 2

    center = (n*n)//2 if n%2 == 1 else None # there is no center in even boards
    corners = [0,n-1,n*(n-1),n*n-1]
    edges = []
    for i in range(1,n-1):
        edges.extend([i,n*i,n*(i+1)-1,n*(n-1)+i])
        # on a 3x3 this is like 1,3,5,7

    move = can_win(player)
    if move is not None:
        return move

    move = can_win(opponent)
    if move is not None:
        return move

    for m in empty():
        if creates_fork(player, m):
            return m

    opp_forks = [m for m in empty() if creates_fork(opponent, m)]
    if len(opp_forks) == 1:
        return opp_forks[0]

    if len(opp_forks) > 1:
        for m in empty():
            board[m] = player
            if can_win(player) is not None:
                board[m] = '_'
                return m
            board[m] = '_'

    if center is not None and center in empty():
        return center

    opposite_corners = [(corners[0], corners[3]), (corners[3], corners[0]),
                        (corners[1], corners[2]), (corners[2], corners[1])]
    # in 3x3 this is like (0,8),(8,0),(2,6),(6,2) permutations
    for a, b in opposite_corners:
        if board[a] == opponent and b in empty():
            return b

    for c in corners:
        if c in empty():
            return c

    for e in edges:
        if e in empty():
            return e

    return empty()[0]