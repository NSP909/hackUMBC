import React, { useState } from 'react';
import { motion } from 'framer-motion';

function MessageList({ messages, writtenAnswer, setWrittenAnswer, handleWrittenAnswerSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (messageIndex, option) => {
    const message = messages[messageIndex];
    if (message.type === 'MCQ') {
      setSelectedOption({ messageIndex, option });
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          variants={messageVariants}
          initial="hidden"
          animate="visible"
          className={`mb-4 p-4 rounded-lg max-w-[80%] ${
            message.sender === 'user'
              ? 'bg-blue-600 text-white self-end'
              : 'bg-[#393937] bg-opacity-80 text-white self-start'
          }`}
        >
          <div className="break-words">{message.text}</div>
          {message.type === 'MCQ' && (
            <div className="mt-4 flex flex-col space-y-2">
              {message.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`p-2 rounded-md cursor-pointer transition-colors ${
                    selectedOption?.messageIndex === index && selectedOption?.option === option
                      ? option === message.correctAnswer
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => handleOptionClick(index, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {message.type === 'Written' && (
            <div className="mt-4 flex flex-col space-y-2">
              <input
                type="text"
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => handleWrittenAnswerSubmit(index)}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default MessageList;