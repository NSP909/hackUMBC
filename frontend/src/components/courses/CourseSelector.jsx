import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Globe, Database, Brain, ChartLine } from 'lucide-react';

const courses = [
  { id: 1, name: 'Introduction to Computer Science', code: 'CS101', icon: BookOpen },
  { id: 2, name: 'Data Structures and Algorithms', code: 'CS201', icon: Code },
  { id: 3, name: 'Web Development', code: 'CS301', icon: Globe },
  { id: 4, name: 'Database Systems', code: 'CS401', icon: Database },
  { id: 5, name: 'Artificial Intelligence', code: 'CS501', icon: Brain },
  { id: 6, name: 'Machine Learning', code: 'CS601', icon: ChartLine },
];

export default function CourseSelector() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
      <h1 className="text-4xl font-bold text-center mb-10 font-merriweather">
        Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Exciting Courses</span>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="bg-opacity-80 bg-[#393937] rounded-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <course.icon className="w-10 h-10 text-blue-300" />
              <span className="text-xl font-semibold text-blue-200">{course.code}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
            <p className="text-sm opacity-80">Discover the fundamentals and advance your skills in this exciting field.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}