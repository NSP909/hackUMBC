import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MessageList from './MessageList';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
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
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <MessageList
        messages={messages}
        writtenAnswer={writtenAnswer}
        setWrittenAnswer={setWrittenAnswer}
        handleWrittenAnswerSubmit={handleWrittenAnswerSubmit}
      />
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