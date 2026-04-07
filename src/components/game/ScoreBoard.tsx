"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ScoreBoardProps {
  score: { red: number; blue: number };
  currentTurn?: 'red' | 'blue';
  status: 'lobby' | 'playing' | 'finished';
}

export const ScoreBoard = ({ score, currentTurn, status }: ScoreBoardProps) => {
  return (
    <div className="flex space-x-4 md:space-x-8">
      <ScoreBox team="red" score={score.red} isTurn={currentTurn === 'red' && status === 'playing'} />
      <ScoreBox team="blue" score={score.blue} isTurn={currentTurn === 'blue' && status === 'playing'} />
    </div>
  );
};

const ScoreBox = ({ team, score, isTurn }: { team: 'red' | 'blue', score: number, isTurn: boolean }) => {
  const isRed = team === 'red';
  const colorClass = isRed ? 'rose' : 'cyan';
  
  return (
    <div className={`
      relative flex items-center space-x-4 bg-slate-800/80 px-6 py-3 rounded-2xl border-2 transition-all duration-300
      ${isTurn ? (isRed ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]') : 'border-slate-700/50'}
    `}>
      {isTurn && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRed ? 'bg-rose-400' : 'bg-cyan-400'}`}></span>
          <span className={`relative inline-flex rounded-full h-4 w-4 ${isRed ? 'bg-rose-500' : 'bg-cyan-500'}`}></span>
        </span>
      )}
      <div className={`font-bold text-lg uppercase tracking-widest ${isRed ? 'text-rose-400' : 'text-cyan-400'}`}>
        {isRed ? 'Rojos' : 'Azules'}
      </div>
      <div className={`text-4xl font-black font-mono leading-none ${isRed ? 'text-rose-500' : 'text-cyan-500'}`}>
        {score}
      </div>
    </div>
  );
};
