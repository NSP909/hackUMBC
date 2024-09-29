import React, { useState } from 'react';
import QuestionPanel from './QuestionPanel';
import styles from './Study.module.css';

const courses = ["CMSC351", "CMSC320", "CMSC330", "MATH241", "MATH246"];

const questions = [
  { type: 'Written', question: 'What is the capital of France?', answer: 'Paris' },
  { type: 'MCQ', question: 'Which of these is a programming language?', options: ['Java', 'HTML', 'CSS', 'XML'], answer: 'Java' },
  // Add more questions as needed
];

const Study = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setAnswer('');
  };

  if (!selectedCourse) {
    return (
      <div className={styles.courseSelection}>
        <h2>Select a Course to Study</h2>
        <div className={styles.courseButtons}>
          {courses.map((course) => (
            <button key={course} onClick={() => handleCourseSelect(course)}>
              {course}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];
    return (
      <div className={styles.studyContainer}>
        <QuestionPanel
          question={question}
          answer={answer}
          onChange={handleAnswerChange}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  return <h2>Quiz Completed!</h2>;
};

export default Study;