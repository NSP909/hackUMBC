import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../common/Loader';
import Error from '../common/Error';

function Grades() {
  const { id } = useParams();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}/grades`)
      .then(response => response.json())
      .then(data => {
        setGrades(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load grades');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="grades">
      <h3>Grades</h3>
      <ul>
        {grades.map(grade => (
          <li key={grade.id}>
            {grade.assignment}: {grade.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Grades;