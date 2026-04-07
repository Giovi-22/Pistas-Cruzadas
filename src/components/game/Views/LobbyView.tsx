"use client";

import React, { useState, useEffect } from 'react';
import { Users, Settings } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { Room } from '@/types/game';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface LobbyViewProps {
  room: Room;
}

export const LobbyView = ({ room }: LobbyViewProps) => {
  const playersCount = Object.keys(room.players).length;
  const [joinUrl, setJoinUrl] = useState('');
  
  useEffect(() => {
    fetch('/api/ip')
      .then(res => res.json())
      .then(data => {
        const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        const ip = isLocalhost ? data.ip : window.location.hostname;
        const port = window.location.port ? `:${window.location.port}` : '';
        setJoinUrl(`http://${ip}${port}/mobile/${room.id}`);
      })
      .catch(() => {
        setJoinUrl(`${window.location.origin}/mobile/${room.id}`);
      });
  }, [room.id]);

  return (
    <Card variant="default" padding="lg" glow className="max-w-4xl w-full flex flex-col md:flex-row items-center justify-center gap-12 relative z-10 transition-all">
      {/* QR Code Section */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.1)] flex flex-col items-center shrink-0 hover:scale-105 transition-transform duration-300">
         {joinUrl ? (
           <QRCodeSVG value={joinUrl} size={220} bgColor={"#ffffff"} fgColor={"#0f172a"} level={"Q"} />
         ) : (
           <div className="w-[220px] h-[220px] bg-slate-200 animate-pulse rounded-xl" />
         )}
         <p className="mt-4 font-bold text-slate-800 uppercase tracking-widest text-sm text-center">Unirse Rápidamente</p>
      </div>

      <div className="text-center md:text-left flex flex-col items-center md:items-start flex-1">
        <div className="flex items-center gap-4 mb-4">
          <Users className="w-12 h-12 text-blue-500 opacity-80" />
          <h2 className="text-5xl font-black text-white">Sala <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-mono tracking-widest">{room.id}</span></h2>
        </div>
        
        <p className="text-xl text-slate-400 mb-8 max-w-md">
          Apunta la cámara de tu celular al código QR o ingresa a este enlace:
          <br/>
          <span className="font-mono text-cyan-400 font-bold block mt-3 px-4 py-2 bg-slate-800/50 rounded-lg inline-block border border-slate-700">{joinUrl || 'Cargando...'}</span>
        </p>
        
        <div className="bg-slate-800/50 px-8 py-4 rounded-2xl border border-slate-700/50 inline-flex items-center gap-6">
          <div className="text-slate-500 uppercase font-bold text-sm tracking-widest text-left leading-tight">
            Jugadores<br/>Conectados
          </div>
          <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {Math.max(0, playersCount - 1)}
          </div>
        </div>

      </div>
    </Card>
  );
};
