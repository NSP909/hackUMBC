import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationBar from './components/layout/NavigationBar';
import SideNavigationBar from './components/layout/SideNavigationBar';
import CourseSelector from './components/courses/CourseSelector';
import CourseDetail from './components/courses/CourseDetail';
import Chatbot from './components/chatbot/Chatbot';

function App() {
  return (
    <Router>
      <div className="app">
        <NavigationBar />
        <div className="main-content">
          <SideNavigationBar />
          <div className="content-area">
            <Switch>
              <Route exact path="/" component={CourseSelector} />
              <Route path="/course/:id" component={CourseDetail} />
              <Route path="/chatbot" component={Chatbot} />
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;