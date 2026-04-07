"use client";

import { use, useState } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { Play, ShieldAlert, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { WinnerView } from '@/components/game/Views/WinnerView';
import { ClueGiverView } from '@/components/game/Views/ClueGiverView';
import { GuesserView } from '@/components/game/Views/GuesserView';
import { TeamColor } from '@/types/game';

export default function MobilePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { room, socketId, emit, isReady } = useRoom(roomId, 'Jugador', 'Player');
  const [clueWord, setClueWord] = useState('');

  if (!isReady || !room) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        Conectando...
      </div>
    );
  }

  const me = room.players[socketId];

  // Handlers
  const handleJoinTeam = (team: TeamColor) => emit('join_team', { team });
  const handleStartGame = () => emit('start_game', {});
  const handleRequestCoordinate = () => emit('request_coordinate', {});
  const handleSendClue = (e: React.FormEvent) => {
    e.preventDefault();
    if (clueWord.trim()) {
      emit('send_clue', { word: clueWord.trim() });
      setClueWord('');
    }
  };

  // --- LOBBY OR NO TEAM VIEW ---
  if (room.status === 'lobby' || !me?.team) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6 max-w-md mx-auto">
        <h1 className="text-4xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-8">
          Sala {roomId}
        </h1>

        <Card variant="default" padding="md" className="mb-8">
          <h2 className="text-lg font-semibold text-slate-300 mb-6 text-center">Unirse a un Equipo</h2>
          
          <div className="space-y-6">
            <TeamOption 
              active={me?.team === 'red'} 
              team="red" 
              config={room.config.teams.red}
              onSelect={() => handleJoinTeam('red')} 
            />
            <TeamOption 
              active={me?.team === 'blue'} 
              team="blue" 
              config={room.config.teams.blue}
              onSelect={() => handleJoinTeam('blue')} 
            />
          </div>
        </Card>

        {me?.team && room.status === 'lobby' && (
           <Button variant="primary" size="lg" className="w-full" onClick={handleStartGame} leftIcon={<Play />}>
             Iniciar Partida
           </Button>
        )}

        {me?.team && room.status === 'playing' && (
          <Badge variant="blue" size="lg" className="w-full py-4" glow>
            ¡Ya tienes equipo! Sincronizando...
          </Badge>
        )}
      </div>
    );
  }

  // --- FINISHED VIEW ---
  if (room.status === 'finished') {
    return <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center"><WinnerView room={room} /></div>;
  }

  // --- PLAYING STATE ---
  const isMyTurn = room.currentTurn === me.team;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans max-w-md mx-auto relative overflow-hidden overflow-y-auto">
      {/* Background glow based on my team */}
      <div 
        className="absolute top-0 inset-x-0 h-32 opacity-20 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `linear-gradient(to bottom, ${room.config.teams[me.team!].color}, transparent)` }}
      />

      <header className="p-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2">
           <div 
            className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
            style={{ backgroundColor: room.config.teams[me.team!].color, color: room.config.teams[me.team!].color }}
           />
           <span className="font-semibold text-slate-300 capitalize">{room.config.teams[me.team!].name}</span>
        </div>
        <Badge color={room.config.teams[room.currentTurn].color} glow>
          Turno {room.config.teams[room.currentTurn].name}
        </Badge>
      </header>

      <main className="flex-1 p-6 flex flex-col space-y-8 z-10">
         {!isMyTurn ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <ShieldAlert className="w-16 h-16 text-slate-700" />
              <h2 className="text-2xl font-bold text-slate-400">Espera tu turno</h2>
              <p className="text-slate-500">El equipo contrario está jugando.</p>
           </div>
         ) : !room.activeClue ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
               <div className="text-center">
                 <h2 className="text-3xl font-black text-white mb-2">¡Es tu turno!</h2>
                 <p className="text-slate-400">Pide una coordenada para dar una pista a tu equipo.</p>
               </div>
               <Button 
                  color={room.config.teams[me.team!].color} 
                  size="xl" 
                  className="w-full flex-col h-auto py-8" 
                  onClick={handleRequestCoordinate}
                  leftIcon={<Target className="w-12 h-12 mb-2" />}
               >
                 Pedir Coordenada
               </Button>
            </div>
         ) : room.activeClue.clueGiverId === socketId ? (
           <ClueGiverView 
              room={room} 
              clueWord={clueWord} 
              setClueWord={setClueWord} 
              handleSendClue={handleSendClue} 
              teamId={me.team as 'red' | 'blue'}
           />
         ) : (
           <GuesserView room={room} />
         )}
      </main>
    </div>
  );
}

function TeamOption({ team, config, active, onSelect }: { team: TeamColor, config: {name: string, color: string}, active: boolean, onSelect: () => void }) {
  const color = config.color;
  return (
    <div 
      className="p-4 border rounded-xl space-y-3 transition-colors"
      style={{ borderColor: `${color}44`, backgroundColor: `${color}11` }}
    >
      <h3 
        className="font-bold text-center uppercase tracking-widest text-sm"
        style={{ color: color }}
      >
        {config.name}
      </h3>
      <div className="flex justify-center">
        <Button 
          color={color}
          size="sm" 
          onClick={onSelect}
          className={!active ? 'opacity-40 grayscale' : ''}
        >
          {active ? '¡Seleccionado!' : `Unirme`}
        </Button>
      </div>
    </div>
  );
}
