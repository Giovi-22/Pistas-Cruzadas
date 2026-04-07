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
}

export const Cell = ({
  row,
  col,
  claimed,
  isTarget = false,
  canGuess = false,
  onGuess
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

  const getClaimedClasses = () => {
    if (!claimed) return "";
    if (claimed.team === 'red') return "bg-[#79b7c8] ring-4 ring-rose-500 shadow-rose-500/50";
    if (claimed.team === 'blue') return "bg-[#79b7c8] ring-4 ring-blue-500 shadow-blue-500/50";
    if (claimed.team === 'failed') return "bg-slate-900 border-slate-700 opacity-80";
    return "";
  };

  return (
    <div 
      className={getCellClasses()}
      onClick={handleClick}
    >
      {/* Main Cell Content */}
      {claimed ? (
        <div className={`w-full h-full rounded-xl shadow-lg border-[3px] border-[#e2e8f0] flex items-center justify-center group overflow-hidden ${getClaimedClasses()}`}>
          {claimed.team === 'failed' ? (
            <X className="w-20 h-20 text-rose-600 opacity-90 drop-shadow-lg" />
          ) : (
            <div className="flex flex-row items-end gap-1">
              <span className="text-6xl font-serif font-bold text-slate-900 pb-1">{String.fromCharCode(65 + row)}</span>
              <div className="bg-white rounded-full w-8 h-8 mb-4 shadow-sm flex items-center justify-center">
                <span className="text-xl font-black text-rose-500">{col + 1}</span>
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
