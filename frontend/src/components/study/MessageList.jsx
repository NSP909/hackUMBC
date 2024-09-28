import React from 'react';
import styles from './MessageList.module.css';

function MessageList({ messages }) {
  return (
    <div className={styles.messageHistory}>
      {messages.map((message, index) => (
        <div key={index} className={`${styles.message} ${styles[message.sender]}`}>
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default MessageList;