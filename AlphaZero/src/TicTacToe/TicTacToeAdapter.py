import numpy as np
from copy import deepcopy
from .board_util import TicTacToeEnv


class TicTacToeAdapter:

    def __init__(self, board_size=3):
        self.board_size = board_size
        self.env = TicTacToeEnv(n=board_size)
        self.env.reset()
        self.env.set_player_1()
        self.history = []
        self.state_stack = []
        self.name = "TicTacToe"
        self.board_dims = (1, board_size, board_size, 2)

    def reset(self):
        self.env.reset()
        self.env.set_player_1()
        self.history = []
        self.state_stack = []

    def _board_to_binary(self, string_board):
        binary_board = np.zeros((self.board_size, self.board_size, 2), dtype=int)
        for i in range(self.board_size):
            for j in range(self.board_size):
                if string_board[i, j] == 'X':
                    binary_board[i, j, 0] = 1
                elif string_board[i, j] == 'O':
                    binary_board[i, j, 1] = 1
        return binary_board

    def get_moves(self):
        return self.env.get_possible_actions()

    def get_moves_from_board_state(self, board_state):
        legal_moves = []
        num_positions = self.board_size * self.board_size
        for i in range(num_positions):
            row, col = divmod(i, self.board_size)
            if board_state[row, col, 0] == 0 and board_state[row, col, 1] == 0:
                legal_moves.append(i)
        return legal_moves

    def get_legal_NN_output(self):
        moves = self.get_moves()
        num_positions = self.board_size * self.board_size
        legal_mask = [0] * num_positions
        for move in moves:
            legal_mask[move] = 1
        return legal_mask

    def execute_move(self, move):
        self.state_stack.append({
            'board': deepcopy(self.env.state),
            'terminated': self.env.terminated
        })
        if len(self.history) % 2 == 0:
            self.env.set_player_1()
        else:
            self.env.set_player_2()
        try:
            self.env.step(move)
            self.history.append(move)
        except IndexError as e:
            print(f'illegal move: {e}')

        return self

    def undo_move(self):
        if len(self.state_stack) > 0:
            saved_state = self.state_stack.pop()
            self.env.state = saved_state['board']
            self.env.terminated = saved_state['terminated']
            if len(self.history) > 0:
                self.history.pop()
        else:
            print('could not undo move')

    def _won(self):
        player_who_just_moved = 0 if len(self.history) % 2 == 1 else 1
        marker = 'X' if player_who_just_moved == 0 else 'O'
        board = self.env.state

        for i in range(3):
            if np.all(board[i, :] == marker) or np.all(board[:, i] == marker):
                return True

        if np.all(np.diag(board) == marker) or np.all(np.diag(np.fliplr(board)) == marker):
            return True

        return False

    def is_final(self):
        return self.env.terminated

    def get_score(self):
        if self.is_final():
            if self._won():
                return 2
            else:
                return 1
        else:
            print('not final')

    def get_outcome(self):
        if not self.is_final():
            print("not finished")
            return None

        if self._won():
            if len(self.history) % 2 == 1:
                return [1, -1]
            else:
                return [-1, 1]
        else:
            return [0, 0]

    def get_state(self):
        return str(self.history)

    def get_turn(self):
        return len(self.history) % 2 if not self.is_final() else None

    def get_board(self):
        binary_board = self._board_to_binary(self.env.state)

        if len(self.history) % 2 == 0:
            return np.copy(binary_board)
        else:
            return np.copy(np.flip(binary_board, -1))

    def create_game(self, board_state):
        self.env.state = board_state
        return self

    def player_turn(self):
        p1 = np.sum(self.env.state == 'X')
        p2 = np.sum(self.env.state == 'O')
        if p1 == p2:
            return 0
        else:
            return 1

    def print_board(self):
        for x in range(self.board_size):
            string = '|'
            for y in range(self.board_size):
                if self.env.state[x, y] == 'X':
                    string += 'X'
                elif self.env.state[x, y] == 'O':
                    string += 'O'
                else:
                    string += ' '
                string += '|'
            print(string)