"use client";

import React from 'react';
import { Crown } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface WinnerViewProps {
  winner: 'red' | 'blue' | null;
  score: { red: number; blue: number };
}

export const WinnerView = ({ winner, score }: WinnerViewProps) => {
  return (
    <Card variant="default" padding="lg" glow className="max-w-2xl w-full text-center relative z-10 animate-in zoom-in spin-in-2 duration-700">
      <Crown className={`w-32 h-32 mx-auto mb-8 ${winner === 'red' ? 'text-rose-500' : 'text-cyan-500'} drop-shadow-[0_0_30px_currentColor]`} />
      <h2 className="text-5xl font-black mb-4 text-white">¡Partida Finalizada!</h2>
      <p className="text-2xl text-slate-400 mb-12">
        El equipo <span className={`font-bold uppercase ${winner === 'red' ? 'text-rose-400' : 'text-cyan-400'}`}>{winner === 'red' ? 'Rojo' : 'Azul'}</span> ha ganado.
      </p>
      
      <div className="flex justify-center gap-12 font-mono mb-12">
        <div className="text-center">
          <div className="text-rose-500 text-6xl font-black">{score.red}</div>
          <div className="text-rose-400/50 uppercase font-bold mt-2">Rojos</div>
        </div>
        <div className="text-slate-600 text-4xl font-black self-center">-</div>
        <div className="text-center">
          <div className="text-cyan-500 text-6xl font-black">{score.blue}</div>
          <div className="text-cyan-400/50 uppercase font-bold mt-2">Azules</div>
        </div>
      </div>

      <Button variant="ghost" onClick={() => window.location.reload()}>
        Volver al Inicio / Nueva Partida
      </Button>
    </Card>
  );
};
