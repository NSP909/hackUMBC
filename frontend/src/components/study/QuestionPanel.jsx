import React, { useState } from 'react';
import MCQQuiz from './MCQQuiz';
import styles from './QuestionPanel.module.css';
import leftArrow from '../../assets/left-arrow.svg';
import rightArrow from '../../assets/right-arrow.svg';

const QuestionPanel = ({ question, answer, onChange, onSubmit, showNextButton, onNextQuestion, onPreviousQuestion, currentQuestionIndex, totalQuestions, isFinalQuestionAnswered }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSubmit();
  };

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
        <MCQQuiz
          options={question.options}
          answer={question.answer}
          selectedOption={selectedOption}
          onOptionClick={handleOptionClick}
        />
      )}
      <div className={styles.navigationBar}>
        <button className={styles.arrowButton} onClick={onPreviousQuestion} disabled={currentQuestionIndex === 0}>
          <img src={leftArrow} alt="Previous" className={styles.arrowIcon} />
        </button>
        <div className={styles.questionIndex}>
          {currentQuestionIndex + 1} / {totalQuestions}
        </div>
        <button className={styles.arrowButton} onClick={onNextQuestion} disabled={!isFinalQuestionAnswered}>
          <img src={rightArrow} alt="Next" className={styles.arrowIcon} />
        </button>
      </div>
    </div>
  );
};

export default QuestionPanel;