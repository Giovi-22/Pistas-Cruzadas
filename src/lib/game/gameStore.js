/**
 * In-memory game store
 */

// We use a global variable to persist the Map across hot reloads in Next.js
// and to share it between the Socket.IO server and API routes.
if (!global.rooms) {
  global.rooms = new Map();
}
const rooms = global.rooms;

function createRoom(roomId) {
  const newRoom = {
    id: roomId,
    players: {},
    config: {
      rowWords: ["Discusión", "Rutina", "Vinculo", "Unión", "Compromiso"],
      colWords: ["Dinero", "Tiempo", "Inicio", "Resultado", "Construcción"],
      turnDurationSeconds: 60,
      thinkingTimerEnabled: false,
      thinkingDurationSeconds: 30,
      maxScore: 5,
      teams: {
        red: { name: "Equipo 1", color: "#f472b6" },
        blue: { name: "Equipo 2", color: "#22d3ee" }
      }
    },
    status: 'lobby',
    currentTurn: 'red',
    claimedCells: [],
    activeClue: null,
    score: { red: 0, blue: 0 },
    timerEndTime: null,
    turnTimeoutId: null,
    availableCoordinates: [],
    winner: null,
  };

  // Fill all 25 coordinates
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      newRoom.availableCoordinates.push({ row: r, col: c });
    }
  }

  rooms.set(roomId, newRoom);
  return newRoom;
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function deleteRoom(roomId) {
  rooms.delete(roomId);
}

function joinRoom(roomId, socketId, name, createIfNotFound = false, identity = 'Player') {
  let room = getRoom(roomId);
  if (!room) {
    if (createIfNotFound) {
      room = createRoom(roomId);
    } else {
      return null;
    }
  }

  room.players[socketId] = {
    socketId,
    name: name || `Player ${socketId.substr(0, 4)}`,
    team: null,
    identity
  };

  return room;
}

function leaveRoom(roomId, socketId) {
  const room = getRoom(roomId);
  if (room) {
    delete room.players[socketId];
    if (Object.keys(room.players).length === 0) {
      // Auto-delete empty rooms after some time, or immediately
      deleteRoom(roomId);
      return null;
    }
  }
  return room;
}

module.exports = {
  rooms,
  createRoom,
  getRoom,
  deleteRoom,
  joinRoom,
  leaveRoom
};
