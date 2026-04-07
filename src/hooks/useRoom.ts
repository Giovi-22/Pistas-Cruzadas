"use client";

import { useEffect, useState, useCallback } from 'react';
import { getSocket } from '@/lib/socketClient';
import { Room } from '@/types/game';

interface useRoomReturn {
  room: Room | null;
  socketId: string;
  emit: (event: string, data: any) => void;
  isReady: boolean;
}

export const useRoom = (roomId: string, name: string = 'Jugador'): useRoomReturn => {
  const [room, setRoom] = useState<Room | null>(null);
  const [socketId, setSocketId] = useState<string>('');
  const [isReady, setIsReady] = useState(false);

  const emit = useCallback((event: string, data: any) => {
    getSocket().emit(event, { ...data, roomId });
  }, [roomId]);

  useEffect(() => {
    const socket = getSocket();
    
    const synchronize = () => {
      setSocketId(socket.id || '');
      socket.emit('join_room', { roomId, name });
    };

    socket.on('connect', synchronize);
    
    if (socket.connected) {
      synchronize();
    }

    socket.on('room_state', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      setIsReady(true);
    });

    return () => {
      socket.off('room_state');
      socket.off('connect');
    };
  }, [roomId, name]);

  return { room, socketId, emit, isReady };
};
