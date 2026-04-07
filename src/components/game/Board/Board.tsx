"use client";

import React from 'react';
import { Cell } from './Cell';
import { Room, ClaimedCell } from '@/types/game';

interface BoardProps {
  room: Room;
  canGuess?: boolean;
  onGuess?: (r: number, c: number) => void;
}

export const Board = ({ room, canGuess = false, onGuess }: BoardProps) => {
  const { config, claimedCells, activeClue } = room;

  const getCellState = (r: number, c: number): ClaimedCell | undefined => {
    return claimedCells.find(cell => cell.row === r && cell.col === c);
  };

  return (
    <div className="grid gap-4" style={{
      gridTemplateColumns: `140px repeat(${config.colWords.length}, 110px)`,
      gridTemplateRows: `140px repeat(${config.rowWords.length}, 110px)`
    }}>
      {/* Empty top-left corner */}
      <div />

      {/* Column Headers */}
      {config.colWords.map((word, i) => (
        <div key={`col-${i}`} className="flex flex-col rounded-xl overflow-hidden border-[6px] border-rose-400/90 shadow-xl bg-orange-50/90 aspect-[3/4]">
          <div className="flex-1 flex items-center justify-center text-7xl font-serif text-slate-800 drop-shadow-sm font-black text-center pt-2">
            {i + 1}
          </div>
          <div className="bg-cyan-400 h-[35%] flex flex-col items-center justify-center border-t-4 border-rose-400 px-1 py-1">
            <span className="text-white font-bold uppercase text-[11px] leading-tight text-center tracking-widest drop-shadow-md">
              {word}
            </span>
          </div>
        </div>
      ))}

      {/* Rows */}
      {config.rowWords.map((rowWord, r) => (
        <React.Fragment key={`row-${r}`}>
          {/* Row Header */}
          <div className="flex flex-row rounded-xl overflow-hidden border-[6px] border-rose-400/90 shadow-xl bg-orange-50/90 aspect-[4/3]">
            <div className="flex-1 flex items-center justify-center text-7xl font-serif text-slate-800 drop-shadow-sm font-black pl-2">
              {String.fromCharCode(65 + r)}
            </div>
            <div className="bg-cyan-400 w-[35%] flex items-center justify-center border-l-4 border-rose-400 relative">
               <span className="text-white font-bold uppercase text-[11px] tracking-widest drop-shadow-md whitespace-nowrap origin-center -rotate-90 absolute">
                 {rowWord}
               </span>
            </div>
          </div>

          {/* Row Cells */}
          {config.colWords.map((_, c) => {
            const claimed = getCellState(r, c);
            const isTarget = !!(activeClue && activeClue.targetRow === r && activeClue.targetCol === c);
            
            return (
              <Cell 
                key={`cell-${r}-${c}`}
                row={r}
                col={c}
                claimed={claimed}
                isTarget={isTarget}
                canGuess={canGuess}
                onGuess={onGuess}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
