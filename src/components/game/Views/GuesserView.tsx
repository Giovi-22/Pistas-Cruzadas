"use client";

import React from 'react';
import { Card } from '../../ui/Card';

interface GuesserViewProps {
  room: any;
}

export const GuesserView = ({ room }: GuesserViewProps) => {
  const teamId = room.currentTurn;
  const teamConfig = room.config.teams[teamId];
  const color = teamConfig.color;

  if (!room.activeClue.word) {
     return (
       <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
         <div 
           className="w-16 h-16 border-4 border-slate-700 rounded-full animate-spin mb-4" 
           style={{ borderTopColor: color }}
         />
         <h2 className="text-2xl font-bold" style={{ color: color }}>Compañero Pensando</h2>
         <p className="text-slate-400">Un miembro de tu equipo está escribiendo la pista secreta. ¡Prepárate!</p>
       </div>
     );
  }

  return (
    <div className="flex-1 flex flex-col space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Card color={color} padding="none" glow className="text-center overflow-hidden">
         <div 
           className="h-2" 
           style={{ background: `linear-gradient(to right, ${color}, ${color}88)` }}
         />
         <div className="p-8 w-full overflow-hidden">
           <h3 className="text-slate-400 uppercase font-bold text-xs tracking-[0.3em] mb-4">Pista Secreta Recibida</h3>
           <div 
             className="text-6xl font-display font-black uppercase tracking-widest text-transparent bg-clip-text break-words"
             style={{ backgroundImage: `linear-gradient(to bottom right, ${color}, #ffffff)` }}
           >
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
