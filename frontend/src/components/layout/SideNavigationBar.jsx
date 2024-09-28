import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './SideNavigationBar.module.css';
import {
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem
} from "@nextui-org/navbar";


export default function Component() {
  const location = useLocation();
  const isCourseDetail = location.pathname.includes('/course/');

  return (
    <nav className={styles.sideNavigationBar}>
      <h1>LMS</h1>
      <ul>
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? styles.active : ''}
          >
            Course Selector
          </Link>
        </li>
        {isCourseDetail && (
          <>
            <li>
              <Link 
                to={`${location.pathname}/grades`}
                className={location.pathname.endsWith('/grades') ? styles.active : ''}
              >
                Grades
              </Link>
            </li>
            <li>
              <Link 
                to={`${location.pathname}/assignments`}
                className={location.pathname.endsWith('/assignments') ? styles.active : ''}
              >
                Assignments
              </Link>
            </li>
            <li>
              <Link 
                to={`${location.pathname}/exams`}
                className={location.pathname.endsWith('/exams') ? styles.active : ''}
              >
                Exams
              </Link>
            </li>
            <li>
              <Link 
                to={`${location.pathname}/events`}
                className={location.pathname.endsWith('/events') ? styles.active : ''}
              >
                Upcoming Events
              </Link>
            </li>
          </>
        )}
        <li>
          <Link 
            to="/chatbot"
            className={location.pathname === '/chatbot' ? styles.active : ''}
          >
            Chatbot
          </Link>
        </li>
      </ul>
    </nav>
  );
}