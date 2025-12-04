import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Evaluate.eval import eval_policy
from Evaluate.dqn_adapter import DQNPolicyWrapper
import time
import pickle
import torch

n = 15
model_dir = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/DQN/15_0.9_0.25_not_winner"

x_policy = DQNPolicyWrapper(n, f"{model_dir}/q_network.pt", player='X')
o_policy = DQNPolicyWrapper(n, f"{model_dir}/q_network.pt", player='O')

print("Evaluating DQN vs Baseline")
baseline_results = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='baseline', runs=5000, epsilon=0.25)
print(f"vs Baseline: {baseline_results}")

print("\nEvaluating DQN vs Random")
random_results = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='random', runs=5000, epsilon=0.25)
print(f"vs Random: {random_results}")


# basic warm up
for _ in range(100):
    dummy_input = torch.randn(1, n*n+1) 
    x_policy.model(dummy_input)

# now time it
num_iterations = 10000 # this will be done serially and on the CPU
start = time.perf_counter()
for _ in range(num_iterations):
    x_policy.model(dummy_input)
end = time.perf_counter()

avg_time_one_call = (end-start)/num_iterations
print(f"Average time for a call: {round(avg_time_one_call,6)} seconds")

# now compare to average time to call a basic policy
basic_policy_dir = "/Users/michaelmurray/Documents/GitHub/Tic_tac_tool/Policies/VI/3_0.2_0.9_0.25/temp_policy_x.pkl"

with open(basic_policy_dir, 'rb') as f:
    policy = pickle.load(f)

input = list(policy.keys())[0]
start = time.perf_counter()
for _ in range(num_iterations):
    policy[input]
end = time.perf_counter()

avg_time_one_call_basic = (end-start)/num_iterations
print(f"Average time for a basic policy call: {round(avg_time_one_call_basic,6)} seconds")

# I think time complexity is O(n^2) for the NN and for dict lookup (hashmap) its just O(1)