"use client";

import React from 'react';
import { Target, Send } from 'lucide-react';
import { Room } from '@/types/game';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface ClueGiverViewProps {
  room: Room;
  clueWord: string;
  setClueWord: (word: string) => void;
  handleSendClue: (e: React.FormEvent) => void;
  myColor: 'rose' | 'cyan';
}

export const ClueGiverView = ({ 
  room, 
  clueWord, 
  setClueWord, 
  handleSendClue, 
  myColor 
}: ClueGiverViewProps) => {

  if (room.activeClue?.word) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <Target className={`w-20 h-20 text-${myColor}-500 mb-4 opacity-50`} />
        <h2 className="text-2xl font-bold text-white">Pista Enviada</h2>
        <div className={`text-4xl font-black text-${myColor}-400 uppercase tracking-widest`}>
          "{room.activeClue.word}"
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
      <Card variant={myColor === 'rose' ? 'red' : 'blue'} padding="lg" glow className="text-center">
         <h3 className="text-slate-400 uppercase font-semibold text-sm tracking-widest mb-6">Tu Objetivo Secreto</h3>
         <div className="text-5xl font-black text-white capitalize space-y-4 tracking-tight leading-tight">
           <div className="break-words">{rowObj}</div>
           <div className={`text-${myColor}-500 text-3xl font-mono opacity-50`}>+</div>
           <div className="break-words">{colObj}</div>
         </div>
         <div className="mt-8 text-xl font-bold font-mono text-slate-500">
           Celda {String.fromCharCode(65 + targetRow)}{targetCol + 1}
         </div>
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
          variant={myColor === 'rose' ? 'danger' : 'secondary'}
          leftIcon={<Send className="w-5 h-5" />}
        >
          Enviar Pista e Iniciar Reloj
        </Button>
      </form>
    </div>
  );
};
