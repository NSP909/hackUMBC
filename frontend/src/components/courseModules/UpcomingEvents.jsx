import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../common/Loader';
import Error from '../common/Error';
import './UpcomingEvents.module.css';

function UpcomingEvents() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/courses/${id}/events`)
      .then(response => response.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load upcoming events');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;

  return (
    <div className="upcoming-events">
      <h3>Upcoming Events</h3>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title} - Date: {event.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UpcomingEvents;