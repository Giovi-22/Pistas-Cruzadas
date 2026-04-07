"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Gamepad2, Monitor, Smartphone } from 'lucide-react';

export default function Home() {
  const [roomId, setRoomId] = useState('');
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.roomIds && data.roomIds.length > 0) {
          setActiveRoomId(data.roomIds[0]);
          setRoomId(data.roomIds[0]);
        }
      })
      .catch(err => console.error("Error fetching rooms:", err));
  }, []);

  const handleCreateRoom = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let newRoomId = '';
    for (let i = 0; i < 4; i++) {
      newRoomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    router.push(`/config/${newRoomId}`);
  };

  const handleJoinMobile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = roomId.trim();
    if (cleanId.length > 0) {
      router.push(`/mobile/${cleanId}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-purple-500/30">
      <div className="mb-12 flex flex-col items-center space-y-4">
        <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/30">
          <Gamepad2 size={64} className="text-purple-400" />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-center">
          Pistas Cruzadas
        </h1>
        <p className="text-slate-400 text-lg max-w-md text-center">
          Cooperación y deducción en tiempo real.
        </p>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 relative">
        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent -translate-x-1/2" />

        {/* Create or Screen Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl hover:border-blue-500/50 transition-colors duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <Monitor className="text-blue-400" size={32} />
            <h2 className="text-2xl font-bold text-slate-100">Pantalla Principal</h2>
          </div>
          
          {activeRoomId ? (
            <>
              <p className="text-slate-400 mb-8 h-12"> Hay una partida activa. </p>
              <button
                onClick={() => router.push(`/screen/${activeRoomId}`)}
                className="w-full relative group overflow-hidden rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Ver Tablero Actual ({activeRoomId})</span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </>
          ) : (
            <>
              <p className="text-slate-400 mb-8 h-12"> Inicia una nueva partida en esta PC. </p>
              <button
                onClick={handleCreateRoom}
                className="w-full relative group overflow-hidden rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Crear Tablero</span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-800 shadow-2xl hover:border-purple-500/50 transition-colors duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <Smartphone className="text-purple-400" size={32} />
            <h2 className="text-2xl font-bold text-slate-100">Jugador Móvil</h2>
          </div>
          <p className="text-slate-400 mb-8 h-12"> Join the group to send clues. </p>
          <form onSubmit={handleJoinMobile} className="flex flex-col gap-4 relative">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="CÓDIGO"
              className="w-full bg-slate-950/50 border-2 border-slate-700/50 rounded-xl px-6 py-4 uppercase text-center text-2xl font-bold tracking-[0.5em] focus:border-purple-500 focus:outline-none transition-colors"
              maxLength={4}
            />
            <button
              type="submit"
              disabled={roomId.trim().length === 0}
              className={`w-full relative group overflow-hidden rounded-xl bg-purple-600 px-8 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 ${activeRoomId ? 'ring-2 ring-purple-400' : ''}`}
            >
              <span className="relative z-10">
                {activeRoomId && roomId === activeRoomId ? 'Unirse a Partida Actual' : 'Conectar al Juego'}
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
