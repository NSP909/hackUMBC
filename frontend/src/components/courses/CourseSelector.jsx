import React from 'react';
import { Link } from 'react-router-dom';

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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Course Selector</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors duration-200"
          >
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{course.name}</h2>
            <p className="font-normal text-gray-700">{course.code}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}