// src/components/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@nextui-org/react"; // Importing Next UI Button
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

  const handleBoxClick = () => {
    document.getElementById('searchInput').focus(); // Focus the input when the box is clicked
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.searchContainer} onClick={handleBoxClick}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            id="searchInput"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type to search..."
            className={styles.input}
          />
        </form>
      </div>

      <div className={styles.buttons}>
        <Button color="grey" variant="faded" onClick={() => handleButtonClick('/dashboard')}>
          Dashboard
        </Button>
        <Button color="grey" variant="faded" onClick={() => handleButtonClick('/chatbot')}>
          Chat
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;
