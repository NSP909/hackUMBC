import React from 'react';
import styles from './MCQQuiz.module.css';

const MCQQuiz = ({ options, onSubmit }) => {
  return (
    <div className={styles.mcqQuiz}>
      {options.map((option, index) => (
        <button key={index} onClick={onSubmit}>
          {option}
        </button>
      ))}
    </div>
  );
};

export default MCQQuiz;