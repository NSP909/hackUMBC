import React from 'react';
import styles from './MCQQuiz.module.css';

const MCQQuiz = ({ options, answer, selectedOption, onOptionClick }) => {
  return (
    <div className={styles.mcqQuiz}>
      {options.map((option, index) => (
        <button
          key={index}
          className={`${styles.optionButton} ${selectedOption === option ? (option === answer ? styles.correct : styles.incorrect) : ''}`}
          onClick={() => onOptionClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MCQQuiz;