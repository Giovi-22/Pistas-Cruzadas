"use client";

import React from 'react';
import { Card } from '../../ui/Card';

interface GuesserViewProps {
  room: any;
}

export const GuesserView = ({ room }: GuesserViewProps) => {
  if (!room.activeClue.word) {
     return (
       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
         <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mb-4" />
         <h2 className="text-2xl font-bold text-amber-500">Compañero Pensando</h2>
         <p className="text-slate-400">Un miembro de tu equipo está escribiendo la pista secreta. ¡Prepárate!</p>
       </div>
     );
  }

  const isRed = room.currentTurn === 'red';

  return (
    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Card variant={isRed ? 'red' : 'blue'} padding="none" glow className="text-center overflow-hidden">
         <div className={`h-2 bg-gradient-to-r ${isRed ? 'from-rose-600 to-rose-400' : 'from-cyan-600 to-cyan-400'}`} />
         <div className="p-8">
           <h3 className="text-slate-400 uppercase font-bold text-xs tracking-[0.3em] mb-4">Pista Secreta Recibida</h3>
           <div className={`text-6xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-br ${isRed ? 'from-rose-400 to-rose-600' : 'from-cyan-400 to-cyan-600'}`}>
             "{room.activeClue.word}"
           </div>
         </div>
      </Card>

      <Card variant="amber" padding="md" className="border-amber-500/30 flex flex-col items-center text-center space-y-4">
         <h4 className="font-bold text-amber-400 text-xl">Fase de Debate</h4>
         <p className="text-slate-300">
           Discutan en equipo y lleguen a un acuerdo sobre qué coordenada coincide con la pista.
         </p>
         <p className="text-slate-400 italic text-sm">
           Luego digan la coordenada en voz alta para que el Administrador la seleccione en el Tablero Principal.
         </p>
      </Card>
    </div>
  );
}
