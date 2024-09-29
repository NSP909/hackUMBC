import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SideNavigationBar from './components/layout/SideNavigationBar';
import CourseSelector from './components/courses/CourseSelector';
import CourseDetail from './components/courses/CourseDetail';
import Chatbot from './components/chatbot/Chatbot';
import Study from './components/study/Study';
import LandingPage from '../src/landing/LandingPage';
import Login from '../src/login-page/login';
import './App.css';

function App() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(prevState => !prevState);
  };

  return (
    <Router>
      <AppContent isExpanded={isExpanded} toggleSidebar={toggleSidebar} />
    </Router>
  );
}

function AppContent({ isExpanded, toggleSidebar }) {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="app">
      {!isLandingPage && <SideNavigationBar isExpanded={isExpanded} toggleSidebar={toggleSidebar} />}
      <div className={`content-area ${isExpanded ? '' : 'collapsed'}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/dashboard" element={<CourseSelector />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/study" element={<Study />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
