import { useState } from 'react';
import styles from './FAQ.module.css';

export default function FAQ() {
  const faqs = [
    {
      question: "What is human ethics?",
      answer: "It refers to the principles guiding morally responsible research involving humans.",
    },
    {
      question: "What is informed consent?",
      answer: "It's the process where participants are fully informed and voluntarily agree to be part of research.",
    },
    {
      question: "Why is plagiarism bad?",
      answer: "Because it violates research integrity and disrespects original work.",
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className={styles.container}>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <button onClick={() => toggleFAQ(index)} className={`${styles.question} ${openIndex === index ? styles.questionOpen : ''}`}>
            {faq.question}
          </button>
          <div className={`${styles.answerWrapper} ${openIndex === index ? styles.open : ''}`}>
            <p className={styles.answerText}>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}