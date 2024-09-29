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

  useEffect(() => {
    const fetchInitialQuestions = async () => {
      try {
        // Simulate an HTTP request to get initial question data
        const response = await fetch('/api/nextQuestion', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: 1,
            flag: false
          })
        });
        const initialQuestions = await response.json().then((data) => {
          return data.result;
        });
        setQuestions(initialQuestions);
      } catch (error) {
        console.error('Error fetching initial questions:', error);
        const placeHolderQuestion = (Math.random() < 0.5)
          ? { question: {Question: "What is photosynthesis?", Answer: "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll." }, type: "Written", difficulty: "easy"}
          : { question: {Question: "What is the capital of France?", Options: ["Paris", "London", "Berlin", "Madrid"], Answer: "Paris" }, type: "MCQ", difficulty: "easy"};
        setQuestions([placeHolderQuestion]);
      }
    };

    fetchInitialQuestions();
  }, []);

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    // Simulate fetching questions for the selected course
    try {
      const response = await fetch(`/api/questions/${course}`);
      const data = await response.json();
      setQuestions(data.questions || initialQuestions);
      setCurrentQuestionIndex(0);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions(initialQuestions);
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
        const response = await fetch('/api/nextQuestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: 1,
            flag: true,
            course: selectedCourse
          })
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
              Quiz Completed!
            </motion.h2>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};


export default Study;