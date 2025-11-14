from board_util import TicTacToeEnv
import time
import pickle
import ast

def play_game(policy):
    # policy is the opposing policy
    env = TicTacToeEnv()
    env.reset()
    env.set_player_1() # our policy is always player 1
    while not env.terminated:
        if env.current_player == 1:
            state = tuple(env.get_flat_state())
            action = policy[state]
            env.step(action)
        else:
            # opponent is me, where I play by inputting moves
            intended_move = ast.literal_eval(input("Enter your move (coords): ")) #ex 1,1
            env.step(env.convert_coords_to_index(intended_move))
        env.set_player_auto()
        print(env.state)
        print("\n")
        time.sleep(1) # so it seems like its thinking lol
        result = env.check_game_status()
        if result == 1:
            print("You lose!")
        elif result == -1:
            print("You win!")
        elif result == 0:
            print("Draw!")
        # otherwise keep playing


if __name__ == "__main__":
    with open("temp_policy.pkl", "rb") as f:
        policy = pickle.load(f)
    play_game(policy)