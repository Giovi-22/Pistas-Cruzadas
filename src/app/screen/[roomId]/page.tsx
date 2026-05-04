"use client";

import React, { use, useState, useEffect } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { Board } from '@/components/game/Board/Board';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { LobbyView } from '@/components/game/Views/LobbyView';
import { WinnerView } from '@/components/game/Views/WinnerView';
import { Timer } from '@/components/game/Timer';
import { Card } from '@/components/ui/Card';
import { GuessModal } from '@/components/game/GuessModal';
import { AdminSidebar } from '@/components/game/AdminSidebar';
import { Gamepad2, Menu, Settings, X, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { QRCodeSVG } from 'qrcode.react';

export default function ScreenPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const { room, isReady, emit } = useRoom(roomId, 'Screen', 'Screen');
  const [isGuessModalOpen, setIsGuessModalOpen] = useState(false);
  const [isAdminSidebarOpen, setIsAdminSidebarOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number }>({ row: 0, col: 0 });
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const joinUrl = typeof window !== 'undefined' ? `${window.location.origin}/mobile/${roomId}` : '';

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  const handleExitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="h-screen bg-[#E7E5DA] text-slate-100 flex flex-col font-sans overflow-hidden relative">
      {/* Header */}
      {!isFullscreen && (
        <header className="bg-slate-900 border-b border-slate-800 py-2 px-4 shrink-0 flex items-center justify-between shadow-md z-10">
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
              className="p-2 bg-slate-800/50 border border-slate-700 hover:bg-slate-700"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </header>
      )}

      {/* Floating Exit Fullscreen Button */}
      {isFullscreen && (
        <button
          onClick={handleExitFullscreen}
          className="absolute top-4 right-4 z-50 p-3 bg-slate-900/50 hover:bg-slate-900 text-white/50 hover:text-white rounded-full backdrop-blur-md transition-all shadow-lg border border-white/10"
          title="Salir de Pantalla Completa"
        >
          <X className="w-6 h-6" />
        </button>
      )}

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
              isFullscreen={isFullscreen}
            />

            {/* Active Clue Panel */}
            <Card variant="default" padding="sm" glow className="w-full md:min-w-64 md:w-auto md:max-w-xl shrink-0 flex flex-col transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-300 border-b border-slate-800 pb-2 mb-4">Estado</h3>

              {room.activeClue ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-300">
                  {!room.activeClue.word ? (
                    <div className="flex flex-col items-center space-y-4 py-8 animate-pulse text-center w-full">
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
                        className="text-3xl font-display font-black uppercase tracking-wider text-center p-4 rounded-xl w-full border-2 break-words"
                        style={{
                          color: room.config.teams[room.activeClue.team].color,
                          backgroundColor: `${room.config.teams[room.activeClue.team].color}11`,
                          borderColor: `${room.config.teams[room.activeClue.team].color}44`
                        }}
                      >
                        {room.activeClue.word}
                      </div>
                      <p className="text-slate-400 text-center px-2">
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

              {isFullscreen && (
                <div className="mt-6 pt-6 border-t border-slate-800 animate-in slide-in-from-bottom duration-500">
                  <div className="text-center mb-3">
                    <span className="text-slate-500 uppercase tracking-[0.2em] text-[10px] font-bold">Puntuación</span>
                  </div>
                  <ScoreBoard room={room} />
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
        onOpenQR={() => setIsQRModalOpen(true)}
      />

      {/* QR Modal */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsQRModalOpen(false)} />
          <Card className="relative w-full max-w-sm bg-white p-8 flex flex-col items-center animate-in zoom-in duration-300 rounded-[2.5rem] shadow-2xl border-none">
            <button 
              onClick={() => setIsQRModalOpen(false)} 
              className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">¡Unite al Juego!</h2>
              <div className="mt-1 flex items-center justify-center gap-2">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Escaneá el código</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-inner border-[12px] border-slate-50 flex items-center justify-center">
               <QRCodeSVG 
                value={joinUrl} 
                size={220} 
                level="H" 
                includeMargin={false}
                fgColor="#0f172a"
              />
            </div>
            
            <div className="mt-8 w-full">
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col items-center shadow-lg">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-1">Código de Sala</span>
                <span className="text-3xl font-display font-black tracking-[0.2em]">{roomId}</span>
              </div>
            </div>
            
            <p className="mt-6 text-center text-slate-400 text-[11px] font-medium leading-relaxed px-4">
              Apuntá con la cámara de tu celular para entrar como jugador automáticamente.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
