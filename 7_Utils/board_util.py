import numpy as np 
from copy import deepcopy

class TicTacToeEnv:
    def __init__(self, n=3):
        self.n = n
        self.reset()

    def reset(self):
        # self.state = np.zeros((self.n, self.n), dtype=int)
        self.state = np.full((self.n, self.n), fill_value='_')
        self.terminated = False
        self.current_player = np.nan # start with invalid so to force the user to set it 
        return self.get_state()
    
    def set_player_1(self):
        self.current_player = 1

    def set_player_2(self):
        self.current_player = 2

    def convert_coords_to_index(self, coord : tuple[int,int]):
        row, col = coord
        return row * self.n + col

    def step(self, action): # acrtion must be the flattened index
        if not self.terminated:
            row, col = divmod(action, self.n) # sweet way of getting the row and col using division and remainder by board size
            if self.state[row, col] != '_':
                raise IndexError(f"Move invalid, occupied by player {'1' if self.state[row,col] == 1 else '2'}")
            else:
                if self.current_player == 1:
                  self.state[row, col] = 'X'
                else:
                    self.state[row, col] = 'O'
                reward = self.check_game_status()
                #return self.get_state()
        else:   
            raise Exception("Game is over")
    def get_state(self):
        return deepcopy(self.state)

    def get_flat_state(self):
        return deepcopy(self.state.flatten())
    
    def return_play_counts(self):
        return {"X":np.sum(self.state == 'X'), "O" : np.sum(self.state == 'O')}
    
    def set_player_auto(self):
        counts = self.return_play_counts()

        x_count = counts['X']
        o_count = counts['O']
        
        if x_count == o_count:
            self.set_player_1()
        else:
            self.set_player_2()
    
    def toggle_player(self):
        if self.current_player == 1:
            self.current_player = 2
        else:
            self.current_player = 1

    def get_possible_actions(self):
        return np.argwhere(self.get_flat_state() == "_")[:,0]
        
    
        #np.argwhere(np.array(sample_state) == "_")[0]

    def check_game_status(self):
        # Check rows and columns for a win
        for i in range(self.n):
            if np.all(self.state[i, :] == 'X') or np.all(self.state[:, i] == 'X'):
                self.terminated = True
                return 1  # X wins
            if np.all(self.state[i, :] == 'O') or np.all(self.state[:, i] == 'O'):
                self.terminated = True
                return -1  # O wins

        # Check diagonals for a win
        if np.all(np.diag(self.state) == 'X') or np.all(np.diag(np.fliplr(self.state)) == 'X'):
            self.terminated = True
            return 1  # X wins
        if np.all(np.diag(self.state) == 'O') or np.all(np.diag(np.fliplr(self.state)) == 'O'):
            self.terminated = True
            return -1  # O wins

        # Check for draw
        if np.all(self.state != '_'):
            self.terminated = True
            return 0  # Draw

        return None

    def visualize_grid():
        #https://www.geeksforgeeks.org/python/tic-tac-toe-gui-in-python-using-pygame/
        ...
