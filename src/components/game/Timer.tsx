"use client";

import React, { useState, useEffect } from 'react';

interface TimerProps {
  endTime: number;
  variant?: 'guessing' | 'thinking';
}

export const Timer = ({ endTime, variant = 'guessing' }: TimerProps) => {
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
  
  const textColor = variant === 'thinking' ? 'text-pink-400' : 'text-white';
  const accentColor = variant === 'thinking' ? 'text-pink-500' : 'text-red-500';

  return (
    <div className="flex flex-col items-center mt-2">
      <div className={`text-4xl font-black font-mono transition-colors ${isLow ? `${accentColor} animate-pulse` : textColor}`}>
        00:{timeLeft.toString().padStart(2, '0')}
      </div>
      {isLow && (
        <span className={`${accentColor} font-bold uppercase tracking-widest text-[10px] mt-1 animate-bounce`}>
          {variant === 'thinking' ? '¡Pensá rápido!' : '¡Tiempo Agotándose!'}
        </span>
      )}
    </div>
  );
};
