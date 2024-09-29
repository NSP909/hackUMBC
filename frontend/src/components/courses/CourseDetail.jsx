import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Radar, Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto'; // Important for the charts to work

const courses = [
  { id: 1, name: 'Introduction to Data Science', code: 'CMSC320', description: 'Learn the basics of data science and machine learning' },
  { id: 2, name: 'Algorithms', code: 'CMSC351', description: 'Learn about algorithms' },
  { id: 3, name: 'Oral Communication', code: 'COMM107', description: 'Get better at public speaking' },
  { id: 4, name: 'Linear Algebra', code: 'MATH240', description: 'Get introduced to the world of Linear Algebra' },
  { id: 5, name: 'Calculus III', code: 'MATH241', description: 'Discover the complexities of Calculus III' },
  { id: 6, name: 'Differential Equations', code: 'MATH246', description: 'See how differential equations are used in the real world' },
];

function CourseDetail() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    // Fetch analytics data based on the selected course
    async function fetchCourseData() {
      const response = await fetch(`http://161.35.127.128:5000/get_analytics?user_id=1`); // You can replace `1` with dynamic user_id
      const data = await response.json();
      console.log(data);
      const selectedCourse = courses.find((course) => course.id === parseInt(id));
      if (selectedCourse && data[selectedCourse.code]) {
        setCourseData(data[selectedCourse.code]);
      }
    }
    fetchCourseData();
  }, [id]);

  if (!courseData) {
    return <div>Loading...</div>;
  }

  // Prepare data for charts
  const topics = Object.keys(courseData.topics);
  const easyCorrect = topics.map((topic) => (courseData.topics[topic].easy_correct / courseData.topics[topic].easy_total) * 100);
  const mediumCorrect = topics.map((topic) => (courseData.topics[topic].medium_correct / courseData.topics[topic].medium_total) * 100);
  const hardCorrect = topics.map((topic) => (courseData.topics[topic].hard_correct / courseData.topics[topic].hard_total) * 100);
  const deadlines = topics.map((topic) => courseData.topics[topic].days_to_deadline * 100); // Assuming days_to_deadline is normalized
  const upcomingAssignments = topics.map((topic) => courseData.topics[topic].upcoming_assignment);

  // Radar Chart Data (Easy, Medium, Hard correctness)
  const radarData = {
    labels: topics,
    datasets: [
      {
        label: 'Easy Correct (%)',
        data: easyCorrect,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Medium Correct (%)',
        data: mediumCorrect,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Hard Correct (%)',
        data: hardCorrect,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Stacked Bar Chart Data (Correctness Breakdown)
  const barData = {
    labels: topics,
    datasets: [
      {
        label: 'Easy Correct (%)',
        data: easyCorrect,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
      {
        label: 'Medium Correct (%)',
        data: mediumCorrect,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
      {
        label: 'Hard Correct (%)',
        data: hardCorrect,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
    ],
  };

  // Line Chart Data (Upcoming Deadlines)
  const lineData = {
    labels: topics,
    datasets: [
      {
        label: 'Days to Deadline (%)',
        data: deadlines,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  // Pie Chart Data (Upcoming Assignments)
  const pieData = {
    labels: topics,
    datasets: [
      {
        label: 'Upcoming Assignments',
        data: upcomingAssignments,
        backgroundColor: topics.map((_, i) => `rgba(${Math.floor(255 - i * 20)}, 99, 132, 0.8)`),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="course-detail p-4">
      <h2 className="text-2xl font-bold mb-6">Course: {courses.find((course) => course.id === parseInt(id)).name}</h2>

      {/* Responsive grid layout for 4 equal-sized charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Performance by Difficulty</h3>
          <div className="h-96">
            <Radar data={radarData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Stacked Bar Chart */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Correctness Breakdown by Topic</h3>
          <div className="h-96">
            <Bar data={barData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Upcoming Assignment Deadlines</h3>
          <div className="h-96">
            <Line data={lineData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Upcoming Assignments by Topic</h3>
          <div className="h-96">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
