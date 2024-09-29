import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../common/Loader';
import Error from '../common/Error';
import './Exams.module.css';

function Exams() {
  const { id } = useParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}/exams`)
      .then(response => response.json())
      .then(data => {
        setExams(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load exams');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="exams">
      <h3>Exams</h3>
      <ul>
        {exams.map(exam => (
          <li key={exam.id}>
            {exam.title} - Date: {exam.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Exams;