import React, { useState, useEffect } from 'react';
import { useParams, Route, Switch } from 'react-router-dom';
import Grades from '../courseModules/Grades';
import Assignments from '../courseModules/Assignments';
import Exams from '../courseModules/Exams';
import UpcomingEvents from '../courseModules/UpcomingEvents';
import Loader from '../common/Loader';
import Error from '../common/Error';

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}`)
      .then(response => response.json())
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load course details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="course-detail">
      <h2>{course.name}</h2>
      <p>{course.description}</p>
      <Switch>
        <Route path="/course/:id/grades" component={Grades} />
        <Route path="/course/:id/assignments" component={Assignments} />
        <Route path="/course/:id/exams" component={Exams} />
        <Route path="/course/:id/events" component={UpcomingEvents} />
      </Switch>
    </div>
  );
}

export default CourseDetail;