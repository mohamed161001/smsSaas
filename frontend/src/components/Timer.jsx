import React, { useState, useEffect } from 'react';

function Timer() {
  const [totalSeconds, setTotalSeconds] = useState(localStorage.getItem('totalSeconds'));
  const [isActive, setIsActive] = useState(localStorage.getItem('isActive'));

  // Load the initial timer state from localStorage if available
  useEffect(() => {
    const storedTotalSeconds = localStorage.getItem('totalSeconds');
    const storedIsActive = localStorage.getItem('isActive');

    if (storedTotalSeconds !== null && storedIsActive !== null) {
      setTotalSeconds(parseInt(storedTotalSeconds, 10));
      setIsActive(storedIsActive === 'true');
    }
  }, []);

  // Update localStorage when the timer state changes
  useEffect(() => {
    localStorage.setItem('totalSeconds', totalSeconds);
    localStorage.setItem('isActive', isActive);
  }, [totalSeconds, isActive]);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTotalSeconds((prevTotalSeconds) => prevTotalSeconds + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setTotalSeconds(0);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} hours`;
  };

  return (
    <div>
      <h1>Timer: {formatTime(totalSeconds)}</h1>
      <button onClick={toggleTimer}>
        {isActive ? 'Pause' : 'Start'}
      </button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
}

export default Timer;