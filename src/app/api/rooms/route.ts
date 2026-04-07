import { NextResponse } from 'next/server';

// Usamos require para mantener la compatibilidad con el singleton de gameStore.js (CJS)
// Esto asegura que el API de Next.js vea las mismas salas que el servidor de Sockets.
const { rooms } = require('@/lib/game/gameStore');

export function GET() {
  try {
    // Obtenemos los IDs de las salas que están en memoria
    const roomIds = Array.from(rooms.keys());
    return NextResponse.json({ roomIds });
  } catch (error) {
    return NextResponse.json({ roomIds: [] });
  }
}
