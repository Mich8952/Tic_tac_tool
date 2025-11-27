import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Utils.board_util import TicTacToeEnv
import numpy as np
from tqdm import tqdm
from copy import deepcopy
import pickle
import torch
import torch.nn as nn
import torch.optim as optim
import random
from collections import deque

SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)

from Evaluate.eval import eval_policy
#from Evaluate.lecture_baseline_revised import LectureBaselinePolicyWrapper as BaselinePolicyWrapper
from Evaluate.lecture_baseline import LectureBaselinePolicyWrapper as BaselinePolicyWrapper
# lecturebaseline 2 with < 1 play worked well
#from Evaluate.baseline import BaselinePolicyWrapper

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
    return torch.FloatTensor(numeric_state)

def dqn_learning(n=3, gamma=0.9, epsilon_start=1.0, epsilon_end=0.25, lr=0.001, memory_size=10000, batch_size=64, 
                 H=1000, L=10, iterations=1000, target_update=100, track_progress=False):
    
    q_network = DQN(n)
    target_network = DQN(n)
    target_network.load_state_dict(q_network.state_dict())
    
    optimizer = optim.Adam(q_network.parameters(), lr=lr)
    
    replay_buffer = deque(maxlen=memory_size)
    
    baseline_policy = BaselinePolicyWrapper(n)
    
    baseline_results = []
    random_results = []
    iter_at_eval = []
    
    cutoff = iterations // 4


    best_win_differential = -100000
    best_state_dict = None
    
    print("Running DQN learning...")
    for iteration in tqdm(range(iterations)):
        epsilon = epsilon_start - (epsilon_start - epsilon_end) * (iteration / iterations)
        use_baseline = np.random.random() < 0#1.0
        
        env = TicTacToeEnv(n)
        env.reset()
        state = tuple(env.get_flat_state())
        
        for h in range(H):
            env.set_player_auto()
            possible_actions = env.get_possible_actions()
            
            if len(possible_actions) == 0:
                env.reset()
                state = tuple(env.get_flat_state())
                continue
            
            current_player = env.current_player
            
            if use_baseline and current_player == 2:
                if np.random.random() < 0.25:
                    action = np.random.choice(possible_actions).item()
                else:
                    action = baseline_policy[state]
            elif np.random.random() < epsilon:
                action = np.random.choice(possible_actions).item()
            else:
                state_tensor = state_to_tensor(state, current_player, n).unsqueeze(0)
                with torch.no_grad():
                    q_values = q_network(state_tensor).squeeze(0)
                    
                    possible_q_values = []
                    for a in possible_actions:
                        possible_q_values.append((q_values[a].item(), a.item()))
                    
                    action = max(possible_q_values, key=lambda x: x[0])[1]
            
            next_env = TicTacToeEnv(n)
            next_env.state = env.state.copy()
            next_env.current_player = env.current_player
            next_env.step(action)
            next_state = tuple(next_env.get_flat_state())
            
            reward = next_env.check_game_status()
            if reward is None:
                reward = 0.0
            else:
                if current_player == 2:
                    reward = -reward
            
            if not (use_baseline and current_player == 2):
                replay_buffer.append((state, action, reward, next_state, current_player))
            
            state = next_state
            env.state = next_env.state.copy()
            env.current_player = next_env.current_player
            
            if next_env.check_game_status() is not None:
                env.reset()
                state = tuple(env.get_flat_state())
        
        if len(replay_buffer) >= batch_size:
            total_loss = 0
            for ell in range(L):
                batch = random.sample(replay_buffer, batch_size)
                
                states = torch.stack([state_to_tensor(s[0], s[4], n) for s in batch])
                actions = torch.LongTensor([s[1] for s in batch])
                rewards = torch.FloatTensor([s[2] for s in batch])
                next_states = torch.stack([state_to_tensor(s[3], s[4], n) for s in batch])
                
                current_q = q_network(states).gather(1, actions.unsqueeze(1)).squeeze(1)
                
                with torch.no_grad():
                    next_q = target_network(next_states).max(1)[0]
                    target_q = rewards + gamma * next_q
                
                loss = nn.MSELoss()(current_q, target_q)*1000
                total_loss += loss.item()
                
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            
            if iteration % 10 == 0:
                from Evaluate.dqn_adapter import DQNPolicyWrapper
                x_policy = DQNPolicyWrapper(n, None, player='X')
                x_policy.model = q_network
                x_policy.model.eval()
                o_policy = DQNPolicyWrapper(n, None, player='O')
                o_policy.model = q_network
                o_policy.model.eval()
                
                result = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='baseline', runs=50, epsilon=0.25)
                result_random = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='random', runs=50, epsilon=0.25)
                print(f"Iteration {iteration}, Avg Loss: {total_loss/L:.6f}, vs Baseline: W:{result['win_rate']:.2f} D:{result['draw_rate']:.2f} L:{result['loss_rate']:.2f}, vs Random: W:{result_random['win_rate']:.2f} D:{result_random['draw_rate']:.2f} L:{result_random['loss_rate']:.2f}")
                if result['win_rate'] >= result['loss_rate']:
                    print("WINNER")
                    if (result['win_rate'] - result['loss_rate']) > 0.03: 
                        resultTwo = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='baseline', runs=5000, epsilon=0.25)
                        if resultTwo['win_rate'] >= resultTwo['loss_rate']:
                            print("CONFIRMED WINNER")
                            print(resultTwo['win_rate'], resultTwo['draw_rate'], resultTwo['loss_rate'])
                            print("------")

                            if (resultTwo['win_rate'] - resultTwo['loss_rate']) > best_win_differential:
                                best_win_differential = resultTwo['win_rate'] - resultTwo['loss_rate']
                                best_state_dict = deepcopy(q_network.state_dict())
                                
                                # save the model
                                os.makedirs(f"Policies/DQN/{n}_{gamma}_{epsilon_end}_winner", exist_ok=True)
                                torch.save(best_state_dict, f"Policies/DQN/{n}_{gamma}_{epsilon_end}_winner/q_network.pt")
                q_network.train()
        
        if iteration % target_update == 0:
            target_network.load_state_dict(q_network.state_dict())
        
        if track_progress and iteration % cutoff == 0 and iteration > 0:
            print(f"Iteration {iteration}")
    
    tracked_results = {
        "baseline_results": baseline_results,
        "random_results": random_results,
        "iter_at_eval": iter_at_eval
    }
    
    policies = {
        "q_network": q_network
    }
    
    return tracked_results, policies

def get_policy(q_network, n):
    import itertools
    
    print("Extracting policy from Q-network...")
    all_states = list(itertools.product(["X", "O", "_"], repeat=n*n))
    refined_states = []
    
    for state in tqdm(all_states, desc="Filtering valid states"):
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        counts = env.return_play_counts()
        x_count = counts['X']
        o_count = counts['O']
        
        if (x_count == o_count or x_count == o_count + 1):
            refined_states.append(state)
    
    pi_X = {}
    pi_O = {}
    
    for state in tqdm(refined_states, desc="Extracting greedy policy"):
        env = TicTacToeEnv(n)
        env.state = np.array(state).reshape((n, n))
        
        if env.check_game_status() is not None:
            continue
        
        env.set_player_auto()
        possible_actions = env.get_possible_actions()
        
        if len(possible_actions) == 0:
            continue
        
        counts = env.return_play_counts()
        x_count = counts['X']
        o_count = counts['O']
        
        if x_count == o_count:
            state_tensor = state_to_tensor(state, 1, n).unsqueeze(0)
            with torch.no_grad():
                q_values = q_network(state_tensor).squeeze(0)
                possible_q_values = []
                for a in possible_actions:
                    possible_q_values.append((q_values[a].item(), a.item()))
                best_action = max(possible_q_values, key=lambda x: x[0])[1]
                pi_X[tuple(state)] = best_action
        else:
            state_tensor = state_to_tensor(state, 2, n).unsqueeze(0)
            with torch.no_grad():
                q_values = q_network(state_tensor).squeeze(0)
                possible_q_values = []
                for a in possible_actions:
                    possible_q_values.append((q_values[a].item(), a.item()))
                best_action = max(possible_q_values, key=lambda x: x[0])[1]
                pi_O[tuple(state)] = best_action
    
    return pi_X, pi_O

if __name__ == "__main__":
    n = 7#5
    gamma = 1
    epsilon_start = 1.0
    epsilon_end = 0.25
    lr = 0.0005
    memory_size = 50000
    batch_size = 128
    H = 3000
    L = 30
    iterations = 3000
    
    tracked_results, policies = dqn_learning(n=n, gamma=gamma, epsilon_start=epsilon_start, epsilon_end=epsilon_end, lr=lr,
                                              memory_size=memory_size, batch_size=batch_size,
                                              H=H, L=L, iterations=iterations,
                                              track_progress=False)
    
    q_network = policies["q_network"]
    
    os.makedirs(f"Policies/DQN/{n}_{gamma}_{epsilon_end}", exist_ok=True)
    
    #torch.save(q_network.state_dict(), f"Policies/DQN/{n}_{gamma}_{epsilon_end}/q_network.pt")
    
    #with open(f"Policies/DQN/{n}_{gamma}_{epsilon_end}/tracked_results.pkl", "wb") as f:
        #pickle.dump(tracked_results, f)
    
    print("done")


    # got confimed winners with n=5 after only like 100 iters
    #970 with revised