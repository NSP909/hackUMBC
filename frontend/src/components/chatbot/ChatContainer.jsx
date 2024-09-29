import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageEndRef = useRef(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageToSend = input.trim();
    if (!messageToSend) return;

    // Add the user's message to the chat
    setMessages([...messages, { text: messageToSend, sender: 'user' }]);
    setInput('');

    try {
      // Simulate an HTTP request to the backend server
      const response = await fetch(`http://161.35.127.128:5000/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: messageToSend }),
      });

      const botResponse = await response.json();
      console.log(botResponse);
      // Add the bot's response to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: botResponse[botResponse.length - 1], sender: 'bot' },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, there was an error processing your request.', sender: 'bot' },
      ]);
    }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -50, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 overflow-hidden">
      <div className="flex-grow overflow-auto p-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div 
                className={`p-4 rounded-lg max-w-[80%] ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#393937] bg-opacity-80 text-white'
                }`}
              >
                <div className="break-words">{message.text}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messageEndRef} />
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center bg-white bg-opacity-20 rounded-full p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            outline="none"
            className="flex-grow bg-transparent text-white placeholder-gray-300 focus:outline-none px-4 border-transparent focus:ring-0"
            style={{ border: 'none' }}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 bg-white text-indigo-600 rounded-full p-2 hover:bg-opacity-90 transition-colors"
          >
            <Send size={24} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;