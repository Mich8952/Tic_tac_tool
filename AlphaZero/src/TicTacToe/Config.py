import numpy as np


class Config:
    """Configuration object for a game with a given board size."""

    def __init__(self, board_size):
        """Initialize config for a square board.

        Args:
            board_size: Size of the board (e.g., 3 for 3x3, 4 for 4x4)
        """
        self.name = "TicTacToe"
        self.board_size = board_size
        self.board_dims = (1, board_size, board_size, 2)
        self.policy_output_dim = board_size * board_size

    def NN_output_to_moves(self, array):
        return [num[0] for num, x in np.ndenumerate(array) if x > 0]

    def number_to_move(self, number):
        return int(number)

    def move_to_number(self, action):
        return int(action)
