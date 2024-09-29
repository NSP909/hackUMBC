import React, { useState } from 'react';
import MCQQuiz from './MCQQuiz';
import leftArrow from '../../assets/left-arrow.svg';
import rightArrow from '../../assets/right-arrow.svg';

const QuestionPanel = ({ question, answer, onChange, onSubmit, showNextButton, onNextQuestion, onPreviousQuestion, currentQuestionIndex, totalQuestions, isFinalQuestionAnswered }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center h-3/5 w-3/5 bg-white p-5 rounded-3xl shadow-lg relative ">
      <h3 className="text-2xl mb-5 text-blue-900">{question.text}</h3>
      {question.type === 'Written' ? (
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={answer}
            onChange={onChange}
            placeholder="Your answer"
            className="p-2 mb-2 w-4/5 border border-gray-300 rounded-md"
          />
          <button onClick={onSubmit} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-300">
            Submit
          </button>
        </div>
      ) : (
        <MCQQuiz
          options={question.options}
          answer={question.answer}
          selectedOption={selectedOption}
          onOptionClick={handleOptionClick}
        />
      )}
      <div className="flex justify-between items-center w-2/5 absolute bottom-2">
        <button
          className={`p-2 bg-blue-500 text-white rounded-md shadow-md transition-colors duration-300 ${
            currentQuestionIndex === 0 ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'hover:bg-blue-600'
          }`}
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <img src={leftArrow} alt="Previous" className="w-5 h-5" />
        </button>
        <div className="text-lg text-blue-900">{currentQuestionIndex + 1} / {totalQuestions}</div>
        <button
          className={`p-2 bg-blue-500 text-white rounded-md shadow-md transition-colors duration-300 ${
            !isFinalQuestionAnswered ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'hover:bg-blue-600'
          }`}
          onClick={onNextQuestion}
          disabled={!isFinalQuestionAnswered}
        >
          <img src={rightArrow} alt="Next" className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default QuestionPanel;