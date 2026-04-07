"use client";

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRoom } from '@/hooks/useRoom';
import { Settings, Save, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { WORD_CATEGORIES, WordSet } from '@/lib/game/wordCategories';
import { RefreshCw, Book } from 'lucide-react';
import { generateSmartBoard } from '@/lib/game/wordUtils';

export default function ConfigPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter();
  const { room, isReady, emit } = useRoom(roomId, 'Host', 'Screen');

  const [rowWords, setRowWords] = useState(["", "", "", "", ""]);
  const [colWords, setColWords] = useState(["", "", "", "", ""]);
  const [turnDuration, setTurnDuration] = useState<number | string>(60);
  const [teams, setTeams] = useState({
    red: { name: "Equipo 1", color: "#f9a8d4" },
    blue: { name: "Equipo 2", color: "#93c5fd" }
  });

  const pastelColors = [
    { name: 'Rose', hex: '#f9a8d4' },
    { name: 'Ocean', hex: '#93c5fd' },
    { name: 'Mint', hex: '#86efac' },
    { name: 'Lavender', hex: '#d8b4fe' },
    { name: 'Peach', hex: '#fdba74' },
    { name: 'Cyan', hex: '#67e8f9' },
  ];

  // Sync with room state if it changes
  useEffect(() => {
    if (room?.config) {
      setRowWords(room.config.rowWords);
      setColWords(room.config.colWords);
      setTurnDuration(room.config.turnDurationSeconds || 60);
      if (room.config.teams) {
        setTeams(room.config.teams);
      }
    }
  }, [room?.config]);

  const handleUpdateWord = (type: 'row' | 'col', index: number, value: string) => {
    const setter = type === 'row' ? setRowWords : setColWords;
    const words = type === 'row' ? rowWords : colWords;
    const newWords = [...words];
    newWords[index] = value.toUpperCase();
    setter(newWords);
  };

  const handleUpdateTeam = (id: 'red' | 'blue', field: 'name' | 'color', value: string) => {
    setTeams(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleApplyCategory = (catId: string) => {
    const { rows, cols } = generateSmartBoard(catId);
    setRowWords(rows);
    setColWords(cols);
  };

  const handleSaveAndStart = () => {
    const finalDuration = Math.max(10, typeof turnDuration === 'number' ? turnDuration : parseInt(turnDuration as string) || 60);

    emit('update_config', {
      config: {
        rowWords,
        colWords,
        turnDurationSeconds: finalDuration,
        teams
      }
    });

    router.push(`/screen/${roomId}`);
  };

  if (!isReady) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Cargando configuración...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        
        <header className="flex items-center space-x-4">
          <div className="bg-cyan-500/10 p-3 rounded-2xl border border-cyan-500/20">
            <Settings className="w-10 h-10 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Configuración de Sala</h1>
            <p className="text-slate-400">Personaliza tu partida antes de empezar.</p>
          </div>
        </header>

        {/* Word Categories Quick Select */}
        <Card variant="default" padding="md" className="border-slate-800 bg-slate-900/40">
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Book className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-200">Diccionarios Temáticos</h2>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest bg-slate-800 px-3 py-1 rounded-full">Automático</span>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {WORD_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleApplyCategory(cat.id)}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 overflow-hidden"
                >
                   {/* Background hover pulse */}
                   <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors" />
                   
                   <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
                   <span className="text-sm font-bold text-slate-300 group-hover:text-indigo-300">{cat.name}</span>
                   
                   <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <RefreshCw className="w-4 h-4 text-slate-500 animate-spin-slow" />
                   </div>
                </button>
              ))}
           </div>
           <p className="mt-6 text-xs text-center text-slate-500 italic">
             Haz clic en una categoría para cargar un juego de palabras al azar. ¡Podés volver a clickear para ver variaciones!
           </p>
        </Card>

        {/* Team Customization */}
        <div className="grid md:grid-cols-2 gap-8">
          {(['red', 'blue'] as const).map(id => (
            <Card key={id} variant="default" padding="md" className="border-slate-800">
               <h2 className="text-lg font-bold mb-4 text-slate-300">
                 Configuración {id === 'red' ? 'Equipo 1' : 'Equipo 2'}
               </h2>
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Nombre del Equipo</label>
                   <Input 
                      value={teams[id].name}
                      onChange={(e) => handleUpdateTeam(id, 'name', e.target.value)}
                      placeholder={id === 'red' ? "Equipo 1" : "Equipo 2"}
                      maxLength={15}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Color Pastel Representativo</label>
                   <div className="flex flex-wrap gap-3 p-1">
                      {pastelColors.map(color => (
                        <button
                          key={color.hex}
                          onClick={() => handleUpdateTeam(id, 'color', color.hex)}
                          className={`w-10 h-10 rounded-full border-4 transition-all ${teams[id].color === color.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                   </div>
                 </div>
               </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Row Words Input */}
          <Card variant="default" padding="md" className="border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-slate-300">Palabras de Filas (A-E)</h2>
            <div className="space-y-4">
              {rowWords.map((word, i) => (
                <div key={`row-${i}`} className="flex items-center space-x-3">
                  <span className="bg-slate-800 text-slate-400 font-bold w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700">
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
          <Card variant="default" padding="md" className="border-slate-800">
            <h2 className="text-xl font-bold mb-6 text-slate-300">Palabras de Columnas (1-5)</h2>
            <div className="space-y-4">
              {colWords.map((word, i) => (
                <div key={`col-${i}`} className="flex items-center space-x-3">
                  <span className="bg-slate-800 text-slate-400 font-bold font-serif w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700">
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
