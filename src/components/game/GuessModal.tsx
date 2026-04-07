"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { Room } from '@/types/game';

interface GuessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  row: number;
  col: number;
  room: Room;
}

export const GuessModal = ({ isOpen, onClose, onConfirm, row, col, room }: GuessModalProps) => {
  if (!isOpen) return null;

  const teamConfig = room.config.teams[room.currentTurn];
  const rowWord = room.config.rowWords[row];
  const colWord = room.config.colWords[col];
  const coordLabel = `${String.fromCharCode(65 + row)}${col + 1}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      
      <Card 
        variant="default" 
        padding="none" 
        glow 
        color={teamConfig.color}
        className="w-full max-w-lg relative animate-in zoom-in slide-in-from-bottom-8 duration-500 overflow-hidden"
      >
        <div className="p-8 space-y-8">
          <header className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: `${teamConfig.color}22`, border: `2px solid ${teamConfig.color}44` }}
              >
                <Target className="w-6 h-6" style={{ color: teamConfig.color }} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white tracking-tight">¿Confirmar Apuesta?</h3>
                <p className="text-slate-400 text-sm">El <span className="font-bold" style={{ color: teamConfig.color }}>{teamConfig.name}</span> está por decidir.</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-500 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 block mb-1">Coordenada</span>
              <span className="text-4xl font-display font-black text-white">{coordLabel}</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teamConfig.color }} />
                <span className="text-sm font-bold text-white uppercase tracking-wider">{teamConfig.name}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-slate-400 text-sm text-center">Intersección seleccionada:</p>
            <div className="flex items-center justify-center gap-4 text-center">
              <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 flex-1">
                <span className="text-xl font-bold text-white tracking-wide uppercase italic">{rowWord}</span>
              </div>
              <span className="text-2xl font-display text-slate-600">+</span>
              <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 flex-1">
                <span className="text-xl font-bold text-white tracking-wide uppercase italic">{colWord}</span>
              </div>
            </div>
          </div>

          <footer className="flex gap-4 pt-4">
            <Button 
               variant="ghost" 
               className="flex-1 py-4 border-slate-800"
               onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
               color={teamConfig.color}
               className="flex-1 py-4"
               onClick={onConfirm}
               leftIcon={<CheckCircle2 className="w-5 h-5" />}
            >
              ¡Sí, Apostar!
            </Button>
          </footer>
        </div>
        
        {/* Animated accent line */}
        <div 
          className="absolute bottom-0 left-0 h-1 transition-all duration-1000"
          style={{ backgroundColor: teamConfig.color, width: '100%' }}
        />
      </Card>
    </div>
  );
};
