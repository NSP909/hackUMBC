import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';

function LandingPage() {
  const [inputValue, setInputValue] = useState('');
  const [inputHeight, setInputHeight] = useState('auto');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/chatbot?input=${encodeURIComponent(inputValue)}`);
  };

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleBoxClick = () => {
    document.getElementById('searchInput').focus(); 
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setInputHeight('auto');
    setInputHeight(`${e.target.scrollHeight}px`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      navigate(`/chatbot?input=${encodeURIComponent(inputValue)}`);
    }
  };

  useEffect(() => {
    const input = document.getElementById('searchInput');
    input.style.caretColor = 'transparent';
    input.addEventListener('focus', () => {
      input.style.caretColor = '#fff';
    });
    input.addEventListener('blur', () => {
      input.style.caretColor = 'transparent';
    });
  }, []);

  return (
    <div className={styles.landingPage}>
      <h1 className={styles.title}>Hi User</h1>
      <div className={styles.searchContainer} onClick={handleBoxClick}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            id="searchInput"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown} 
            placeholder="Type to search..."
            className={styles.input}
            style={{ height: inputHeight }} 
          />
        </form>
      </div>

      <div className={styles.buttons}>
        <button className={styles.button} color="grey" variant="faded" onClick={() => handleButtonClick('/dashboard')}>
          Dashboard
        </button>
        <button className={styles.button} color="grey" variant="faded" onClick={() => handleButtonClick('/chatbot')}>
          Chat
        </button>
        <button className={styles.button} color="grey" variant="faded" onClick={() => handleButtonClick('/study')}>
          Study
        </button>
      </div>
      
    </div>
  );
}

export default LandingPage;
