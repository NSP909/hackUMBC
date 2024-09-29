import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionPanel from './QuestionPanel';

const courses = ["CMSC351", "CMSC320", "COMM107", "MATH240", "MATH246", "MATH241"];

const Study = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showNextButton, setShowNextButton] = useState(false);
  const [currentTopic, setCurrentTopic] = useState(null);

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    try {
      // Simulate fetching questions for the selected course
      const response = await fetch(`http://161.35.127.128:5000/generate_question?user_id=${1}&course=${course}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const initialData = await response.json();
      console.log(initialData);
      const initialQuestions = initialData.result;
      setCurrentTopic(initialData.course_topic);
      setQuestions([initialQuestions]); // Ensure this is an array
      console.log([initialQuestions]);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error fetching initial questions:', error);
      const placeHolderQuestion = (Math.random() < 0.5)
        ? { question: {Question: "What is photosynthesis?", Answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll." }, type: "Written", difficulty: "easy"}
        : { question: {Question: "What is the capital of France?", Options: ["Paris", "London", "Berlin", "Madrid"], Answer: "Paris" }, type: "MCQ", difficulty: "easy"};
      setQuestions([placeHolderQuestion]); // Ensure this is an array
    }
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
        console.log(selectedCourse);
        console.log(currentTopic);
        const response = await fetch(`http://161.35.127.128:5000/generate_question?user_id=${1}&flag=${true}&course=${selectedCourse}&course_topic=${currentTopic}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const newQuestion = await response.json();
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setAnswer('');
        setShowNextButton(false);
      } catch (error) {
        console.error('Error fetching next question:', error);
        const placeHolderQuestion = (Math.random() < 0.5)
          ? { question: {Question: "What is photosynthesis?", Answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll." }, type: "Written", difficulty: "easy"}
          : { question: {Question: "What is the capital of France?", Options: ["Paris", "London", "Berlin", "Madrid"], Answer: "Paris" }, type: "MCQ", difficulty: "easy"};
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center p-5">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl shadow-lg p-8 w-full max-w-4xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {!selectedCourse ? (
            <motion.div
              key="course-selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-4xl mb-8 text-white text-center font-bold">Select a Course to Study</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {courses.map((course) => (
                  <motion.button
                    key={course}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCourseSelect(course)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 text-lg font-semibold"
                  >
                    {course}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : currentQuestionIndex < questions.length ? (
            <motion.div
              key="question-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <QuestionPanel
                type={questions[currentQuestionIndex].type}
                question={questions[currentQuestionIndex].question}
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
            </motion.div>
          ) : (
            <motion.h2
              key="quiz-completed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-4xl text-center text-white font-bold"
            >
              Loading Questions...
            </motion.h2>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Study;