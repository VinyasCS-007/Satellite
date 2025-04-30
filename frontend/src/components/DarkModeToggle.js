import React from 'react';

const DarkModeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <button
      className="darkmode-toggle"
      onClick={() => setDarkMode(dm => !dm)}
      aria-label="Toggle dark mode"
    >
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

export default DarkModeToggle;
