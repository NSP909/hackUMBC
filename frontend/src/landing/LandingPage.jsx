// src/components/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

function LandingPage() {
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/chatbot');
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.landingPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={styles.input}
          placeholder="Enter something..."
        />
        <button type="submit" className={styles.submitButton}>Submit</button>
      </form>
      <div className={styles.buttons}>
        <button onClick={() => handleButtonClick('/dashboard')} className={styles.button}>Study</button>
        <button onClick={() => handleButtonClick('/dashboard')} className={styles.button}>Dashboard</button>
        <button onClick={() => handleButtonClick('/chatbot')} className={styles.button}>Chat</button>
      </div>
    </div>
  );
}

export default LandingPage;