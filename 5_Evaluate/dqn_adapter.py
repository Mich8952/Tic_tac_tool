import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
import torch
import torch.nn as nn
device = torch.device("cpu")

class DQN(nn.Module):
    def __init__(self, n):
        super(DQN, self).__init__()
        self.n = n
        input_size = n * n + 1
        hidden_size = 128
        
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, n * n)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def state_to_tensor(state, current_player, n):
    state_array = np.array(state)
    numeric_state = np.zeros(n * n + 1)
    for i, s in enumerate(state_array):
        if s == 'X':
            numeric_state[i] = 1.0
        elif s == 'O':
            numeric_state[i] = -1.0
        else:
            numeric_state[i] = 0.0
    numeric_state[-1] = 1.0 if current_player == 1 else -1.0
    return torch.FloatTensor(numeric_state).to(device)

class DQNPolicyWrapper:
    def __init__(self, n, model_path, player='X'):
        self.n = n
        self.player = player
        self.current_player = 1 if player == 'X' else 2
        self.model = DQN(n).to(device)
        if model_path is not None:
            self.model.load_state_dict(torch.load(model_path, map_location=device))
            print("model loaded")
        self.model.eval()
        
    def __getitem__(self, state_tuple):
        env = TicTacToeEnv(n=self.n)
        env.state = np.array(state_tuple).reshape((self.n, self.n))
        possible_actions = env.get_possible_actions()
        
        if len(possible_actions) == 0:
            return 0
        
        state_tensor = state_to_tensor(state_tuple, self.current_player, self.n).unsqueeze(0)
        
        with torch.no_grad():
            q_values = self.model(state_tensor).squeeze(0)
            
            possible_q_values = []
            for a in possible_actions:
                possible_q_values.append((q_values[a].item(), a.item()))
            
            action = max(possible_q_values, key=lambda x: x[0])[1]
        
        return action
