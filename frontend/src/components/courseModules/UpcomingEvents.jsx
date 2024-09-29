import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';
import Loader from '../common/Loader';
import Error from '../common/Error';

const UpcomingEvents = () => {
  const [todos, setTodos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('http://161.35.127.128:5000/todo');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTodos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load upcoming events');
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <h1 className="text-4xl font-bold text-center mb-10 font-merriweather">
        Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Events</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(todos).map(([course, details]) => {
          const courseTitle = course.substring(0, 7);
          
          return (
            <div key={course} className="bg-opacity-80 bg-[#393937] rounded-xl p-6 flex flex-col h-full transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-blue-300 flex-shrink-0" />
                <span className="text-lg font-semibold text-blue-200 ml-2 text-right">{courseTitle}</span>
              </div>
              {details.assignment_name && details.due_date ? (
                <div className="mt-auto">
                  <div className="flex items-start mt-2 text-blue-200">
                    <Calendar className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                    <p className="text-sm">{details.assignment_name}</p>
                  </div>
                  <div className="flex items-center mt-2 text-blue-200">
                    <Clock className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Due: {details.due_date}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center mt-auto text-yellow-200">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">No upcoming assignments</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingEvents;