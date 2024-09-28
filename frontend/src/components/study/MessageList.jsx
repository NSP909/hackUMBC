import React from 'react';
import styles from './MessageList.module.css';

function MessageList({ messages }) {
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
        </div>
      ))}
    </div>
  );
}

export default MessageList;