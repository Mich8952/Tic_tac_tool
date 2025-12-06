import pickle
import numpy as np
from Utils.board_util import TicTacToeEnv

class ChPolicyWrapper:
    def __init__(self, policy_path, player = "X"):
        with open(policy_path, 'rb') as f:
            self.Q = pickle.load(f)

        self.player = player
        


    def __getitem__(self, state):
        env = TicTacToeEnv(n=int(len(state)**0.5))
        env.state = np.array(state).reshape((env.n, env.n))

        possible_actions = env.get_possible_actions()
        flat_state_org = env.get_flat_state()
        flat_state = []
        for element in flat_state_org:
            ref_el = element.item()
            if ref_el == "_":
                flat_state.append(' ')
            else:
                flat_state.append(ref_el)
        
        state_tuple = tuple(flat_state)
        action_values = []
        for action in possible_actions:
            action_values.append((self.Q.get((state_tuple, action.item()), 0), action.item()))
        
        action_values = np.array(action_values)

        if self.player == "X":
            act_idx = np.argmax(action_values[:,0])
        elif self.player == "O":
            act_idx = np.argmin(action_values[:,0])
        else:
            raise Exception("Bad Player")
        
        best_action = action_values[act_idx][1]

        return int(best_action.item())
        