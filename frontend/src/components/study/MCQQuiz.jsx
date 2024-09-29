import React from 'react';
import { motion } from 'framer-motion';

const MCQQuiz = ({ options, answer, selectedOption, onOptionClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex flex-col justify-center items-center
            p-4 text-white font-medium rounded-lg shadow-md
            transition-all duration-300 ease-in-out
            min-h-[100px] w-full
            ${
              selectedOption === option
                ? option === answer
                  ? 'bg-gradient-to-r from-green-400 to-green-600'
                  : 'bg-gradient-to-r from-red-400 to-red-600'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
            }
          `}
          onClick={() => onOptionClick(option)}
        >
          <span className="text-center text-lg">{option}</span>
          {selectedOption === option && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                mt-2 text-sm
                ${option === answer ? 'text-green-200' : 'text-red-200'}
              `}
            >
              {option === answer ? 'Correct!' : 'Incorrect'}
            </motion.span>
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default MCQQuiz;