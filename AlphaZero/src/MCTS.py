import math
import numpy as np
import torch

class Node:
    def __init__(self, game, parent, action, probability=0, t=0, n=0):
        self.parent = parent
        self.game = game
        self.t = t
        self.n = n 
        self.last_action = action
        self.children = []
        self.probability = probability
        if parent:
            parent.add_child(self)
            self.game.execute_move(action)
            self.board_state = np.copy(self.game.get_board())
            self.turn = self.game.get_turn()
            self.game.undo_move()
        else:
            self.turn = game.get_turn()

    def get_parent(self):
        return self.parent

    def add_child(self, child):
        self.children.append(child)

    def is_leaf_node(self):
        if len(self.children) == 0:
            return True
        return False

    def get_board_state(self):
        return np.copy(self.board_state)

    def get_last_action(self):
        return self.last_action

    def get_times_visited(self):
        return self.n

    def get_total_values(self):
        return self.t


class MCTS:

    def __init__(self, game, start_state, agent, Config, device):
        self.root = Node(game, None, None)
        self.game = game
        self.Config = Config
        self.root.board_state = np.copy(start_state)
        self.agent = agent
        self.device = device
        self.T = 1
        self.level = 0

    def reset_search(self):
        self.root = Node(self.game, None, None)
        self.root.board_state = self.game.get_board()

    @staticmethod
    def search_nodechildren_for_state(node, state):
        for child in node.children:
            if np.array_equal(child.get_board_state(), state):
                return child

    def find_node_given_state(self, state):
        correct = None
        start = self.root
        correct = MCTS.search_nodechildren_for_state(start, state)
        return correct

    def get_most_searched_child_node(self, node):
        max_node = None
        max_node_visits = 0
        for child in node.children:
            if child.get_times_visited() > max_node_visits:
                max_node = child
                max_node_visits = child.get_times_visited()
        return max_node

    def get_action_numbers(self, node):
        action_numbers = {}
        for i in range(self.Config.policy_output_dim):
            action_numbers[i] = 0

        for child in node.children:
            action_numbers[child.last_action] = child.get_times_visited()
        return action_numbers

    def get_prior_probabilities(self, board_state):
        with torch.no_grad():
            x = torch.from_numpy(board_state).float().to(self.device)
            x = x.transpose(1,3).transpose(2,3)
            pred = self.agent(x)
            pred = [p.cpu().numpy() for p in pred]
        return self.apply_softmax_with_masking(pred[0], np.array(self.game.get_legal_NN_output())), pred[1]

    def get_posterior_probabilities(self):
        node = self.root
        tot = 0
        post_prob = np.zeros(self.Config.policy_output_dim)

        actions = self.get_action_numbers(node)
        for action in actions:
            tot += actions[action]
        for action in actions:
            post_prob[self.Config.move_to_number(action)] = actions[action] / max(1, tot)
        return post_prob

    def get_temperature_probabilities(self, node):
        pi = {}
        actions = self.get_action_numbers(node)
        for action in actions:
            pi[action] = (actions[action]) ** (1 / self.T)
        return pi

    def get_temperature_move(self, node):
        pi = self.get_temperature_probabilities(node)
        moves = [move for move in pi.keys()]
        probs = [pi[key] for key in moves]
        probs = np.array(probs)
        probs = probs / sum(probs)
        return np.random.choice(moves, p=probs)

    def get_most_searched_move(self, node):
        actions = self.get_action_numbers(node)
        most_searched_move = 0
        max = -1
        # print(actions)
        for action in actions:
            if actions[action] > max:
                most_searched_move = action
                max = actions[action]
        return most_searched_move

    def search_series(self, number):
        for _ in range(number):
            self.search()

    def search(self):
        game = self.game
        parent = self.root
        while not parent.is_leaf_node():
            best_puct = None
            for child in parent.children:
                curr_puct = self.PUCT(parent, child)
                if (best_puct == None or curr_puct >= best_puct):
                    best_child = child
                    best_puct = curr_puct
            self.level += 1
            parent = best_child
            self.game.execute_move(best_child.last_action)

        with torch.no_grad():
            x = torch.from_numpy(np.array([game.get_board()])).float().to(self.device)
            x = x.transpose(1,3).transpose(2,3)
            raw_pred = self.agent(x)
            raw_pred = [p.cpu().numpy() for p in raw_pred]

        result = self.apply_softmax_with_masking(raw_pred[0], np.array(self.game.get_legal_NN_output()))

        if not self.game.is_final():
            valid_moves = game.get_moves()
            for move in valid_moves:
                Node(game, parent, move, result[move])
            self.back_propagate(parent, raw_pred[1][0][0])
            self.level = 0
        else:
            self.back_propagate(parent, raw_pred[1][0][0])
            self.level = 0

    def back_propagate(self, node, t):
        game = self.game
        if game.is_final():
            result = game.get_outcome()[node.parent.turn]
            node.t += result
            node.n += 1
            game.undo_move()
            self.back_propagate(node.get_parent(), -result)
        else:
            node.t += t
            node.n += 1

            if node.get_parent() is not None:
                game.undo_move()
                self.back_propagate(node.get_parent(), -t)

    def PUCT(self, node, child):
        N = child.n
        sum_N_potential_actions = max(node.n - 1, 1)
        exp = math.log(1 + sum_N_potential_actions + math.sqrt(2)) / math.sqrt(2) + 1
        U = exp * child.probability * math.sqrt(sum_N_potential_actions) / (1 + N)
        Q = child.t / max(N, 1)
        return Q + U
    
    def apply_softmax_with_masking(self, logits, legal_moves_mask):

        if logits.ndim > 1:
            logits = logits[0]

        logits = logits.copy()
        logits[legal_moves_mask == 0] = -100
        exp_logits = np.exp(logits - np.max(logits))
        return exp_logits / exp_logits.sum()