import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(typeof window !== 'undefined' ? window.location.origin : '');
  }
  return socket;
};
