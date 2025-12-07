import random
import copy

class TicTacToe:
    def __init__(self, n=3):
        self.n = n
        self.board = [' '] * (n * n)
        self.current_winner = None
    
    # function to help visualize game when playing against human
    def print_board(self):
        for row in [self.board[i*self.n:(i+1)*self.n] for i in range(self.n)]:
            print('| ' + ' | '.join(row) + ' |')

    # get all available squares in the board
    def available_moves(self):
        return [i for i, spot in enumerate(self.board) if spot == ' ']

    # find empty squares in the board
    def empty_squares(self):
        return ' ' in self.board

    # get number of empty squares in the board
    def num_empty_squares(self):
        return len(self.available_moves())

    # play a square
    def make_move(self, square, letter):
        if self.board[square] == ' ':
            self.board[square] = letter
            if self.winner(square, letter):
                self.current_winner = letter
            return True
        return False

    def winner(self, square, letter):
        n = self.n

        # ----- Check Row -----
        row_index = square // n
        row = self.board[row_index*n : (row_index+1)*n]
        if all(s == letter for s in row):
            return True

        # ----- Check Column -----
        col_index = square % n
        col = [self.board[col_index + i*n] for i in range(n)]
        if all(s == letter for s in col):
            return True

        # ----- Check Main Diagonal (only if square is on it) -----
        if square % (n + 1) == 0:       # index pattern: 0, n+1, 2n+2, ...
            diag1 = [self.board[i] for i in range(0, n*n, n+1)]
            if all(s == letter for s in diag1):
                return True

        # ----- Check Anti-Diagonal (only if square is on it) -----
        if square % (n - 1) == 0 and square != 0 and square != (n*n - 1):
            # index pattern: n-1, 2(n-1), 3(n-1), ...
            diag2 = [self.board[i] for i in range(n-1, n*n-(n-1), n-1)]
            if all(s == letter for s in diag2):
                return True

        return False
