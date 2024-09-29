import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Send } from 'lucide-react';
import MessageList from './MessageList';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const location = useLocation();
  const [initialMessageSent, setInitialMessageSent] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inputValue = searchParams.get('input');
    if (inputValue && !initialMessageSent) {
      setInput(inputValue);
      handleInitialSubmit(inputValue);
      setInitialMessageSent(true);
    }
  }, [location.search, initialMessageSent]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInitialSubmit = async (initialInput) => {
    const messageToSend = initialInput.trim();
    if (!messageToSend) return;

    // Add the user's message to the chat
    setMessages([...messages, { text: messageToSend, sender: 'user' }]);
    setInput('');

    try {
      // Simulate an HTTP request to the backend server
      const response = await fetch('https://your-backend-server.com/get-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: messageToSend, course: selectedCourse }),
      });

      const quizData = await response.json();

      // Add the quiz question to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        {
          text: quizData.text,
          sender: 'bot',
          type: quizData.type,
          options: quizData.options,
          correctAnswer: quizData.answer,
        },
      ]);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'What is the capital of France?',
          sender: 'bot',
          type: 'Written',
          correctAnswer: 'Paris',},
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
      const response = await fetch('https://your-backend-server.com/get-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage: messageToSend, course: selectedCourse }),
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
      const placeHolderQuestion = Math.random() < 0.5
          ? { type: 'Written', text: 'Placeholder question?', answer: 'Placeholder answer' }
          : { type: 'MCQ', text: 'Which of these is a placeholder option?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], answer: 'Option 1' };
      setMessages(prevMessages => [
        ...prevMessages,
        placeHolderQuestion,
      ]);
    }
  };

  const handleWrittenAnswerSubmit = async (messageIndex) => {
    const message = messages[messageIndex];
    if (!writtenAnswer.trim()) return;

    try {
      // Simulate an HTTP request to the backend server with the user's answer
      const response = await fetch('https://your-backend-server.com/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAnswer: writtenAnswer, correctAnswer: message.correctAnswer }),
      });

      const result = await response.json();

      // Add the result to the chat
      setMessages(prevMessages => [
        ...prevMessages,
        { text: result.message, sender: 'bot' },
      ]);

      setWrittenAnswer('');
    } catch (error) {
      //console.error('Error submitting answer:', error);
      setMessages(prevMessages => [
        ...prevMessages,
        { text: 'Sorry, there was an error submitting your answer.', sender: 'bot' },
      ]);

    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 overflow-hidden">
      <div className="flex-grow overflow-auto">
        <MessageList
          messages={messages}
          writtenAnswer={writtenAnswer}
          setWrittenAnswer={setWrittenAnswer}
          handleWrittenAnswerSubmit={handleWrittenAnswerSubmit}
        />
        <div ref={messageEndRef} />
      </div>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-center bg-[#393937] bg-opacity-80 rounded-lg p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          <button type="submit" className="ml-2 text-white hover:text-blue-300 transition-colors">
            <Send size={24} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatContainer;