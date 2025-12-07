import { useState } from "react";

export default function FAQBox({ onSelectPlot }) {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "Is there a big drop in win rate during play with this algorithm when we go from one board size to another?",
      // answer: "Observe how the green line changes in the highlighted plot.",
      plot: 0,
    },
    {
      question:
        "How does the win rate improve during training for a specific board size?",
      // answer: "The meaning of life varies by beliefs and experiences.",
      plot: 4,
    },
    {
      question: "Up to what board size does the algorithm support?",
      // answer:
      //   "See if there is a lack of data for a certain board size in the highlighted plot.",
      plot: 0,
    },
    {
      question:
        "How does the algorithm perform against the baseline at this board size?",
      // answer: "Observe how the green line changes in the highlighted plot.",
      plot: 2,
    },

    {
      question:
        "At what board size does the algorithm stop winning during play?",
      // answer: "Paris.",
      plot: 0,
    },
    {
      question:
        "What is the inference time for the algorithm, across board sizes?",
      // answer: "Paris.",
      plot: 1,
    },

    {
      question:
        "After how many iterations does the algorithm start to win during training? ",
      // answer: "Paris.",
      plot: 4,
    },

    {
      question: "For a given board size, which algorithm is best?",
      // answer: "Paris.",
      plot: 5,
    },

    {
      question:
        "How does the win rate with respect to baseline change during play across algorithms?",
      // answer: "Weather depends on your location — check a weather app.",
      plot: 5,
    },
  ];

  const toggle = (i) => {
    const newIndex = openIndex === i ? null : i;
    setOpenIndex(newIndex);

    if (newIndex !== null) {
      onSelectPlot(faqs[newIndex].plot);
    }
  };

  return (
    <div className="faq-ui-container">
      <h3 className="faq-title-header">Explore</h3>

      <div className="faq-scroll">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${openIndex === i ? "open" : ""}`}
            onClick={() => toggle(i)}
          >
            <div className="faq-q">{faq.question}</div>
            <div className="faq-a">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
