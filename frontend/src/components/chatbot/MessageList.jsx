import React, { useState } from 'react';

function MessageList({ messages, writtenAnswer, setWrittenAnswer, handleWrittenAnswerSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (messageIndex, option) => {
    const message = messages[messageIndex];
    if (message.type === 'MCQ') {
      setSelectedOption({ messageIndex, option });
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-2 p-3 rounded-lg max-w-xs ${
            message.sender === 'user'
              ? 'bg-gray-800 text-white self-end rounded-br-none'
              : 'bg-gray-100 text-gray-800 self-start rounded-bl-none'
          }`}
        >
          <div className="break-words">
            {message.text}
          </div>
          {message.type === 'MCQ' && (
            <div className="mt-2 flex flex-col">
              {message.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`p-2 mb-1 border rounded-md cursor-pointer ${
                    selectedOption?.messageIndex === index && selectedOption?.option === option
                      ? option === message.answer
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleOptionClick(index, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {message.type === 'Written' && (
            <div className="mt-2 flex">
              <input
                type="text"
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 p-2 border rounded-md mr-2"
              />
              <button
                onClick={() => handleWrittenAnswerSubmit(index)}
                className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageList;