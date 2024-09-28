import React from 'react';
import { Link } from 'react-router-dom';
import './CourseSelector.module.css';

const courses = [
  { id: 1, name: 'Introduction to Computer Science', code: 'CS101' },
  { id: 2, name: 'Data Structures and Algorithms', code: 'CS201' },
  { id: 3, name: 'Web Development', code: 'CS301' },
  { id: 4, name: 'Database Systems', code: 'CS401' },
  { id: 5, name: 'Artificial Intelligence', code: 'CS501' },
  { id: 6, name: 'Machine Learning', code: 'CS601' },
];

export default function CourseSelector() {
  return (
    <div className="courseSelector">
      <h2>Course Selector</h2>
      <ul className="courseList">
        {courses.map((course) => (
          <li key={course.id} className="courseItem">
            <Link to={`/course/${course.id}`} className="courseLink">
              <h3>{course.name}</h3>
              <p>{course.code}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}