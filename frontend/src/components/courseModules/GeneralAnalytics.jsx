import React from 'react'
import { useLocation } from 'react-router-dom';

//const location = useLocation();

const courses = [
  { id: 1, name: 'Introduction to Data Science', code: 'CMSC320', description: 'Learn the basics of data science and machine learning' },
  { id: 2, name: 'Algorithms', code: 'CMSC351', description: 'Learn about algorithms' },
  { id: 3, name: 'Oral Communication', code: 'COMM107', description: 'Get better at public speaking' },
  { id: 4, name: 'Linear Algebra', code: 'MATH240', description: 'Get introduced to the world of Linear Algebra' },
  { id: 5, name: 'Calculus III', code: 'MATH241', description: 'Discover the complexities of Calculus III' },
  { id: 6, name: 'Differential Equations', code: 'MATH246', description: 'See how differential equations are used in the real world' },
];

function GeneralAnalytics() {
  return (
    <div><p>HI</p></div>
  )
}

export default GeneralAnalytics;