import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Tabs.css";
import FAQBox from "./FAQBox";

import valueIterationResults from "../data/valueIterationResults.json";

import montecarloResults from "../data/montecarloResults.json";
// import sarsaResults from "../data/sarsaResults.json";
// import qlearningResults from "../data/qlearningResults.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeSub, setActiveSub] = useState(null);
  const [boardSize, setBoardSize] = useState(3);

  const tabs = [
    {
      name: "Model-Based",
      description:
        "Model-based algorithms plan ahead using a model of the environment.",
      subItems: [
        {
          name: "Value Iteration",
          content:
            "Value iteration is a method of computing optimal policies by iteratively updating value functions.",
        },
        {
          name: "Policy Iteration",
          content:
            "Policy iteration alternates between evaluating a policy and improving it to find optimal actions.",
        },
      ],
    },
    {
      name: "Model-Free",
      description:
        "Model-free algorithms learn directly from experience without an explicit model of the environment.",
      subItems: [
        {
          name: "Monte Carlo",
          content:
            "Q-Learning is an off-policy algorithm that updates action values based on maximum expected future rewards.",
        },
        {
          name: "SARSA",
          content:
            "SARSA is an on-policy algorithm that updates action values based on actual experience.",
        },
        {
          name: "Q-Learning",
          content:
            "Q-Learning is an off-policy algorithm that updates action values based on maximum expected future rewards.",
        },
      ],
    },
    {
      name: "Deep Learning",
      description:
        "Deep learning algorithms use neural networks to approximate policies or value functions.",
      subItems: [
        {
          name: "DQN",
          content:
            "Deep Q-Networks combine Q-learning with neural networks to handle high-dimensional inputs.",
        },
        {
          name: "Alpha Zero",
          content:
            "In progress. Policy gradient methods optimize the policy directly using gradients of expected rewards.",
        },
      ],
    },
  ];

  const currentTab = tabs[activeTab];

  const getPlotData = (plotIndex) => {
    //------------------------ VALUE ITERATION PLOTS
    if (activeTab === 0 && activeSub === 0) {
      if (plotIndex === 0) {
        return {
          labels: valueIterationResults.iteration_steps,
          datasets: [
            {
              label: "Win Rate",
              data: valueIterationResults.baseline.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: valueIterationResults.baseline.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: valueIterationResults.baseline.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: valueIterationResults.iteration_steps,
          datasets: [
            {
              label: "Win Rate",
              data: valueIterationResults.random.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: valueIterationResults.random.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: valueIterationResults.random.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //------------------------ MONTE CARLO PLOTS
    //////// ------- FOR 3x3 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 3) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_3x3.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_3x3.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_3x3.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 4x4 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 4) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_4x4.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_4x4.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_4x4.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 5x5 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 5) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_5x5.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_5x5.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_5x5.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 6x6 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 6) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_6x6.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_6x6.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_6x6.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 7x7 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 7) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_7x7.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_7x7.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_7x7.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 8x8 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 8) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_8x8.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_8x8.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_8x8.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 9x9 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 9) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_9x9.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_9x9.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_9x9.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    //////// ------- FOR 10x10 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 10) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_8x8.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.baseline_10x10.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.baseline_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.baseline_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_10x10.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.random_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.random_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      }
    }
    // Dummy data for other plots
    return {
      labels: ["A", "B", "C", "D", "E"],
      datasets: [
        {
          label: `Plot ${plotIndex + 1}`,
          data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)),
          borderColor: "#b41f1f",
          backgroundColor: "rgba(180, 31, 31, 0.1)",
          tension: 0.3,
        },
      ],
    };
  };

  const getPlotTitle = (plotIndex) => {
    // - VALUE ITERATION--------------------------------------------------------///
    if (activeTab === 0 && activeSub === 0) {
      if (plotIndex === 0) return "Baseline Opponent Performance";
      if (plotIndex === 1) return "Random Opponent Performance";
    }
    // - MONTE CARLO--------------------------------------------------------///
    if (activeTab === 1 && activeSub === 0) {
      if (plotIndex === 0) return "Training Performance";
      if (plotIndex === 1) return "Play Performance against Baseline Opponent ";
      if (plotIndex === 2) return "Play Performance against Random Opponent ";
      if (plotIndex === 3) return "Inference Time";
    }
    return `Plot ${plotIndex + 1}`;
  };

  const getChartOptions = (plotIndex) => {
    // For real data plots, show legend
    /// ----------------  VALUE ITERATION ---------------------------------//
    if (
      activeTab === 0 &&
      activeSub === 0 &&
      (plotIndex === 0 || plotIndex === 1)
    ) {
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: "Iteration Steps",
            },
          },
          y: {
            grid: { color: "#eee" },
            title: {
              display: true,
              text: "Rate",
            },
            min: 0,
            max: 1,
          },
        },
      };
    }
    /// ----------------  MONTE CARLO  ---------------------------------//
    if (activeTab === 1 && activeSub === 0 && plotIndex === 0) {
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: "Number of Training Episodes",
            },
          },
          y: {
            grid: { color: "#eee" },
            title: {
              display: true,
              text: "Rate",
            },
            min: 0,
            max: 1,
          },
        },
      };
    }
    if (
      activeTab === 1 &&
      activeSub === 0 &&
      (plotIndex === 1 || plotIndex == 2)
    ) {
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: "Number of Games",
            },
          },
          y: {
            grid: { color: "#eee" },
            title: {
              display: true,
              text: "Rate",
            },
            min: 0,
            max: 1,
          },
        },
      };
    }
    if (activeTab === 1 && activeSub === 0 && plotIndex == 3) {
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            grid: { display: false },
            title: {
              display: true,
              text: "Board Size",
            },
          },
          y: {
            grid: { color: "#eee" },
            title: {
              display: true,
              text: "T(n)",
            },
            min: 0,
            max: 1,
          },
        },
      };
    }

    // Default options for dummy plots
    return {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: "#eee" } },
      },
    };
  };

  return (
    <section id="tabs" className="tabs-container">
      <h2>Algorithms</h2>

      {/* Main Tabs */}
      <div className="tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={activeTab === i ? "tab active" : "tab"}
            onClick={() => {
              setActiveTab(i);
              setActiveSub(null);
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Description + Sub-items */}
      <div className="tab-content">
        <p>{currentTab.description}</p>

        {currentTab.subItems && (
          <div className="sub-items">
            {currentTab.subItems.map((sub, idx) => (
              <button
                key={idx}
                className={activeSub === idx ? "sub-item active" : "sub-item"}
                onClick={() => setActiveSub(idx)}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Sub-item Content + 6 Plots */}
        {activeSub !== null && (
          <div className="sub-content">
            <p>{currentTab.subItems[activeSub].content}</p>

            {/* Board Size Selector */}

            <div className="board-size-select">
              <label>
                Board Size
                <select
                  value={boardSize}
                  onChange={(e) => setBoardSize(Number(e.target.value))}
                >
                  {Array.from({ length: 8 }, (_, i) => i + 3).map((size) => (
                    <option key={size} value={size}>
                      {size} × {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="plots-and-faq">
              {/* 4-PLOT GRID */}
              <div className="plots-grid">
                {[...Array(4)].map((_, i) => (
                  <div className="plot-card" key={i}>
                    <h4>{getPlotTitle(i)}</h4>
                    <Line data={getPlotData(i)} options={getChartOptions(i)} />
                  </div>
                ))}
              </div>

              {/* FAQ BOX */}
              <FAQBox />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
