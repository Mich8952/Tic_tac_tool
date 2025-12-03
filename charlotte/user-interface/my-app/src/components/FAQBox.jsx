import { useState } from "react";

export default function FAQBox() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question:
        "How does the win rate with respect to BL change during training across algorithims and board sizes?",
      answer: "The meaning of life varies by beliefs and experiences.",
    },
    {
      question:
        "Is there a big drop in win rate during play when we go from axa to bxb?",
      answer: "ChatGPT is an AI model trained on large datasets.",
    },
    {
      question:
        "How does the win rate with respect to BL change during play across algorithims and board sizes?",
      answer: "Weather depends on your location — check a weather app.",
    },
    {
      question: "Why does this algorithim only support board sizes up to axa?",
      answer: "Practice regularly, build projects, and read others’ code.",
    },
    {
      question:
        "At what board size does the algorithm stop winning during play?",
      answer: "Paris.",
    },
    {
      question:
        "After how many iterations does the algorithm with respect to baseline win during training? ",
      answer: "Paris.",
    },
    {
      question:
        "What is the inference time for each algorithim, across board sizes?",
      answer: "Paris.",
    },
    {
      question: "For a given board size, which algorithim is best?",
      answer: "Paris.",
    },
  ];

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="faq-ui-container">
      <h3 className="faq-title-header">Questions</h3>

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
