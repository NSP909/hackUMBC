import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import SideNavigationBar from './components/layout/SideNavigationBar';
import CourseSelector from './components/courses/CourseSelector';
import CourseDetail from './components/courses/CourseDetail';
import Chatbot from './components/chatbot/Chatbot';
import Study from './components/study/Study';
import LandingPage from '../src/landing/LandingPage';
import './App.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="app">
      {!isLandingPage && <SideNavigationBar />}
      <div className="content-area">
        <Routes>
          <Route path="/" element={<LandingPage />} />
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