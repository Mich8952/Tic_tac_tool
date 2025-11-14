from board_util import TicTacToeEnv
import time
import pickle
import ast
import random
import os

def play_game(policy_dir):
    # policy is the opposing policy
    env = TicTacToeEnv()
    env.reset()

    rdn = random.randint(0,1)
    if rdn == 0:
        env.set_player_1() # agent goes first
        agent_player = 1
        with open(os.path.join(policy_dir,"temp_policy_x.pkl"), "rb") as f:
            policy = pickle.load(f)
    
    else:
        env.set_player_2() # we go first, agent goes second
        agent_player = 1
        print(env.state)
        with open(os.path.join(policy_dir,"temp_policy_o.pkl"), "rb") as f:
            policy = pickle.load(f)

    while not env.terminated:
        if env.current_player == agent_player:
            state = tuple(env.get_flat_state())
            action = policy[state]
            env.step(action)
            env.set_player_2()
        else:
            # opponent is me, where I play by inputting moves
            intended_move = ast.literal_eval(input("Enter your move (coords): ")) #ex 1,1
            env.step(env.convert_coords_to_index(intended_move))
            env.set_player_1()
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
    play_game(policy_dir="temp_policy")