import { useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./Tabs.css";
import FAQBox from "./FAQBox";

import valueIterationResults from "../data/valueIterationResults.json";

import montecarloResults from "../data/montecarloResults.json";
import sarsaResults from "../data/sarsaResults.json";
import qlearningResults from "../data/qlearningResults.json";
import dqnResults from "../data/dqnResults.json";
import policyIterResults from "../data/policyIterResults.json";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
            "Monte Carlo learns optimal strategies by averaging outcomes from completed trial runs in an environment.",
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
            "In progress. To be able to achieve positive win rates for board sizes larger than 15 x 15, we have implemented AlphaZero, a Deep RL algorithm. AlphaZero is a two headed model, with a policy and a value head. It is significantly more computationally intensive to train than other algorithims we present in this tool.",
        },
      ],
    },
  ];

  const currentTab = tabs[activeTab];
  const [highlightPlot, setHighlightPlot] = useState(null);

  const getPlotData = (plotIndex) => {
    //------------------------ VALUE ITERATION PLOTS
    //////// ------- FOR 3x3 ------------------------------------////
    if (activeTab === 0 && activeSub === 0 && boardSize == 3) {
      if (plotIndex === 0) {
        return {
          labels: valueIterationResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: valueIterationResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: valueIterationResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: valueIterationResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.53, 0.1152, 0.3548],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_3x3.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_3x3.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_3x3.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 4x4 ------------------------------------////
    if (activeTab === 0 && activeSub === 0 && boardSize == 4) {
      if (plotIndex === 0) {
        return {
          labels: valueIterationResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: valueIterationResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: valueIterationResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: valueIterationResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.3254, 0.0256, 0.649],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: valueIterationResults.iteration_steps,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_4x4.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_4x4.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_4x4.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //------------------------ POLICY ITERATION PLOTS
    //////// ------- FOR 3x3 ------------------------------------////
    if (activeTab === 0 && activeSub === 1 && boardSize == 3) {
      if (plotIndex === 0) {
        return {
          labels: [0],
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: policyIterResults.iteration_steps,
          datasets: [
            {
              label: "Win Rate",
              data: policyIterResults.baseline.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: policyIterResults.baseline.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: policyIterResults.baseline.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_3x3.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_3x3.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_3x3.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
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
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.6593, 0.23, 0.1103],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_3x3.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_3x3.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_3x3.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_3x3.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 4x4 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 4) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.3729, 0.26, 0.371],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_4x4.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_4x4.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_4x4.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_4x4.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 5x5 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 5) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.2379, 0.12, 0.3268],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_5x5.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_5x5.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_5x5.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_5x5.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 6x6 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 6) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.1398, 0.12, 0.7403],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_6x6.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_6x6.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_6x6.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_6x6.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 7x7 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 7) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.051, 0.08, 0.8399],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_7x7.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_7x7.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_7x7.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_7x7.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 8x8 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 8) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0429, 0.04, 0.9159],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_8x8.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_8x8.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_8x8.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_8x8.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 9x9 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 9) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0247, 0.02, 0.9512],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_9x9.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
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
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_9x9.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_9x9.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_9x9.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 10x10 ------------------------------------////
    if (activeTab === 1 && activeSub === 0 && boardSize == 10) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Time Complexity",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0074, 0.01, 0.9732],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.random_10x10.win_rates,
              borderColor: "#2ecc79",
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
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: montecarloResults.training_10x10.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: montecarloResults.training_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: montecarloResults.training_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_10x10.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_10x10.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_10x10.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //------------------------ SARSA PLOTS
    //////// ------- FOR 3x3 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 3) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.6749, 0.24, 0.0842],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_3x3.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_3x3.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: sarsaResults.algs_3x3.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: sarsaResults.algs_3x3.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: sarsaResults.algs_3x3.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 4x4 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 4) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.3349, 0.25, 0.4146],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_4x4.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_4x4.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_4x4.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_4x4.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_4x4.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 5x5 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 5) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.226, 0.18, 0.5906],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_5x5.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_5x5.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_5x5.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_5x5.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_5x5.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 6x6 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 6) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.1338, 0.12, 0.7501],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_6x6.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_6x6.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_6x6.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_6x6.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_6x6.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 7x7 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 7) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0829, 0.07, 0.8439],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_7x7.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_7x7.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_7x7.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_7x7.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_7x7.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 8x8 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 8) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.046, 0.04, 0.9128],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_8x8.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_8x8.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_8x8.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_8x8.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_8x8.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 9x9 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 9) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0241, 0.02, 0.9521],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_9x9.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_9x9.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_9x9.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_9x9.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_9x9.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 10x10 ------------------------------------////
    if (activeTab === 1 && activeSub === 1 && boardSize == 10) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0136, 0.01, 0.9739],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.random_10x10.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.random_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.random_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: sarsaResults.training_10x10.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: sarsaResults.training_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: sarsaResults.training_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_10x10.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_10x10.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_10x10.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //------------------------ Q LEARNING PLOTS
    //////// ------- FOR 3x3 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 3) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.7205, 0.23, 0.0488],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_3x3.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_3x3.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_3x3.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_3x3.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_3x3.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_3x3.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_3x3.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 4x4 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 4) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.4399, 0.25, 0.3755],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_4x4.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_4x4.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_4x4.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_4x4.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_4x4.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 5x5 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 5) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.2238, 0.18, 0.5995],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_5x5.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_5x5.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_5x5.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_5x5.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_5x5.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 6x6 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 6) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.1331, 0.12, 0.7503],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_6x6.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_6x6.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_6x6.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_6x6.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_6x6.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_6x6.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_6x6.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 7x7 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 7) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0837, 0.07, 0.8447],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_7x7.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_7x7.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_7x7.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_7x7.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_7x7.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 8x8 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 8) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0467, 0.04, 0.9105],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_8x8.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_8x8.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_8x8.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_8x8.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_8x8.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 9x9 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 9) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0264, 0.02, 0.951],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_9x9.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_9x9.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_9x9.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_9x9.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_9x9.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_9x9.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_9x9.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 10x10 ------------------------------------////
    if (activeTab === 1 && activeSub === 2 && boardSize == 10) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: montecarloResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0134, 0.01, 0.9734],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_10x10.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_10x10.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_10x10.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_10x10.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_10x10.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //------------------------ DQN PLOTS
    //////// ------- FOR 3x3 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 3) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.124, 0.021, 0.855],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_3x3.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_3x3.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_3x3.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 4x4 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 4) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.112, 0.6, 0.882],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_4x4.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_4x4.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_4x4.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_4x4.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_4x4.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_4x4.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 5x5 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 5) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.62, 0.327, 0.053],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.training_5x5.baseline.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.training_5x5.baseline.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.training_5x5.baseline.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.training_5x5.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.training_5x5.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.training_5x5.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_5x5.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_5x5.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_5x5.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 6x6 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 6) {
      if (plotIndex === 0) {
        return {
          labels: dqnResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: dqnResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.32, 0.254, 0.426],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_6x6.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_6x6.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_6x6.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 7x7 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 7) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.315, 0.213, 0.472],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_7x7.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_7x7.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_7x7.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_7x7.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_7x7.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_7x7.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 8x8 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 8) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.211, 0.145, 0.644],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_8x8.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_8x8.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_8x8.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_8x8.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_8x8.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_8x8.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 9x9 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 9) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.144, 0.105, 0.751],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_9x9.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_9x9.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_9x9.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
            },
          ],
        };
      }
    }
    //////// ------- FOR 10x10 ------------------------------------////
    if (activeTab === 2 && activeSub === 0 && boardSize == 10) {
      if (plotIndex === 0) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "Win Rate",
              data: dqnResults.overall.win_rates,
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: dqnResults.overall.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: dqnResults.overall.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 1) {
        return {
          labels: montecarloResults.board_size,
          datasets: [
            {
              label: "O(1)",
              data: dqnResults.inference_time,
              borderColor: "#f29e5a",
              backgroundColor: "rgba(242, 158, 90, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 2) {
        return {
          labels: ["Win Rate", "Loss Rate", "Draw Rate"],
          datasets: [
            {
              data: [0.0143, 0.058, 0.799],
              backgroundColor: ["#2ecc79", "#e74c3c", "#3498db"],
            },
          ],
        };
      } else if (plotIndex === 3) {
        return {
          // random plot
          labels: montecarloResults.num_games,
          datasets: [
            {
              label: "Win Rate",
              data: qlearningResults.random_10x10.win_rates,
              borderColor: "#2ecc79",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: qlearningResults.random_10x10.draw_rates,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: qlearningResults.random_10x10.loss_rates,
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 4) {
        return {
          labels: montecarloResults.episodes,
          datasets: [
            {
              label: "Win Rate",
              data: [0],
              borderColor: "#2ecc71",
              backgroundColor: "rgba(46, 204, 113, 0.1)",
              tension: 0.3,
            },
            {
              label: "Draw Rate",
              data: [0],
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.1)",
              tension: 0.3,
            },
            {
              label: "Loss Rate",
              data: [0],
              borderColor: "#e74c3c",
              backgroundColor: "rgba(231, 76, 60, 0.1)",
              tension: 0.3,
            },
          ],
        };
      } else if (plotIndex === 5) {
        return {
          labels: montecarloResults.Algorithims, // x-axis labels
          datasets: [
            {
              label: "Wins",
              data: montecarloResults.algs_10x10.win_rates, // height of "Wins" segment
              backgroundColor: "rgba(46, 204, 113, 0.7)",
              stack: "Stack 0", // same stack group
            },
            {
              label: "Losses",
              data: montecarloResults.algs_10x10.loss_rates,
              backgroundColor: "rgba(231, 76, 60, 0.7)",
              stack: "Stack 0",
            },
            {
              label: "Draws",
              data: montecarloResults.algs_10x10.draw_rates,
              backgroundColor: "rgba(52, 152, 219, 0.7)",
              stack: "Stack 0",
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
      if (plotIndex === 0)
        return "Overall Performance of Value Iteration across Board Sizes";
      if (plotIndex === 1)
        return "Inference Time for Value Iteration across Board Sizes";
      if (plotIndex === 4 && boardSize === 3)
        return "Baseline Opponent Performance for Value Iteration on a 3 x 3 Board";
      if (plotIndex === 4 && boardSize === 4)
        return "Baseline Opponent Performance for Value Iteration on a 4 x 4 Board";
      if (plotIndex === 5 && boardSize === 3)
        return "Performance Comparison across Algorithims for 3 x 3 Board";
      if (plotIndex === 5 && boardSize === 4)
        return "Performance Comparison across Algorithims for 4 x 4 Board";
      if (plotIndex === 2 && boardSize === 3)
        return "Play Performance against Baseline Opponent on 3 x 3 Board";
      if (plotIndex === 2 && boardSize === 4)
        return "Play Performance against Baseline Opponent on 4 x 4 Board";
    }
    // - POLICY ITERATION--------------------------------------------------------///
    if (activeTab === 0 && activeSub === 1) {
      if (plotIndex === 0)
        return "Overall Performance of Policy Iteration across Board Sizes";
      if (plotIndex === 1)
        return "Inference Time for Policy Iteration across Board Sizes";
      if (plotIndex === 4)
        return "Baseline Opponent Performance for Policy Iteration on a 3 x 3 board";
      if (plotIndex === 5)
        return "Performance Comparison across Algorithims for 3 x 3 Board";
      if (plotIndex === 2 && boardSize === 3)
        return "Play Performance against Baseline Opponent on 3 x 3 Board";
    }
    // - MONTE CARLO--------------------------------------------------------///
    if (activeTab === 1 && activeSub === 0) {
      if (plotIndex === 0)
        return "Overall Performance of Monte Carlo across Board Sizes";
      if (plotIndex === 1)
        return "Inference Time for Monte Carlo across Board Sizes";
      if (plotIndex === 2 && boardSize === 3)
        return "Play Performance against Baseline Opponent on 3 x 3 Board";
      if (plotIndex === 2 && boardSize === 4)
        return "Play Performance against Baseline Opponent on 4 x 4 Board";
      if (plotIndex === 2 && boardSize === 5)
        return "Play Performance against Baseline Opponent on 5 x 5 Board";
      if (plotIndex === 2 && boardSize === 6)
        return "Play Performance against Baseline Opponent on 6 x 6 Board";
      if (plotIndex === 2 && boardSize === 7)
        return "Play Performance against Baseline Opponent on 7 x 7 Board";
      if (plotIndex === 2 && boardSize === 8)
        return "Play Performance against Baseline Opponent on 8 x 8 Board";
      if (plotIndex === 2 && boardSize === 9)
        return "Play Performance against Baseline Opponent on 9 x 9 Board";
      if (plotIndex === 2 && boardSize === 10)
        return "Play Performance against Baseline Opponent on 10 x 10 Board";
      if (plotIndex === 3 && boardSize === 3)
        return "Play Performance against Random Opponent on 3 x 3 Board";
      if (plotIndex === 3 && boardSize === 4)
        return "Play Performance against Random Opponent on 4 x 4 Board";
      if (plotIndex === 3 && boardSize === 5)
        return "Play Performance against Random Opponent on 5 x 5 Board";
      if (plotIndex === 3 && boardSize === 6)
        return "Play Performance against Random Opponent on 6 x 6 Board";
      if (plotIndex === 3 && boardSize === 7)
        return "Play Performance against Random Opponent on 7 x 7 Board";
      if (plotIndex === 3 && boardSize === 8)
        return "Play Performance against Random Opponent on 8 x 8 Board";
      if (plotIndex === 3 && boardSize === 9)
        return "Play Performance against Random Opponent on 9 x 9 Board";
      if (plotIndex === 3 && boardSize === 10)
        return "Play Performance against Random Opponent on 10 x 10 Board";
      if (plotIndex === 4 && boardSize === 3)
        return "Improvement During Training for Monte Carlo on 3 x 3 Board";
      if (plotIndex === 4 && boardSize === 4)
        return "Improvement During Training for Monte Carlo on 4 x 4 Board";
      if (plotIndex === 4 && boardSize === 5)
        return "Improvement During Training for Monte Carlo on 5 x 5 Board";
      if (plotIndex === 4 && boardSize === 6)
        return "Improvement During Training for Monte Carlo on 6 x 6 Board";
      if (plotIndex === 4 && boardSize === 7)
        return "Improvement During Training for Monte Carlo on 7 x 7 Board";
      if (plotIndex === 4 && boardSize === 8)
        return "Improvement During Training for Monte Carlo on 8 x 8 Board";
      if (plotIndex === 4 && boardSize === 9)
        return "Improvement During Training for Monte Carlo on 9 x 9 Board";
      if (plotIndex === 4 && boardSize === 10)
        return "Improvement During Training for Monte Carlo on 10 x 10 Board";
      if (plotIndex === 5 && boardSize === 3)
        return "Performance Comparison across Algorithims for 3 x 3 Board";
      if (plotIndex === 5 && boardSize === 4)
        return "Performance Comparison across Algorithims for 4 x 4 Board";
      if (plotIndex === 5 && boardSize === 5)
        return "Performance Comparison across Algorithims for 5 x 5 Board";
      if (plotIndex === 5 && boardSize === 6)
        return "Performance Comparison across Algorithims for 6 x 6 Board";
      if (plotIndex === 5 && boardSize === 7)
        return "Performance Comparison across Algorithims for 7 x 7 Board";
      if (plotIndex === 5 && boardSize === 8)
        return "Performance Comparison across Algorithims for 8 x 8 Board";
      if (plotIndex === 5 && boardSize === 9)
        return "Performance Comparison across Algorithims for 9 x 9 Board";
      if (plotIndex === 5 && boardSize === 10)
        return "Performance Comparison across Algorithims for 10 x 10 Board";
    }
    // - SARSA--------------------------------------------------------///
    if (activeTab === 1 && activeSub === 1) {
      if (plotIndex === 0)
        return "Overall Performance of SARSA across Board Sizes";
      if (plotIndex === 1) return "Inference Time for SARSA across Board Sizes";
      if (plotIndex === 2 && boardSize === 3)
        return "Play Performance against Baseline Opponent on 3 x 3 Board";
      if (plotIndex === 2 && boardSize === 4)
        return "Play Performance against Baseline Opponent on 4 x 4 Board";
      if (plotIndex === 2 && boardSize === 5)
        return "Play Performance against Baseline Opponent on 5 x 5 Board";
      if (plotIndex === 2 && boardSize === 6)
        return "Play Performance against Baseline Opponent on 6 x 6 Board";
      if (plotIndex === 2 && boardSize === 7)
        return "Play Performance against Baseline Opponent on 7 x 7 Board";
      if (plotIndex === 2 && boardSize === 8)
        return "Play Performance against Baseline Opponent on 8 x 8 Board";
      if (plotIndex === 2 && boardSize === 9)
        return "Play Performance against Baseline Opponent on 9 x 9 Board";
      if (plotIndex === 2 && boardSize === 10)
        return "Play Performance against Baseline Opponent on 10 x 10 Board";
      if (plotIndex === 3 && boardSize === 3)
        return "Play Performance against Random Opponent on 3 x 3 Board";
      if (plotIndex === 3 && boardSize === 4)
        return "Play Performance against Random Opponent on 4 x 4 Board";
      if (plotIndex === 3 && boardSize === 5)
        return "Play Performance against Random Opponent on 5 x 5 Board";
      if (plotIndex === 3 && boardSize === 6)
        return "Play Performance against Random Opponent on 6 x 6 Board";
      if (plotIndex === 3 && boardSize === 7)
        return "Play Performance against Random Opponent on 7 x 7 Board";
      if (plotIndex === 3 && boardSize === 8)
        return "Play Performance against Random Opponent on 8 x 8 Board";
      if (plotIndex === 3 && boardSize === 9)
        return "Play Performance against Random Opponent on 9 x 9 Board";
      if (plotIndex === 3 && boardSize === 10)
        return "Play Performance against Random Opponent on 10 x 10 Board";
      if (plotIndex === 4 && boardSize === 3)
        return "Improvement During Training for SARSA on 3 x 3 Board";
      if (plotIndex === 4 && boardSize === 4)
        return "Improvement During Training for SARSA on 4 x 4 Board";
      if (plotIndex === 4 && boardSize === 5)
        return "Improvement During Training for SARSA on 5 x 5 Board";
      if (plotIndex === 4 && boardSize === 6)
        return "Improvement During Training for SARSA on 6 x 6 Board";
      if (plotIndex === 4 && boardSize === 7)
        return "Improvement During Training for SARSA on 7 x 7 Board";
      if (plotIndex === 4 && boardSize === 8)
        return "Improvement During Training for SARSA on 8 x 8 Board";
      if (plotIndex === 4 && boardSize === 9)
        return "Improvement During Training for SARSA on 9 x 9 Board";
      if (plotIndex === 4 && boardSize === 10)
        return "Improvement During Training for SARSA on 10 x 10 Board";
      if (plotIndex === 5 && boardSize === 3)
        return "Performance Comparison across Algorithims for 3 x 3 Board";
      if (plotIndex === 5 && boardSize === 4)
        return "Performance Comparison across Algorithims for 4 x 4 Board";
      if (plotIndex === 5 && boardSize === 5)
        return "Performance Comparison across Algorithims for 5 x 5 Board";
      if (plotIndex === 5 && boardSize === 6)
        return "Performance Comparison across Algorithims for 6 x 6 Board";
      if (plotIndex === 5 && boardSize === 7)
        return "Performance Comparison across Algorithims for 7 x 7 Board";
      if (plotIndex === 5 && boardSize === 8)
        return "Performance Comparison across Algorithims for 8 x 8 Board";
      if (plotIndex === 5 && boardSize === 9)
        return "Performance Comparison across Algorithims for 9 x 9 Board";
      if (plotIndex === 5 && boardSize === 10)
        return "Performance Comparison across Algorithims for 10 x 10 Board";
    }
    // - Q-LEARNING--------------------------------------------------------///
    if (activeTab === 1 && activeSub === 2) {
      if (plotIndex === 0)
        return "Overall Performance of Q-Learning across Board Sizes";
      if (plotIndex === 1)
        return "Inference Time for Q-Learning across Board Sizes";
      if (plotIndex === 2 && boardSize === 3)
        return "Play Performance against Baseline Opponent on 3 x 3 Board";
      if (plotIndex === 2 && boardSize === 4)
        return "Play Performance against Baseline Opponent on 4 x 4 Board";
      if (plotIndex === 2 && boardSize === 5)
        return "Play Performance against Baseline Opponent on 5 x 5 Board";
      if (plotIndex === 2 && boardSize === 6)
        return "Play Performance against Baseline Opponent on 6 x 6 Board";
      if (plotIndex === 2 && boardSize === 7)
        return "Play Performance against Baseline Opponent on 7 x 7 Board";
      if (plotIndex === 2 && boardSize === 8)
        return "Play Performance against Baseline Opponent on 8 x 8 Board";
      if (plotIndex === 2 && boardSize === 9)
        return "Play Performance against Baseline Opponent on 9 x 9 Board";
      if (plotIndex === 2 && boardSize === 10)
        return "Play Performance against Baseline Opponent on 10 x 10 Board";
      if (plotIndex === 3 && boardSize === 3)
        return "Play Performance against Random Opponent on 3 x 3 Board";
      if (plotIndex === 3 && boardSize === 4)
        return "Play Performance against Random Opponent on 4 x 4 Board";
      if (plotIndex === 3 && boardSize === 5)
        return "Play Performance against Random Opponent on 5 x 5 Board";
      if (plotIndex === 3 && boardSize === 6)
        return "Play Performance against Random Opponent on 6 x 6 Board";
      if (plotIndex === 3 && boardSize === 7)
        return "Play Performance against Random Opponent on 7 x 7 Board";
      if (plotIndex === 3 && boardSize === 8)
        return "Play Performance against Random Opponent on 8 x 8 Board";
      if (plotIndex === 3 && boardSize === 9)
        return "Play Performance against Random Opponent on 9 x 9 Board";
      if (plotIndex === 3 && boardSize === 10)
        return "Play Performance against Random Opponent on 10 x 10 Board";
      if (plotIndex === 4 && boardSize === 3)
        return "Improvement During Training for Q-Learning on 3 x 3 Board";
      if (plotIndex === 4 && boardSize === 4)
        return "Improvement During Training for Q-Learning on 4 x 4 Board";
      if (plotIndex === 4 && boardSize === 5)
        return "Improvement During Training for Q-Learning on 5 x 5 Board";
      if (plotIndex === 4 && boardSize === 6)
        return "Improvement During Training for Q-Learning on 6 x 6 Board";
      if (plotIndex === 4 && boardSize === 7)
        return "Improvement During Training for Q-Learning on 7 x 7 Board";
      if (plotIndex === 4 && boardSize === 8)
        return "Improvement During Training for Q-Learning on 8 x 8 Board";
      if (plotIndex === 4 && boardSize === 9)
        return "Improvement During Training for Q-Learning on 9 x 9 Board";
      if (plotIndex === 4 && boardSize === 10)
        return "Improvement During Training for Q-Learning on 10 x 10 Board";
      if (plotIndex === 5 && boardSize === 3)
        return "Performance Comparison across Algorithims for 3 x 3 Board";
      if (plotIndex === 5 && boardSize === 4)
        return "Performance Comparison across Algorithims for 4 x 4 Board";
      if (plotIndex === 5 && boardSize === 5)
        return "Performance Comparison across Algorithims for 5 x 5 Board";
      if (plotIndex === 5 && boardSize === 6)
        return "Performance Comparison across Algorithims for 6 x 6 Board";
      if (plotIndex === 5 && boardSize === 7)
        return "Performance Comparison across Algorithims for 7 x 7 Board";
      if (plotIndex === 5 && boardSize === 8)
        return "Performance Comparison across Algorithims for 8 x 8 Board";
      if (plotIndex === 5 && boardSize === 9)
        return "Performance Comparison across Algorithims for 9 x 9 Board";
      if (plotIndex === 5 && boardSize === 10)
        return "Performance Comparison across Algorithims for 10 x 10 Board";
    }
    // - DQN--------------------------------------------------------///
    if (activeTab === 2 && activeSub === 0) {
      if (plotIndex === 0)
        return "Overall Performance of DQN across Board Sizes";
      if (plotIndex === 1) return "Inference Time for DQN across Board Sizes";
      if (plotIndex === 2 && boardSize === 3)
        return "Play Performance against Baseline Opponent on 3 x 3 Board";
      if (plotIndex === 2 && boardSize === 4)
        return "Play Performance against Baseline Opponent on 4 x 4 Board";
      if (plotIndex === 2 && boardSize === 5)
        return "Play Performance against Baseline Opponent on 5 x 5 Board";
      if (plotIndex === 2 && boardSize === 6)
        return "Play Performance against Baseline Opponent on 6 x 6 Board";
      if (plotIndex === 2 && boardSize === 7)
        return "Play Performance against Baseline Opponent on 7 x 7 Board";
      if (plotIndex === 2 && boardSize === 8)
        return "Play Performance against Baseline Opponent on 8 x 8 Board";
      if (plotIndex === 2 && boardSize === 9)
        return "Play Performance against Baseline Opponent on 9 x 9 Board";
      if (plotIndex === 2 && boardSize === 10)
        return "Play Performance against Baseline Opponent on 10 x 10 Board";
      if (plotIndex === 3 && boardSize === 3)
        return "Play Performance against Random Opponent on 3 x 3 Board";
      if (plotIndex === 3 && boardSize === 4)
        return "Play Performance against Random Opponent on 4 x 4 Board";
      if (plotIndex === 3 && boardSize === 5)
        return "Play Performance against Random Opponent on 5 x 5 Board";
      if (plotIndex === 3 && boardSize === 6)
        return "Play Performance against Random Opponent on 6 x 6 Board";
      if (plotIndex === 3 && boardSize === 7)
        return "Play Performance against Random Opponent on 7 x 7 Board";
      if (plotIndex === 3 && boardSize === 8)
        return "Play Performance against Random Opponent on 8 x 8 Board";
      if (plotIndex === 3 && boardSize === 9)
        return "Play Performance against Random Opponent on 9 x 9 Board";
      if (plotIndex === 3 && boardSize === 10)
        return "Play Performance against Random Opponent on 10 x 10 Board";
      if (plotIndex === 4 && boardSize === 3)
        return "Improvement During Training for DQN on 3 x 3 Board";
      if (plotIndex === 4 && boardSize === 4)
        return "Improvement During Training for DQN on 4 x 4 Board";
      if (plotIndex === 4 && boardSize === 5)
        return "Improvement During Training for DQN on 5 x 5 Board";
      if (plotIndex === 4 && boardSize === 6)
        return "Improvement During Training for DQN on 6 x 6 Board";
      if (plotIndex === 4 && boardSize === 7)
        return "Improvement During Training for DQN on 7 x 7 Board";
      if (plotIndex === 4 && boardSize === 8)
        return "Improvement During Training for DQN on 8 x 8 Board";
      if (plotIndex === 4 && boardSize === 9)
        return "Improvement During Training for DQN on 9 x 9 Board";
      if (plotIndex === 4 && boardSize === 10)
        return "Improvement During Training for DQN on 10 x 10 Board";
      if (plotIndex === 5 && boardSize === 3)
        return "Performance Comparison across Algorithims for 3 x 3 Board";
      if (plotIndex === 5 && boardSize === 4)
        return "Performance Comparison across Algorithims for 4 x 4 Board";
      if (plotIndex === 5 && boardSize === 5)
        return "Performance Comparison across Algorithims for 5 x 5 Board";
      if (plotIndex === 5 && boardSize === 6)
        return "Performance Comparison across Algorithims for 6 x 6 Board";
      if (plotIndex === 5 && boardSize === 7)
        return "Performance Comparison across Algorithims for 7 x 7 Board";
      if (plotIndex === 5 && boardSize === 8)
        return "Performance Comparison across Algorithims for 8 x 8 Board";
      if (plotIndex === 5 && boardSize === 9)
        return "Performance Comparison across Algorithims for 9 x 9 Board";
      if (plotIndex === 5 && boardSize === 10)
        return "Performance Comparison across Algorithims for 10 x 10 Board";
    }
    return `Plot ${plotIndex + 1}`;
  };

  const getChartOptions = (plotIndex) => {
    // For real data plots, show legend
    /// ----------------  VALUE ITERATION and POLICY ITERATION ---------------------------------//
    if (activeTab === 0 && plotIndex === 0) {
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
              text: "Board Size (n)",
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
    if (activeTab === 0 && plotIndex === 1) {
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
              text: "Board Size (n)",
            },
          },
          y: {
            grid: { color: "#eee" },
            title: {
              display: true,
              text: "T(n)",
            },
            min: 0,
            max: 2,
            ticks: {
              display: false, // hide y-axis numbers
            },
          },
        },
      };
    }
    if ((activeTab === 0 && plotIndex === 2) || plotIndex === 3) {
      return {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
      };
    }
    if (activeTab === 0 && plotIndex === 4) {
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
    if (activeTab === 0 && plotIndex === 5) {
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
              text: "Algorithims",
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
    /// ----------------  MODEL- FREE (MC, SARSA, QL)  ---------------------------------//
    if (
      (activeTab === 1 && plotIndex === 0) ||
      (activeTab === 2 && plotIndex === 0)
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
              text: "Board Size (n)",
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
      (activeTab === 1 && plotIndex === 1) ||
      (activeTab === 2 && plotIndex === 1)
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
              text: "Board Size (n)",
            },
          },
          y: {
            grid: { color: "#eee" },
            title: {
              display: true,
              text: "T(n)",
            },
            min: 0,
            max: 2,
            ticks: {
              display: false, // hide y-axis numbers
            },
          },
        },
      };
    }
    if (
      (activeTab === 1 && plotIndex === 2) ||
      (activeTab === 2 && plotIndex === 2)
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
      };
    }
    if (
      (activeTab === 1 && plotIndex === 3) ||
      (activeTab === 2 && plotIndex === 3)
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
              text: "Number of Games Played",
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
    if (activeTab === 1 && plotIndex === 4) {
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
              text: "Number of Training Episodes Completed",
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
    if (activeTab === 2 && plotIndex === 4) {
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
              text: "Iterations",
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
      (activeTab === 1 && plotIndex === 5) ||
      (activeTab === 2 && plotIndex === 5)
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
              text: "Algorithims",
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
        {activeSub !== null && !(activeTab === 2 && activeSub === 1) && (
          <div className="sub-content">
            <p>{currentTab.subItems[activeSub].content}</p>

            {/* Board Size Selector */}

            {/* <div className="board-size-select">
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
            </div> */}

            <div className="plots-and-faq">
              {/* 4-PLOT GRID */}
              <div className="plots-grid">
                <div
                  className={`plot-card ${
                    highlightPlot === 0 ? "highlight" : ""
                  }`}
                  key={0}
                >
                  <h4>{getPlotTitle(0)}</h4>
                  <Line data={getPlotData(0)} options={getChartOptions(0)} />
                </div>
                <div
                  className={`plot-card ${
                    highlightPlot === 1 ? "highlight" : ""
                  }`}
                  key={1}
                >
                  <h4>{getPlotTitle(1)}</h4>
                  <Line data={getPlotData(1)} options={getChartOptions(1)} />
                </div>
                <div className="board-size-select">
                  <label>
                    Board Size
                    <select
                      value={boardSize}
                      onChange={(e) => setBoardSize(Number(e.target.value))}
                    >
                      {Array.from(
                        {
                          length:
                            activeTab === 0
                              ? activeSub === 1
                                ? 1
                                : 1 // 3×3 only OR 3×3–4×4
                              : 8, // otherwise 3×3–10×10
                        },
                        (_, i) => i + 3
                      ).map((size) => (
                        <option key={size} value={size}>
                          {size} × {size}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="board-size-select">
                  <p></p>
                </div>
                <div
                  className={`plot-card ${
                    highlightPlot === 4 ? "highlight" : ""
                  }`}
                  key={4}
                >
                  <h4>{getPlotTitle(4)}</h4>
                  <Line data={getPlotData(4)} options={getChartOptions(4)} />
                </div>
                <div
                  className={`plot-card ${
                    highlightPlot === 5 ? "highlight" : ""
                  }`}
                  key={5}
                >
                  <h4>{getPlotTitle(5)}</h4>
                  <Bar data={getPlotData(5)} options={getChartOptions(5)} />
                </div>
                <div
                  className={`plot-card ${
                    highlightPlot === 2 ? "highlight" : ""
                  }`}
                  key={2}
                >
                  <h4>{getPlotTitle(2)}</h4>
                  <div
                    style={{
                      width: "400px",
                      height: "400px",
                      margin: "0 auto",
                    }}
                  >
                    <Pie data={getPlotData(2)} options={getChartOptions(2)} />
                  </div>
                </div>
              </div>

              {/* FAQ BOX */}
              <FAQBox onSelectPlot={setHighlightPlot} />
            </div>
          </div>
        )}

        {activeTab === 2 && activeSub === 1 && (
          <div className="sub-content">
            <p>{currentTab.subItems[activeSub].content}</p>
          </div>
        )}
      </div>
    </section>
  );
}
