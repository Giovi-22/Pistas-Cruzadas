"use client";

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { Settings, Save, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ConfigPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter();
  const { room, isReady, emit } = useRoom(roomId, 'Host');

  const [rowWords, setRowWords] = useState(["", "", "", "", ""]);
  const [colWords, setColWords] = useState(["", "", "", "", ""]);
  const [turnDuration, setTurnDuration] = useState<number | string>(60);

  // Sync with room state if it changes
  useEffect(() => {
    if (room?.config) {
      setRowWords(room.config.rowWords);
      setColWords(room.config.colWords);
      setTurnDuration(room.config.turnDurationSeconds || 60);
    }
  }, [room?.config]);

  const handleUpdateWord = (type: 'row' | 'col', index: number, value: string) => {
    const setter = type === 'row' ? setRowWords : setColWords;
    const words = type === 'row' ? rowWords : colWords;
    const newWords = [...words];
    newWords[index] = value.toUpperCase();
    setter(newWords);
  };

  const handleSaveAndStart = () => {
    const finalDuration = Math.max(10, typeof turnDuration === 'number' ? turnDuration : parseInt(turnDuration as string) || 60);

    emit('update_config', {
      config: {
        rowWords,
        colWords,
        turnDurationSeconds: finalDuration
      }
    });

    router.push(`/screen/${roomId}`);
  };

  if (!isReady) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando configuración...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex items-center space-x-4">
          <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20">
            <Settings className="w-10 h-10 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Configuración de Sala</h1>
            <p className="text-slate-400">Ajusta las palabras base del tablero antes de generarlo.</p>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Row Words Input */}
          <Card variant="red" padding="md" glow>
            <h2 className="text-xl font-bold mb-6 text-rose-400">Filas (A-E)</h2>
            <div className="space-y-4">
              {rowWords.map((word, i) => (
                <div key={`row-${i}`} className="flex items-center space-x-3">
                  <span className="bg-rose-500/20 text-rose-400 font-bold w-12 h-12 flex items-center justify-center rounded-xl border border-rose-500/30">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <Input
                    value={word}
                    onChange={(e) => handleUpdateWord('row', i, e.target.value)}
                    forceUppercase
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Col Words Input */}
          <Card variant="blue" padding="md" glow>
            <h2 className="text-xl font-bold mb-6 text-blue-400">Columnas (1-5)</h2>
            <div className="space-y-4">
              {colWords.map((word, i) => (
                <div key={`col-${i}`} className="flex items-center space-x-3">
                  <span className="bg-blue-500/20 text-blue-400 font-bold font-serif w-12 h-12 flex items-center justify-center rounded-xl border border-blue-500/30">
                    {i + 1}
                  </span>
                  <Input
                    value={word}
                    onChange={(e) => handleUpdateWord('col', i, e.target.value)}
                    forceUppercase
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Timer Config */}
        <Card variant="default" padding="md" className="border-slate-800">
           <div className="flex items-center space-x-4 mb-6">
             <Clock className="w-8 h-8 text-amber-400" />
             <h2 className="text-xl font-bold text-slate-300">Segundos por Turno</h2>
           </div>
           
           <div className="flex flex-col md:flex-row gap-4">
              {[30, 45, 60, 90, 120].map(preset => (
                 <button
                    key={preset}
                    onClick={() => setTurnDuration(preset)}
                    className={`flex-1 py-4 font-bold rounded-xl transition-all ${turnDuration === preset ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-105' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
                 >
                    {preset}s
                 </button>
              ))}
              
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <Input 
                  type="number" 
                  value={turnDuration}
                  onChange={(e) => setTurnDuration(e.target.value === '' ? '' : parseInt(e.target.value))}
                  className="w-24 text-center text-xl p-3"
                />
                <span className="text-slate-500 font-bold uppercase text-xs">seg</span>
              </div>
           </div>
        </Card>

        {/* Action Button */}
        <Button 
           onClick={handleSaveAndStart}
           size="xl"
           className="w-full h-20"
           leftIcon={<Save className="w-6 h-6" />}
        >
          Guardar y Mostrar el Tablero
        </Button>

      </div>
    </div>
  );
}
