import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../common/Loader';
import Error from '../common/Error';
import './CourseSelector.module.css';

function CourseSelector() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/courses')
      .then(response => response.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load courses');
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="course-selector">
      <h2>Select a Course</h2>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            <Link to={`/course/${course.id}`}>{course.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseSelector;