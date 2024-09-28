import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideNavigationBar from './components/layout/SideNavigationBar';
import CourseSelector from './components/courses/CourseSelector';
import CourseDetail from './components/courses/CourseDetail';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="main-content">
          <SideNavigationBar />
          <div className="content-area">
            <Routes>
              <Route exact path="/" component={CourseSelector} />
              <Route path="/course/:id" component={CourseDetail} />
              <Route path="/chatbot" component={Chatbot} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;