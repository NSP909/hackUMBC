import React from 'react'

const location = useLocation();

const courses = [
  { id: 1, name: 'Introduction to Data Science', code: 'CMSC320', icon: BookOpen, description: 'Learn the basics of data science and machine learning' },
  { id: 2, name: 'Algorithms', code: 'CMSC351', icon: Code, description: 'Learn about algorithms' },
  { id: 3, name: 'Oral Communication', code: 'COMM107', icon: Globe, description: 'Get better at public speaking' },
  { id: 4, name: 'Linear Algebra', code: 'MATH240', icon: Database, description: 'Get introduced to the world of Linear Algebra' },
  { id: 5, name: 'Calculus III', code: 'MATH241', icon: Brain, description: 'Discover the complexities of Calculus III' },
  { id: 6, name: 'Differential Equations', code: 'MATH246', icon: ChartLine, description: 'See how differential equations are used in the real world' },
];

function GeneralAnalytics() {
  return (
    <div>GeneralAnalytics</div>
  )
}

export default GeneralAnalytics