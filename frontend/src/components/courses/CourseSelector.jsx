import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Globe, Database, Brain, ChartLine } from 'lucide-react';

const courses = [
  { id: 1, name: 'Introduction to Data Science', code: 'CMSC320', icon: BookOpen, description: 'Learn the basics of data science and machine learning' },
  { id: 2, name: 'Algorithms', code: 'CMSC351', icon: Code, description: 'Learn about algorithms' },
  { id: 3, name: 'Oral Communication', code: 'COMM107', icon: Globe, description: 'Get better at public speaking' },
  { id: 4, name: 'Linear Algebra', code: 'MATH240', icon: Database, description: 'Get introduced to the world of Linear Algebra' },
  { id: 5, name: 'Calculus III', code: 'MATH241', icon: Brain, description: 'Discover the complexities of Calculus III' },
  { id: 6, name: 'Differential Equations', code: 'MATH246', icon: ChartLine, description: 'See how differential equations are used in the real world' },
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
            <p className="text-sm opacity-80">{course.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}