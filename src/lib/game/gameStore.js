/**
 * In-memory game store
 */

const rooms = new Map();

function createRoom(roomId) {
  const newRoom = {
    id: roomId,
    players: {},
    config: {
      rowWords: ["Animales", "Países", "Comidas", "Deportes", "Películas"],
      colWords: ["Colores", "Profesiones", "Vehículos", "Marcas", "Lugares"],
      turnDurationSeconds: 60,
      maxScore: 5
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

function joinRoom(roomId, socketId, name) {
  let room = getRoom(roomId);
  if (!room) {
    room = createRoom(roomId);
  }
  
  room.players[socketId] = {
    socketId,
    name: name || `Player ${socketId.substr(0,4)}`,
    team: null
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
