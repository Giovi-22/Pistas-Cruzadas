"use client";

import React, { useState, useEffect } from 'react';

interface TimerProps {
  endTime: number;
}

export const Timer = ({ endTime }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    };
    
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [endTime]);

  const isLow = timeLeft <= 10 && timeLeft > 0;

  return (
    <div className="flex flex-col items-center mt-2">
      <div className={`text-4xl font-black font-mono transition-colors ${isLow ? 'text-red-500 animate-pulse' : 'text-white'}`}>
        00:{timeLeft.toString().padStart(2, '0')}
      </div>
      {isLow && (
        <span className="text-red-500 font-bold uppercase tracking-widest text-xs mt-1 animate-bounce">
          ¡Tiempo Agotándose!
        </span>
      )}
    </div>
  );
};
