"use client";

import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Share2, 
  RotateCcw, 
  Copy, 
  Check, 
  Book,
  Users,
  Palette
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Room } from '@/types/game';
import { WORD_CATEGORIES } from '@/lib/game/wordCategories';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
  emit: (event: string, data: any) => void;
}

export const AdminSidebar = ({ isOpen, onClose, room, emit }: AdminSidebarProps) => {
  const [copied, setCopied] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const pastelColors = [
    { name: 'Rose', hex: '#f9a8d4' },
    { name: 'Ocean', hex: '#93c5fd' },
    { name: 'Mint', hex: '#86efac' },
    { name: 'Lavender', hex: '#d8b4fe' },
    { name: 'Peach', hex: '#fdba74' },
    { name: 'Cyan', hex: '#67e8f9' },
  ];

  const handleCopyLink = () => {
    const url = `${window.location.origin}/mobile/${room.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdateTeam = (id: 'red' | 'blue', field: 'name' | 'color', value: string) => {
    const updatedTeams = {
      ...room.config.teams,
      [id]: { ...room.config.teams[id], [field]: value }
    };
    emit('update_config', { config: { teams: updatedTeams } });
  };

  const handleApplyCategory = (catId: string) => {
    const category = WORD_CATEGORIES.find(c => c.id === catId);
    if (category) {
      const randomSet = category.sets[Math.floor(Math.random() * category.sets.length)];
      emit('update_config', { 
        config: { 
          rowWords: randomSet.rows, 
          colWords: randomSet.cols 
        } 
      });
    }
  };

  const handleReset = () => {
    if (resetConfirm) {
      emit('reset_game', { roomId: room.id });
      setResetConfirm(false);
      onClose();
    } else {
      setResetConfirm(true);
      setTimeout(() => setResetConfirm(false), 3000);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-slate-900 border-l border-slate-800 z-[200] shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <header className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Panel de Control</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Share Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <Share2 className="w-3 h-3" /> Compartir Partida
            </div>
            <Card variant="default" padding="sm" className="bg-slate-950/50 border-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate font-mono text-xs text-slate-400">
                  {room.id}
                </div>
                <Button size="sm" variant="ghost" onClick={handleCopyLink} className="h-8 gap-2">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copiado' : 'Copiar Link'}
                </Button>
              </div>
            </Card>
          </section>

          {/* Teams Section */}
          <section className="space-y-4">
             <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <Users className="w-3 h-3" /> Personalizar Equipos
            </div>
            {(['red', 'blue'] as const).map(id => (
              <div key={id} className="space-y-4 p-4 rounded-xl border border-slate-800/50 bg-slate-800/20">
                <Input 
                  value={room.config.teams[id].name}
                  onChange={(e) => handleUpdateTeam(id, 'name', e.target.value)}
                  className="h-10 text-sm"
                  placeholder="Nombre Equipo"
                />
                <div className="flex flex-wrap gap-2">
                  {pastelColors.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => handleUpdateTeam(id, 'color', color.hex)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${room.config.teams[id].color === color.hex ? 'border-white scale-110' : 'border-transparent opacity-50'}`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Categories Section - Only in Lobby */}
          {room.status === 'lobby' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                <Book className="w-3 h-3" /> Diccionarios Temáticos
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WORD_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleApplyCategory(cat.id)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-xl mb-1">{cat.icon}</span>
                    <span className="text-[10px] font-bold text-slate-400">{cat.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <footer className="p-6 border-t border-slate-800 space-y-4 bg-slate-950/20">
          <Button 
            variant="ghost" 
            className={`w-full py-6 gap-3 transition-all ${resetConfirm ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'text-slate-500 hover:text-white'}`}
            onClick={handleReset}
            leftIcon={<RotateCcw className={`w-5 h-5 ${resetConfirm ? 'animate-spin' : ''}`} />}
          >
            {resetConfirm ? '¿Estás Seguro?' : 'Reiniciar nueva partida'}
          </Button>
          {!resetConfirm && (
             <p className="text-[10px] text-slate-600 text-center">
               El reinicio borrará el progreso y volverá a la configuración.
             </p>
          )}
        </footer>
      </div>
    </>
  );
};
