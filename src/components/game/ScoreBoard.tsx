"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

import { Room } from '@/types/game';

interface ScoreBoardProps {
  room: Room;
}

export const ScoreBoard = ({ room }: ScoreBoardProps) => {
  const { score, currentTurn, status, config } = room;
  return (
    <div className="flex space-x-4 md:space-x-8">
      <ScoreBox 
        team="red" 
        score={score.red} 
        isTurn={currentTurn === 'red' && status === 'playing'} 
        config={config.teams.red}
      />
      <ScoreBox 
        team="blue" 
        score={score.blue} 
        isTurn={currentTurn === 'blue' && status === 'playing'} 
        config={config.teams.blue}
      />
    </div>
  );
};

const ScoreBox = ({ team, score, isTurn, config }: { team: 'red' | 'blue', score: number, isTurn: boolean, config: { name: string, color: string } }) => {
  const color = config.color;
  
  return (
    <div 
      className={`relative flex items-center space-x-4 bg-slate-800/80 px-6 py-3 rounded-2xl border-2 transition-all duration-300 ${isTurn ? 'shadow-xl' : 'border-slate-700/50'}`}
      style={isTurn ? { borderColor: color, boxShadow: `0 0 15px ${color}4d` } : {}}
    >
      {isTurn && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4">
          <span 
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: color }}
          ></span>
          <span 
            className="relative inline-flex rounded-full h-4 w-4"
            style={{ backgroundColor: color }}
          ></span>
        </span>
      )}
      <div 
        className="font-display font-bold text-2xl"
        style={{ color: `${color}cc` }}
      >
        {config.name}
      </div>
      <div 
        className="text-5xl font-display font-black leading-none"
        style={{ color: color }}
      >
        {score}
      </div>
    </div>
  );
};
