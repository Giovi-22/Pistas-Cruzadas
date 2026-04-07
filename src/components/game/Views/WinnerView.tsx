"use client";

import React from 'react';
import { Crown } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

import { Room } from '@/types/game';

interface WinnerViewProps {
  room: Room;
}

export const WinnerView = ({ room }: WinnerViewProps) => {
  const { winner, score, config } = room;
  const winTeam = winner ? config.teams[winner] : null;
  
  return (
    <Card 
      variant="default" 
      padding="lg" 
      glow 
      className="max-w-2xl w-full text-center relative z-10 animate-in zoom-in spin-in-2 duration-700"
      color={winTeam?.color}
    >
      <Crown 
        className="w-32 h-32 mx-auto mb-8 drop-shadow-[0_0_30px_currentColor]" 
        style={{ color: winTeam?.color || '#cbd5e1' }}
      />
      <h2 className="text-6xl font-display font-black mb-4 text-white">¡Partida Finalizada!</h2>
      <p className="text-2xl text-slate-400 mb-12">
        El equipo <span className="font-bold uppercase" style={{ color: winTeam?.color }}>{winTeam?.name || '---'}</span> ha ganado.
      </p>
      
      <div className="flex justify-center gap-12 font-mono mb-12">
        <div className="text-center">
          <div className="text-6xl font-black" style={{ color: config.teams.red.color }}>{score.red}</div>
          <div className="uppercase font-bold mt-2" style={{ color: `${config.teams.red.color}88` }}>{config.teams.red.name}</div>
        </div>
        <div className="text-slate-600 text-4xl font-black self-center">-</div>
        <div className="text-center">
          <div className="text-6xl font-black" style={{ color: config.teams.blue.color }}>{score.blue}</div>
          <div className="uppercase font-bold mt-2" style={{ color: `${config.teams.blue.color}88` }}>{config.teams.blue.name}</div>
        </div>
      </div>

      <Button variant="ghost" onClick={() => window.location.reload()}>
        Volver al Inicio / Nueva Partida
      </Button>
    </Card>
  );
};
