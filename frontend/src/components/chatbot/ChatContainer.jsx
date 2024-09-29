import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MessageList from './MessageList';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const location = useLocation();
  const [initialMessageSent, setInitialMessageSent] = useState(false); // Flag to prevent multiple submissions

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inputValue = searchParams.get('input');
    if (inputValue && !initialMessageSent) {
      setInput(inputValue);
      handleInitialSubmit(inputValue); // Call a separate function for initial submission
      setInitialMessageSent(true); // Set the flag to true after the initial message is sent
    }
  }, [location.search, initialMessageSent]);

  const handleInitialSubmit = async (initialInput) => {
    const messageToSend = initialInput.trim();
    if (!messageToSend) return;

    // Add the user's message to the chat
    setMessages([...messages, { text: messageToSend, sender: 'user' }]);
    setInput('');

    try {
      // Simulate an HTTP request to the backend server
      const response = await fetch('https://your-backend-server.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: messageToSend }),
      });

      const chatResponse = await response.json();

      // Add the bot's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: chatResponse.message, sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, there was an error processing your message.', sender: 'bot' },
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageToSend = input.trim();
    if (!messageToSend) return;

    // Add the user's message to the chat
    setMessages([...messages, { text: messageToSend, sender: 'user' }]);
    setInput('');

    try {
      // Simulate an HTTP request to the backend server
      const response = await fetch('https://your-backend-server.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: messageToSend }),
      });

      const chatResponse = await response.json();

      // Add the bot's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: chatResponse.messages[-1], sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, there was an error processing your message.', sender: 'bot' },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <MessageList messages={messages} />
      <div className="flex p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border-none text-lg focus:outline-none"
          />
          <button type="submit" className="p-2 ml-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;