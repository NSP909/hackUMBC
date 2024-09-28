import React from 'react';
import styles from './Dropdown.module.css';

function Dropdown({ selectedCourse, setSelectedCourse, options }) {
  return (
    <div className={styles.dropdown}>
      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        className={styles.select}
      >
        <option value="">Select Option</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Dropdown;