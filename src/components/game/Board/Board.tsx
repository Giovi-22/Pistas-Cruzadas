"use client";

import React from 'react';
import { Cell } from './Cell';
import { Room, ClaimedCell } from '@/types/game';
import { RowCard } from './RowCard';
import { ColumnCard } from './ColumnCard';

interface BoardProps {
  room: Room;
  canGuess?: boolean;
  onGuess?: (r: number, c: number) => void;
  isFullscreen?: boolean;
}

export const Board = ({ room, canGuess = false, onGuess, isFullscreen = false }: BoardProps) => {
  const { config, claimedCells, activeClue } = room;

  const getCellState = (r: number, c: number): ClaimedCell | undefined => {
    return claimedCells.find(cell => cell.row === r && cell.col === c);
  };

  return (
    <div className="grid gap-[1vh] items-stretch justify-center transition-all duration-500" style={{
      gridTemplateColumns: isFullscreen ? `18vh repeat(${config.colWords.length}, 15vh)` : `17vh repeat(${config.colWords.length}, 14vh)`,
      gridTemplateRows: isFullscreen ? `18vh repeat(${config.rowWords.length}, 15vh)` : `17vh repeat(${config.rowWords.length}, 14vh)`
    }}>
      {/* Empty top-left corner */}
      <div />

      {/* Column Headers */}
      {config.colWords.map((word, i) => (
        <ColumnCard c={i} colWord={word} key={`col-${i}`} />
      ))}

      {/* Rows */}
      {config.rowWords.map((rowWord, r) => (
        <React.Fragment key={`row-${r}`}>
          {/* Row Header */}
          <RowCard r={r} rowWord={rowWord} key={`row-${r}`} />
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
                teamsConfig={config.teams}
              />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};
