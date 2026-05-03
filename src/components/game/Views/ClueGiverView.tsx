"use client";

import React from 'react';
import { Target, Send } from 'lucide-react';
import { Room } from '@/types/game';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Timer } from '../Timer';

interface ClueGiverViewProps {
  room: Room;
  clueWord: string;
  setClueWord: (word: string) => void;
  handleSendClue: (e: React.FormEvent) => void;
  teamId: 'red' | 'blue';
}

export const ClueGiverView = ({ 
  room, 
  clueWord, 
  setClueWord, 
  handleSendClue, 
  teamId 
}: ClueGiverViewProps) => {
  const teamConfig = room.config.teams[teamId];
  const color = teamConfig.color;

  if (room.activeClue?.word) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <Target 
          className="w-20 h-20 mb-4 opacity-50" 
          style={{ color: color }}
        />
        <div className="p-8 w-full max-w-2xl overflow-hidden">
          <h3 className="text-slate-400 uppercase font-bold text-xs tracking-[0.3em] mb-4">Pista Secreta Recibida</h3>
          <div 
            className="text-6xl font-display font-black uppercase tracking-widest text-transparent bg-clip-text break-words"
            style={{ backgroundImage: `linear-gradient(to bottom right, ${color}, #ffffff)` }}
          >
            "{room.activeClue.word}"
          </div>
        </div>
        <p className="text-slate-400">El tiempo ya está corriendo. Esperando que tu equipo debata y adivine...</p>
      </div>
    );
  }

  // Find my target coord
  const targetRow = room.activeClue!.targetRow;
  const targetCol = room.activeClue!.targetCol;
  const rowObj = room.config.rowWords[targetRow];
  const colObj = room.config.colWords[targetCol];

  return (
    <div className="flex-1 flex flex-col justify-center space-y-8">
      <Card color={color} padding="lg" glow className="text-center">
         <h3 className="text-slate-400 uppercase font-semibold text-sm tracking-widest mb-6">Tu Objetivo Secreto</h3>
         <div className="text-5xl font-black text-white capitalize space-y-4 tracking-tight leading-tight">
           <div className="break-words">{rowObj}</div>
           <div className="text-3xl font-mono opacity-50" style={{ color: color }}>+</div>
           <div className="break-words">{colObj}</div>
         </div>
         <div className="mt-8 text-xl font-bold font-mono text-slate-500">
           Celda {String.fromCharCode(65 + targetRow)}{targetCol + 1}
         </div>
         {room.timerEndTime && (
           <div className="mt-4 border-t border-white/10 pt-4">
             <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Tiempo para pensar</span>
             <Timer endTime={room.timerEndTime} variant="thinking" />
           </div>
         )}
      </Card>

      <form onSubmit={handleSendClue} className="space-y-4">
        <Input 
          value={clueWord}
          onChange={(e) => setClueWord(e.target.value)}
          placeholder="Escribe una palabra secreta..."
          forceUppercase
        />
        <Button 
          type="submit"
          disabled={!clueWord.trim()}
          className="w-full"
          color={color}
          leftIcon={<Send className="w-5 h-5" />}
        >
          Enviar Pista e Iniciar Reloj
        </Button>
      </form>
    </div>
  );
};
