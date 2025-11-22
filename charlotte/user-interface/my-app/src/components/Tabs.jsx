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
          name: "Q-Learning",
          content:
            "Q-Learning is an off-policy algorithm that updates action values based on maximum expected future rewards.",
        },
        {
          name: "SARSA",
          content:
            "SARSA is an on-policy algorithm that updates action values based on actual experience.",
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
          name: "Policy Gradient",
          content:
            "Policy gradient methods optimize the policy directly using gradients of expected rewards.",
        },
      ],
    },
  ];

  const currentTab = tabs[activeTab];

  const dummyData = (i) => ({
    labels: ["A", "B", "C", "D", "E"],
    datasets: [
      {
        label: `Plot ${i + 1}`,
        data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)),
        borderColor: "#b41f1f",
        backgroundColor: "rgba(180, 31, 31, 0.1)",
        tension: 0.3,
      },
    ],
  });

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

            <div className="plots-grid">
              {[...Array(6)].map((_, i) => (
                <div className="plot-card" key={i}>
                  <h4>Plot {i + 1}</h4>
                  <Line
                    data={dummyData(i)}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { grid: { display: false } },
                        y: { grid: { color: "#eee" } },
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
