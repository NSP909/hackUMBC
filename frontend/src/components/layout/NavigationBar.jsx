import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav className="navigation-bar">
      <Link to="/" className="logo">LMS Copilot</Link>
      <div className="user-profile">
        <img src="/path-to-user-avatar.jpg" alt="User Avatar" />
      </div>
    </nav>
  );
}

export default NavigationBar;