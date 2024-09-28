import React, { useState } from 'react';
import styles from './ChatContainer.module.css';
import MessageList from './MessageList';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the user's message to the chat
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    try {
      // Simulate an HTTP request to the backend server
      const response = await fetch('https://your-backend-server.com/get-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: input }),
      });

      const quizData = await response.json();

      // Add the quiz question to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: quizData.Question,
          sender: 'bot',
          type: quizData.Type,
          options: quizData.Options,
          correctAnswer: quizData.CorrectAnswer,
        },
      ]);
     


    } catch (error) {
      console.error('Error fetching quiz:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: "What is the capital of France?",
          sender: 'bot',
          type: "Written",
          options: ["Paris", "London", "Berlin", "Madrid"],
          correctAnswer: "Paris",
        },
      ]);
    }
  };

  return (
    <div className={styles.chatbot}>
      <MessageList messages={messages} />
      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.chatInput}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
}

export default ChatContainer;