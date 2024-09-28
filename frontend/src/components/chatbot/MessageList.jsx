import React from 'react';
import styles from './MessageList.module.css';

function MessageList({ messages, writtenAnswer, setWrittenAnswer, handleWrittenAnswerSubmit }) {
  return (
    <div className={styles.messageHistory}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.message} ${styles[message.sender]}`}>
          {message.text}
          {message.type === 'MCQ' && (
            <div className={styles.options}>
              {message.options.map((option, idx) => (
                <div key={idx} className={styles.option}>
                  {option}
                </div>
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
                onKeyPress={(e) => e.key === 'Enter' && handleWrittenAnswerSubmit(index)}
              />
              <button
                onClick={() => handleWrittenAnswerSubmit(index)}
                className={styles.answerButton}
              >
                Answer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageList;