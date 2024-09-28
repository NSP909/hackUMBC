import React, { useState } from 'react';
import './Chatbot.module.css';

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
    <div className="chatbot">
      <div className="message-history">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;