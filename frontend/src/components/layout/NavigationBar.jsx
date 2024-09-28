import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NavigationBar.module.css';

function NavigationBar() {
  return (
    <nav className={styles.navigationBar}>
      <Link to="/" className={styles.logo}>LMS Copilot</Link>
      <div className={styles.userProfile}>
        <img src="/path-to-user-avatar.jpg" alt="User Avatar" />
      </div>
    </nav>
  );
}

export default NavigationBar;