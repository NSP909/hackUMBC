import React from 'react';
import MCQQuiz from './MCQQuiz';
import styles from './QuestionPanel.module.css';

const QuestionPanel = ({ question, answer, onChange, onSubmit, showNextButton, onNextQuestion, onPreviousQuestion, currentQuestionIndex, totalQuestions, isFinalQuestionAnswered }) => {
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
      <div className={styles.navigationBar}>
        <button className={styles.arrowButton} onClick={onPreviousQuestion} disabled={currentQuestionIndex === 0}>
          <span className={styles.arrowIcon}>&#8592;</span>
        </button>
        <div className={styles.questionIndex}>
          {currentQuestionIndex + 1} / {totalQuestions}
        </div>
        <button className={styles.arrowButton} onClick={onNextQuestion} disabled={!isFinalQuestionAnswered}>
          <span className={styles.arrowIcon}>&#8594;</span>
        </button>
      </div>
    </div>
  );
};

export default QuestionPanel;