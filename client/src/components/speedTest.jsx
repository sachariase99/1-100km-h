import React, { useState, useEffect } from 'react';

function SpeedTestApp() {
  const [speed, setSpeed] = useState(0); // Current speed in km/h
  const [timer, setTimer] = useState(0); // Timer in milliseconds
  const [startTime, setStartTime] = useState(null); // Store the start time
  const [isStarted, setIsStarted] = useState(false); // Check if the timer has started
  const [isFinished, setIsFinished] = useState(false); // Check if the speed has reached 100 km/h

  // Start the timer once the speed hits 1 km/h and stop when it reaches 100 km/h
  useEffect(() => {
    let interval;

    // Start timer once speed reaches 1 km/h, but only once
    if (speed >= 1 && !isStarted) {
      setIsStarted(true);
      setStartTime(Date.now()); // Record the start time
    }

    if (isStarted && !isFinished) {
      // Only update the timer after start
      interval = setInterval(() => {
        setTimer(Date.now() - startTime); // Calculate time from startTime
      }, 10); // update every 10ms
    }

    // Stop the timer at 100 km/h
    if (speed >= 100 && !isFinished) {
      setIsFinished(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup interval on component unmount or stop
  }, [speed, isStarted, isFinished, startTime]);

  // Handle Geolocation updates
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((position) => {
        const { speed: currentSpeed } = position.coords;
        setSpeed((currentSpeed * 3.6).toFixed(2)); // convert m/s to km/h and set state
      });
    }
  }, []);

  // Reset the test
  const resetTest = () => {
    setSpeed(0);
    setTimer(0);
    setStartTime(null); // Reset start time
    setIsStarted(false);
    setIsFinished(false);
  };

  return (
    <div className='bg-black text-white h-screen relative'>
      <h1 className='absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-bold w-full text-center'>0-100 km/h Speed Test</h1>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
      <p className='flex flex-col text-xl'>Current Speed: <span className='text-3xl font-bold mb-4'>{speed} km/h</span></p>
      <p className='flex flex-col text-lg'>Timer: <span className='text-2xl font-bold -mt-2 mb-4'>{(timer / 1000).toFixed(2)} seconds</span></p>
      {isFinished ? (
        <p>Test Complete!</p>
      ) : (
        <p className='text-2xl mb-4'>{isStarted ? 'Testing...' : 'Waiting to start'}</p>
      )}
      <button onClick={resetTest} className='border px-4 py-2 rounded-xl'>Reset Test</button>
      </div>
    </div>
  );
}

export default SpeedTestApp;
