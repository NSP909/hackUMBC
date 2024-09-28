import React, { useState } from 'react';
import styles from './ChatBot.module.css';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    // Simulating a response from the chatbot
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: 'This is a sample response.', sender: 'bot' }]);
    }, 1000);
  };

  return (
    <div className={styles.chatbot}>
      <div className={styles.messageHistory}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.sender]}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.chatButton}>Send</button>
      </form>
    </div>
  );

}

export default Chatbot;