import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MCQQuiz from './MCQQuiz';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionPanel = ({ type, question, answer, onChange, onSubmit, showNextButton, onNextQuestion, onPreviousQuestion, currentQuestionIndex, totalQuestions, isFinalQuestionAnswered }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSubmit();
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    onNextQuestion();
  };

  const handlePreviousQuestion = () => {
    setSelectedOption(null);
    onPreviousQuestion();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">{question.Question}</h3>
      
      {type === 'Written' ? (
        <div className="mb-6">
          <textarea
            value={answer}
            onChange={onChange}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-white bg-opacity-30 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSubmit}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-md hover:from-green-500 hover:to-blue-600 transition-all duration-300"
          >
            Submit
          </motion.button>
        </div>
      ) : (
        <MCQQuiz
          options={question.Options}
          answer={question.Answer}
          selectedOption={selectedOption}
          onOptionClick={handleOptionClick}
        />
      )}
      
      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${
            currentQuestionIndex === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
        
        <div className="text-lg text-white font-semibold">
          {currentQuestionIndex + 1} / {totalQuestions}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${
            !isFinalQuestionAnswered ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={handleNextQuestion}
          disabled={!isFinalQuestionAnswered}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default QuestionPanel;