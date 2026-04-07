"use client";

import React from 'react';
import { X } from 'lucide-react';
import { ClaimedCell } from '@/types/game';

interface CellProps {
  row: number;
  col: number;
  claimed?: ClaimedCell;
  isTarget?: boolean;
  canGuess?: boolean;
  onGuess?: (r: number, c: number) => void;
  teamsConfig?: Record<string, { name: string, color: string }>;
}

export const Cell = ({
  row,
  col,
  claimed,
  isTarget = false,
  canGuess = false,
  onGuess,
  teamsConfig
}: CellProps) => {

  const handleClick = () => {
    if (canGuess && onGuess && !claimed) {
      onGuess(row, col);
    }
  };

  const getCellClasses = () => {
    const base = "relative aspect-square flex items-center justify-center transition-all duration-500 rounded-xl";
    const interactive = canGuess && !claimed ? "cursor-pointer hover:scale-105 hover:bg-slate-800" : "";
    return `${base} ${interactive}`;
  };

  const getClaimedStyle = () => {
    if (!claimed || !teamsConfig) return {};
    const teamColor = teamsConfig[claimed.team].color;
    return { 
      borderColor: teamColor, 
      boxShadow: `0_0_15px_${teamColor}66`,
      borderWidth: '4px'
    };
  };

  const getClaimedClasses = () => {
    if (!claimed) return "";
    if (!claimed.isCorrect) return "bg-slate-900 border-slate-700 opacity-90";
    return "shadow-lg bg-[#79b7c8]";
  };

  return (
    <div 
      className={getCellClasses()}
      onClick={handleClick}
    >
      {/* Main Cell Content */}
      {claimed ? (
        <div 
          className={`w-full h-full rounded-xl border-[3px] border-[#e2e8f0] flex items-center justify-center group overflow-hidden ${getClaimedClasses()}`}
          style={getClaimedStyle()}
        >
          {!claimed.isCorrect ? (
            <X 
              className="w-20 h-20 drop-shadow-lg" 
              style={{ color: teamsConfig?.[claimed.team].color }} 
            />
          ) : (
            <div className="flex flex-row items-end gap-1">
              <span className="text-6xl font-serif font-bold text-slate-900 pb-1">{String.fromCharCode(65 + row)}</span>
              <div className="bg-white rounded-full w-8 h-8 mb-4 shadow-sm flex items-center justify-center">
                <span className="text-xl font-black" style={{ color: teamsConfig?.[claimed.team].color }}>{col + 1}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
           {/* Dash border hover effect */}
           {canGuess && (
              <div className="absolute inset-0 border-2 border-dashed border-slate-700 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
           )}
        </>
      )}
    </div>
  );
};
