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
from Evaluate.dqn_adapter import DQNPolicyWrapper

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
        self.fc3 = nn.Linear(hidden_size, n*n)
        
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        x = self.fc3(x)
        return x

def state_to_tensor(state, current_player, n):
    state_array = np.array(state)
    numeric_state = np.zeros(n*n+ 1)
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
    cost = nn.MSELoss()
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
    
    print("Running DQN learning:")
    total_forward_calls = 0
    for iteration in tqdm(range(iterations)):
        j_iter_for_forward_calls = 0
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
                    q_values = q_network(state_tensor).squeeze(0).numpy()
                    action = possible_actions[np.argmax(q_values[possible_actions])]

            j_iter_for_forward_calls += 1
            total_forward_calls += 1

            next_env = TicTacToeEnv(n)
            next_env.state = env.state.copy()
            next_env.current_player = env.current_player
            next_env.step(action)
            next_state = tuple(next_env.get_flat_state())
            
            reward = next_env.check_game_status()
            if reward is None:
                reward = 0.0
            else:
                if current_player == 2: # if its player 2 then we reduce rewad as thats the opponent
                    reward = -reward
            
            if not (use_baseline and current_player == 2):
                replay_buffer.append((state, action, reward, next_state, current_player)) # add to replay buffer
            
            state = next_state
            env.state = next_env.state.copy()
            env.current_player = next_env.current_player
            
            if next_env.check_game_status() is not None:
                env.reset()
                state = tuple(env.get_flat_state())
        
        if len(replay_buffer) >= batch_size:
            total_loss = 0
            for m in range(L):
                batch = random.sample(replay_buffer, batch_size)
                
                states = torch.stack([state_to_tensor(s[0], s[4], n) for s in batch])
                actions = torch.LongTensor([s[1] for s in batch])
                rewards = torch.FloatTensor([s[2] for s in batch])
                next_states = torch.stack([state_to_tensor(s[3], s[4], n) for s in batch])
                
                #current_q = q_network(states).gather(1, actions.unsqueeze(1)).squeeze(1)
                ats = actions.view(-1,1)
                current_q = q_network(states).gather(1,ats).squeeze()
                # want to sample the current_q at the spcified actions. gather allows us to do so by appliny ig along dimension 1
                with torch.no_grad():
                    next_q = target_network(next_states).max(1)[0] # this is just going to be the optimal action from the model based on the next states
                    target_q = rewards + gamma * next_q 
                
                loss = cost(current_q, target_q)*1000
                total_loss += loss.item()
                
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
            
            if iteration % 10 == 0: # this whole thing is just for saving models if they are good canadiates (this is poorly done from a computational perspective)
                x_policy = DQNPolicyWrapper(n, None, player='X')
                x_policy.model = q_network
                x_policy.model.eval()
                o_policy = DQNPolicyWrapper(n, None, player='O')
                o_policy.model = q_network
                o_policy.model.eval()
                
                result = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='baseline', runs=50, epsilon=0.25)
                result_random = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='random', runs=50, epsilon=0.25)
                print(f"Iteration {iteration}, Avg Loss: {total_loss/L:.6f}, vs Baseline: W:{result['win_rate']:.2f} D:{result['draw_rate']:.2f} L:{result['loss_rate']:.2f}, vs Random: W:{result_random['win_rate']:.2f} D:{result_random['draw_rate']:.2f} L:{result_random['loss_rate']:.2f}")
                if result['win_rate'] > result['loss_rate']:
                    print("WINNER") # turn this off for now so its faster
                    """
                    if (result['win_rate'] - result['loss_rate']) > 0.01:#0.03: 
                        resultTwo = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='baseline', runs=5000, epsilon=0.25)
                        if resultTwo['win_rate'] > resultTwo['loss_rate']:
                            
                            print("CONFIRMED WINNER")
                            print(resultTwo['win_rate'], resultTwo['draw_rate'], resultTwo['loss_rate'])
                            print("------")

                            if (resultTwo['win_rate'] - resultTwo['loss_rate']) > best_win_differential:
                                best_win_differential = resultTwo['win_rate'] - resultTwo['loss_rate']
                                best_state_dict = deepcopy(q_network.state_dict())
                                
                                # save the model
                                script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                                winner_dir = os.path.join(script_dir, f"Policies/DQN/{n}_{gamma}_{epsilon_end}_winner")
                                os.makedirs(winner_dir, exist_ok=True)
                                torch.save(best_state_dict, os.path.join(winner_dir, "q_network.pt"))
                    """
                q_network.train()
        
        if iteration % target_update == 0:
            target_network.load_state_dict(q_network.state_dict())
        
        if track_progress and iteration > 0 and iteration % 10 == 0:
            print(f"\nEvaluating at iteration {iteration}, total actions: {total_forward_calls}")

            x_policy = DQNPolicyWrapper(n, None, player='X')
            o_policy = DQNPolicyWrapper(n, None, player='O')

            x_policy.model = q_network
            o_policy.model = q_network
            
            baseline_results.append(eval_policy(n=n, o_policy=o_policy, x_policy=x_policy, runs=5000, opponent='baseline', epsilon=0.25))
            random_results.append(eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, runs=5000, opponent='random', epsilon=0.25))
            iter_at_eval.append([iteration, total_forward_calls])
            
    
    tracked_results = {
        "baseline_results": baseline_results,
        "random_results": random_results,
        "iter_at_eval": iter_at_eval
    }
    
    return tracked_results, q_network


if __name__ == "__main__":
    # single call

    n = 5 # 5
    gamma = 1
    epsilon_start = 1.0
    epsilon_end = 0.25
    lr = 0.0005
    memory_size = 50000
    batch_size = 128
    H = 3000
    L = 30
    iterations = 1000
    
    tracked_results, q_network = dqn_learning(n=n, gamma=gamma, epsilon_start=epsilon_start, epsilon_end=epsilon_end, lr=lr,
                                              memory_size=memory_size, batch_size=batch_size,
                                              H=H, L=L, iterations=iterations,
                                              track_progress=True)
    
    script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    winner_dir = os.path.join(script_dir, f"Policies/DQN/{n}_{gamma}_{epsilon_end}_winner")
    os.makedirs(winner_dir, exist_ok=True)
    
    with open(os.path.join(winner_dir, "tracked_results.pkl"), "wb") as f:
        pickle.dump(tracked_results, f)
    
    print("done")

if __name__ == "__mai2n__":
    ## running_loop
    gamma = 1 # TODO DO I WANT THIS OR NOT
    epsilon_start = 1.0 
    epsilon_end = 0.25
    lr = 0.0005
    memory_size = 50000
    batch_size = 128
    H = 3000
    L = 30
    iterations = 3000
    for n in [3,4,5,6,7,8,9,10,11,12,13,14,15]:
        tracked_results, q_network = dqn_learning(n=n, gamma=gamma, epsilon_start=epsilon_start, epsilon_end=epsilon_end, lr=lr,
                                            memory_size=memory_size, batch_size=batch_size,
                                            H=H, L=L, iterations=iterations,
                                            track_progress=True)
            
        # Use absolute path based on script location
        script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        winner_dir = os.path.join(script_dir, f"Policies/DQN/{n}_{gamma}_{epsilon_end}_winner")
        os.makedirs(winner_dir, exist_ok=True)
        
        with open(os.path.join(winner_dir, "tracked_results.pkl"), "wb") as f:
            pickle.dump(tracked_results, f)


