import React from 'react';

const MCQQuiz = ({ options, answer, selectedOption, onOptionClick }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          className={`p-4 text-white font-medium rounded-md transition-colors duration-300 ${
            selectedOption === option
              ? option === answer
                ? 'bg-green-500'
                : 'bg-red-500'
              : 'bg-gray-800'
          }`}
          onClick={() => onOptionClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MCQQuiz;