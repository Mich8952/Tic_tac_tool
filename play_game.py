from board_util import TicTacToeEnv
import time
import pickle
import ast
import random
import os

def play_game(policy_dir, n):
    # policy is the opposing policy
    env = TicTacToeEnv(n=n)
    env.reset()

    rdn = random.randint(0,1)
    if rdn == 0:
        # agent plays first
        agent_is_x = True
        with open(os.path.join(policy_dir,"temp_policy_x.pkl"), "rb") as f:
            policy = pickle.load(f)
    else:
        # agent plays second, we play first
        agent_is_x = False
        with open(os.path.join(policy_dir,"temp_policy_o.pkl"), "rb") as f:
            policy = pickle.load(f)
        print(env.state)

    while not env.terminated:
        env.set_player_auto()  
        
        is_agent_turn = (env.current_player == 1 and agent_is_x) or (env.current_player == 2 and not agent_is_x)
        
        if is_agent_turn:
            state = tuple(env.get_flat_state())
            action = policy[state]
            env.step(action)
        else:
            # our turn
            intended_move = ast.literal_eval(input("Enter your move (coords): ")) #ex 1,1
            env.step(env.convert_coords_to_index(intended_move))
        
        print(env.state)
        print("\n")
        time.sleep(1) # so it seems like its thinking lol
        
        result = env.check_game_status()
        if result == 1:
            print("X wins!" + (" (You lose!)" if agent_is_x else " (You win!)"))
            break
        elif result == -1:
            print("O wins!" + (" (You lose!)" if not agent_is_x else " (You win!)"))
            break
        elif result == 0:
            print("Draw!")
            break


if __name__ == "__main__":
    #play_game(policy_dir="temp_policy_vi",n=4) #value iteration policy
    play_game(policy_dir="temp_policy_pi",n=3) #policy iter