"use client";

import { use } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { Board } from '@/components/game/Board/Board';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { LobbyView } from '@/components/game/Views/LobbyView';
import { WinnerView } from '@/components/game/Views/WinnerView';
import { Timer } from '@/components/game/Timer';
import { Card } from '@/components/ui/Card';
import { GuessModal } from '@/components/game/GuessModal';
import { AdminSidebar } from '@/components/game/AdminSidebar';
import { useState } from 'react';
import { Gamepad2, Menu, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ScreenPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { room, isReady, emit } = useRoom(roomId, 'Screen', 'Screen');
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number }>({ row: 0, col: 0 });

  if (!isReady || !room) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-2xl font-semibold">Conectando al tablero...</h2>
        </div>
      </div>
    );
  }

  const handleAdminGuess = (r: number, c: number) => {
    if (!room.activeClue || !room.activeClue.word) return;
    setSelectedCell({ row: r, col: c });
    setIsGuessModalOpen(true);
  };

  const handleConfirmGuess = () => {
    emit('submit_admin_guess', { row: selectedCell.row, col: selectedCell.col });
    setIsGuessModalOpen(false);
  };

  return (
    <div className="h-screen bg-[#E7E5DA] text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-6">
          <Card variant="default" padding="sm" className="px-4 py-1 border-slate-700 shadow-inner flex items-center space-x-3">
            <span className="text-slate-500 text-[14px] uppercase tracking-wider font-bold">Sala</span>
            <span className="text-xl font-display font-bold tracking-[0.1em] text-white leading-none">{roomId}</span>
          </Card>
        </div>

        <div className="flex items-center space-x-4">
          <ScoreBoard room={room} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdminSidebarOpen(true)}
            className="p-3 bg-slate-800/50 border border-slate-700 hover:bg-slate-700"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 overflow-hidden p-[2vh] flex flex-col items-center justify-center relative">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {room.status === 'lobby' ? (
          <LobbyView room={room} />
        ) : room.status === 'finished' ? (
          <WinnerView room={room} />
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-center gap-[4vh] w-full max-w-none relative z-10 px-[2vh]">
            {/* The Board Grid */}
            <Board
              room={room}
              canGuess={!!(room.activeClue && room.activeClue.word)}
              onGuess={handleAdminGuess}
            />

            {/* Active Clue Panel */}
            <Card variant="default" padding="sm" glow className="w-full md:w-64 shrink-0 flex flex-col">
              <h3 className="text-lg font-bold text-slate-300 border-b border-slate-800 pb-2 mb-4">Estado</h3>

              {room.activeClue ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
                  {!room.activeClue.word ? (
                    <div className="flex flex-col items-center space-y-4 py-8 animate-pulse text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/30">
                        <Gamepad2 className="w-8 h-8 text-amber-500" />
                      </div>
                      <div>
                        <span className="text-amber-500 font-bold uppercase tracking-widest text-sm block">Pensando Pista...</span>
                        <p className="text-slate-500 text-xs mt-1">Un jugador está redactando la pista.</p>
                        {room.timerEndTime && <Timer endTime={room.timerEndTime} variant="thinking" />}
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="text-slate-500 uppercase tracking-widest text-xs font-semibold">Pista Actual</span>
                      <div
                        className="text-3xl font-display font-black uppercase tracking-wider text-center p-4 rounded-xl w-full border-2"
                        style={{
                          color: room.config.teams[room.activeClue.team].color,
                          backgroundColor: `${room.config.teams[room.activeClue.team].color}11`,
                          borderColor: `${room.config.teams[room.activeClue.team].color}44`
                        }}
                      >
                        {room.activeClue.word}
                      </div>
                      <p className="text-slate-400 text-center">
                        El equipo <span className="font-bold" style={{ color: room.config.teams[room.activeClue.team].color }}>{room.config.teams[room.activeClue.team].name}</span> debe adivinar la interesección.
                      </p>
                      {room.timerEndTime && <Timer endTime={room.timerEndTime} />}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-50 space-y-4 py-12">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                    <Gamepad2 className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-center px-4">
                    Esperando que el <span className="font-bold" style={{ color: room.config.teams[room.currentTurn].color }}>{room.config.teams[room.currentTurn].name}</span> envíe la siguiente pista...
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}
      </main>

      <GuessModal
        isOpen={isGuessModalOpen}
        onClose={() => setIsGuessModalOpen(false)}
        onConfirm={handleConfirmGuess}
        room={room}
        row={selectedCell.row}
        col={selectedCell.col}
      />

      <AdminSidebar
        isOpen={isAdminSidebarOpen}
        onClose={() => setIsAdminSidebarOpen(false)}
        room={room}
        emit={emit}
      />
    </div>
  );
}
