import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './SideNavigationBar.module.css';

function SideNavigationBar({ isOpen }) {
  const location = useLocation();
  const isCourseDetail = location.pathname.includes('/course/');

  return (
    <nav className={`${styles.sideNavigationBar} ${isOpen ? '' : styles.closed}`}>
      <Link to="/">Course Selector</Link>
      <Link to="/chatbot">Chatbot</Link>
      {isCourseDetail && (
        <>
          <Link to={`${location.pathname}/grades`}>Grades</Link>
          <Link to={`${location.pathname}/assignments`}>Assignments</Link>
          <Link to={`${location.pathname}/exams`}>Exams</Link>
          <Link to={`${location.pathname}/events`}>Upcoming Events</Link>
        </>
      )}
    </nav>
  );
}

export default SideNavigationBar;