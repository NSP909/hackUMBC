import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideNavigationBar from './components/layout/SideNavigationBar';
import CourseSelector from './components/courses/CourseSelector';
import CourseDetail from './components/courses/CourseDetail';
import Chatbot from './components/chatbot/Chatbot';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <SideNavigationBar />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<CourseSelector />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/chatbot" element={<Chatbot />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;