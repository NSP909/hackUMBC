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
    <div className="course-selector">
      <h1 className="course-selector-title">Course Selector</h1>
      <div className="course-grid">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="course-box"
          >
            <h2 className="course-name">{course.name}</h2>
            <p className="course-code">{course.code}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}