import React, { useState } from 'react';
import QuestionPanel from './QuestionPanel';
import styles from './Study.module.css';

const courses = ["CMSC351", "CMSC320", "CMSC330", "MATH241", "MATH246"];

const initialQuestions = [
  { type: 'Written', text: 'This is the first question. Fix this later to send http request for the first question later', answer: 'Paris' },
  // Add more questions as needed
];

const Study = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    setShowNextButton(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAnswer('');
      setShowNextButton(false);
    } else {
      try {
        // Simulate an HTTP request to get new question data
        const response = await fetch('/api/nextQuestion');
        const newQuestion = await response.json();
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswer('');
        setShowNextButton(false);
      } catch (error) {
        const placeHolderQuestion = Math.random() < 0.5
          ? { type: 'Written', text: 'Placeholder question?', answer: 'Placeholder answer' }
          : { type: 'MCQ', text: 'Which of these is a placeholder option?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], answer: 'Option 1' };
        setQuestions((prevQuestions) => [...prevQuestions, placeHolderQuestion]);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswer('');
        setShowNextButton(false);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setAnswer('');
      setShowNextButton(false);
    }
  };

  const isFinalQuestionAnswered = () => {
    return showNextButton || currentQuestionIndex < questions.length - 1;
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
          showNextButton={showNextButton}
          onNextQuestion={handleNextQuestion}
          onPreviousQuestion={handlePreviousQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          isFinalQuestionAnswered={isFinalQuestionAnswered()}
        />
      </div>
    );
  }

  return <h2>Quiz Completed!</h2>;
};

export default Study;