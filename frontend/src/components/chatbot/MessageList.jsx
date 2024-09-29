import React, { useState } from 'react';
import styles from './MessageList.module.css';

function MessageList({ messages, writtenAnswer, setWrittenAnswer, handleWrittenAnswerSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (messageIndex, option) => {
    const message = messages[messageIndex];
    if (message.type === 'MCQ') {
      setSelectedOption({ messageIndex, option });
    }
  };

  return (
    <div className={styles.messageHistory}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.message} ${message.sender === 'user' ? styles.user : styles.bot}`}>
          {message.text}
          {message.type === 'MCQ' && (
            <div className={styles.options}>
              {message.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`${styles.option} ${
                    selectedOption?.messageIndex === index && selectedOption?.option === option
                      ? option === message.answer
                        ? styles.correct
                        : styles.incorrect
                      : ''
                  }`}
                  onClick={() => handleOptionClick(index, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
          {message.type === 'Written' && (
            <div className={styles.writtenAnswerForm}>
              <input
                type="text"
                value={writtenAnswer}
                onChange={(e) => setWrittenAnswer(e.target.value)}
                placeholder="Type your answer..."
                className={styles.writtenAnswerInput}
              />
              <button
                onClick={() => handleWrittenAnswerSubmit(index)}
                className={styles.answerButton}
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