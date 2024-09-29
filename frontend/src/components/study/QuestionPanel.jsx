import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const QuestionPanel = ({
  type,
  difficulty,
  question,
  writtenAnswer,
  mcqSelectedOption,
  onWrittenAnswerChange,
  onMcqOptionSelect,
  onSubmit,
  showNextButton,
  onNextQuestion,
  onPreviousQuestion,
  currentQuestionIndex,
  totalQuestions,
  isFinalQuestionAnswered,
  isLoading,
  feedback
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
        {question.Question}
      </h3>
      <p className="text-white text-center mb-4">Difficulty: {difficulty}</p>
      
      {type === 'Written' ? (
        <div className="mb-6">
          <textarea
            value={writtenAnswer}
            onChange={onWrittenAnswerChange}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-white bg-opacity-30 text-white placeholder-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {question.Options && question.Options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: mcqSelectedOption ? 1 : 1.02 }}
              whileTap={{ scale: mcqSelectedOption ? 1 : 0.98 }}
              className={`
                flex flex-col justify-center items-center
                p-4 text-white font-medium rounded-lg shadow-md
                transition-all duration-300 ease-in-out
                min-h-[100px] w-full
                ${
                  mcqSelectedOption === option
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                }
                ${mcqSelectedOption ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => !mcqSelectedOption && onMcqOptionSelect(option)}
              disabled={mcqSelectedOption !== null}
            >
              <span className="text-center text-lg">{option}</span>
            </motion.button>
          ))}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSubmit}
        disabled={isLoading || (type === 'MCQ' && !mcqSelectedOption) || (type === 'Written' && !writtenAnswer.trim())}
        className={`mt-4 px-6 py-2 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-md hover:from-green-500 hover:to-blue-600 transition-all duration-300 ${(isLoading || (type === 'MCQ' && !mcqSelectedOption) || (type === 'Written' && !writtenAnswer.trim())) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Checking...' : 'Submit'}
      </motion.button>

      {feedback && (
        <div className={`mt-4 p-3 rounded-md ${feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
          {feedback.message}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-full ${
            currentQuestionIndex === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={onPreviousQuestion}
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
            !showNextButton ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={onNextQuestion}
          disabled={!showNextButton}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </div>
  );
};

export default QuestionPanel;