import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../common/Loader';
import Error from '../common/Error';
import './Assignments.module.css';

function Assignments() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}/assignments`)
      .then(response => response.json())
      .then(data => {
        setAssignments(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load assignments');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="assignments">
      <h3>Assignments</h3>
      <ul>
        {assignments.map(assignment => (
          <li key={assignment.id}>
            {assignment.title} - Due: {assignment.dueDate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Assignments;