import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from Evaluate.eval import eval_policy
from Evaluate.dqn_adapter import DQNPolicyWrapper

n = 7
model_dir = "Policies/DQN/7_1_0.25_winner"

x_policy = DQNPolicyWrapper(n, f"{model_dir}/q_network.pt", player='X')
o_policy = DQNPolicyWrapper(n, f"{model_dir}/q_network.pt", player='O')

print("Evaluating DQN vs Baseline")
baseline_results = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='baseline', runs=5000, epsilon=0.25)
print(f"vs Baseline: {baseline_results}")

print("\nEvaluating DQN vs Random")
random_results = eval_policy(n=n, x_policy=x_policy, o_policy=o_policy, opponent='random', runs=5000, epsilon=0.25)
print(f"vs Random: {random_results}")
