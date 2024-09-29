import React, { useState } from 'react';
import styles from './ChatContainer.module.css';
import MessageList from './MessageList';

function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [writtenAnswer, setWrittenAnswer] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

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
        body: JSON.stringify({ userMessage: input, course: selectedCourse }),
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
    <div className={styles.chatbot}>
      <MessageList
        messages={messages}
        writtenAnswer={writtenAnswer}
        setWrittenAnswer={setWrittenAnswer}
        handleWrittenAnswerSubmit={handleWrittenAnswerSubmit}
      />
      <div className={styles.inputContainer}>
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
    </div>
  );
}

export default ChatContainer;