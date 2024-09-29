import React from 'react';
import MCQQuiz from './MCQQuiz';
import styles from './QuestionPanel.module.css';

const QuestionPanel = ({ question, answer, onChange, onSubmit, showNextButton, onNextQuestion }) => {
  return (
    <div className={styles.questionPanel}>
      <h3>{question.question}</h3>
      {question.type === 'Written' ? (
        <div className={styles.writtenQuiz}>
          <input
            type="text"
            value={answer}
            onChange={onChange}
            placeholder="Your answer"
          />
          <button onClick={onSubmit}>Submit</button>
        </div>
      ) : (
        <MCQQuiz options={question.options} onSubmit={onSubmit} />
      )}
      {showNextButton && (
        <button className={styles.nextButton} onClick={onNextQuestion}>
          <span className={styles.arrowIcon}>&#8594;</span>
        </button>
      )}
    </div>
  );
};

export default QuestionPanel;