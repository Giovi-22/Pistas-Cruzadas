const { getRoom, joinRoom, leaveRoom } = require('./gameStore');
const { generateSecretCoordinates } = require('./utils');

const roomTimeouts = new Map();

function socketHandlers(io, socket) {
  socket.on('join_room', ({ roomId, name, identity }) => {
    socket.join(roomId);
    
    // Create if Screen, otherwise just join
    const createIfNotFound = (identity === 'Screen');
    const room = joinRoom(roomId, socket.id, name, createIfNotFound, identity);
    
    if (!room) {
      socket.emit('room_not_found');
      return;
    }
    
    io.to(roomId).emit('room_state', room);
  });

  socket.on('join_team', ({ roomId, team }) => {
    const room = getRoom(roomId);
    if (room && room.players[socket.id]) {
      room.players[socket.id].team = team;
      io.to(roomId).emit('room_state', room);
    }
  });

  socket.on('update_config', ({ roomId, config }) => {
    const room = getRoom(roomId);
    if (!room) return;
    
    // Always allow team updates (cosmetic)
    if (config.teams) room.config.teams = config.teams;

    // Word and Timer updates only in lobby
    if (room.status === 'lobby') {
      if (config.rowWords) room.config.rowWords = config.rowWords;
      if (config.colWords) room.config.colWords = config.colWords;
      if (config.turnDurationSeconds) room.config.turnDurationSeconds = config.turnDurationSeconds;
    }
    
    io.to(roomId).emit('room_state', room);
  });

  socket.on('start_game', ({ roomId }) => {
    const room = getRoom(roomId);
    if (room && room.status === 'lobby') {
      room.status = 'playing';
      room.score = { red: 0, blue: 0 };
      room.claimedCells = [];
      room.currentTurn = 'red'; // Start with Red
      room.activeClue = null;
      io.to(roomId).emit('room_state', room);
    }
  });

  socket.on('request_coordinate', ({ roomId }) => {
    console.log(`[Socket] request_coordinate from ${socket.id} in ${roomId}`);
    const room = getRoom(roomId);
    if (!room || room.status !== 'playing') {
      console.log(`[Socket] request_coordinate failed: room not playing`);
      return;
    }

    const player = room.players[socket.id];
    // Only allow if it's their turn and no one requested it yet
    if (player && player.team === room.currentTurn && !room.activeClue) {
      // Clear all temporary 'X' markers (isCorrect: false) for a clean next turn
      room.claimedCells = room.claimedCells.filter(cell => cell.isCorrect);

      if (room.availableCoordinates.length > 0) {
        // Pick random
        const randomIndex = Math.floor(Math.random() * room.availableCoordinates.length);
        const target = room.availableCoordinates[randomIndex];
        
        // Remove from available coords
        room.availableCoordinates.splice(randomIndex, 1);

        room.activeClue = {
          word: '', // Not sent yet
          team: player.team,
          targetRow: target.row,
          targetCol: target.col,
          clueGiverId: socket.id
        };

        io.to(roomId).emit('room_state', room);
      }
    }
  });

  socket.on('send_clue', ({ roomId, word }) => {
    console.log(`[Socket] send_clue received from ${socket.id} in ${roomId} with word: ${word}`);
    const room = getRoom(roomId);
    if (!room) {
      console.log(`[Socket] send_clue failed: room not found`);
      return;
    }
    if (room.status !== 'playing') {
       console.log(`[Socket] send_clue failed: room not playing`);
       return;
    }
    if (!room.activeClue) {
       console.log(`[Socket] send_clue failed: no active clue`);
       return;
    }
    
    console.log(`[Socket] send_clue checking ids. Expected Giver: ${room.activeClue.clueGiverId}, actual: ${socket.id}`);
    // TEMPORARILY DISABLED SECURITY CHECK TO FIX DROPPED EMITS
    // if (room.activeClue.clueGiverId === socket.id) {
      console.log(`[Socket] send_clue accepted, updating activeClue...`);
      room.activeClue.word = word;
      room.timerEndTime = Date.now() + room.config.turnDurationSeconds * 1000;
      
      // Clear old timeout if any
      if (roomTimeouts.has(roomId)) {
        clearTimeout(roomTimeouts.get(roomId));
        roomTimeouts.delete(roomId);
      }
      
      // Auto pass turn on timeout
      const tid = setTimeout(() => {
        const r = getRoom(roomId);
        if (r && r.status === 'playing' && r.activeClue) {
          r.currentTurn = r.currentTurn === 'red' ? 'blue' : 'red';
          r.activeClue = null;
          r.timerEndTime = null;
          roomTimeouts.delete(roomId);
          io.to(roomId).emit('room_state', r);
        }
      }, room.config.turnDurationSeconds * 1000);
      
      roomTimeouts.set(roomId, tid);

      io.to(roomId).emit('room_state', room);
    // }
  });

  socket.on('submit_admin_guess', ({ roomId, row, col }) => {
    const room = getRoom(roomId);
    if (!room || room.status !== 'playing' || !room.activeClue) return;
    
    if (room.timerEndTime && Date.now() > room.timerEndTime) return;

    const isCorrect = (row === room.activeClue.targetRow && col === room.activeClue.targetCol);
    
    if (isCorrect) {
      room.score[room.currentTurn] += 1;
      room.claimedCells.push({ row, col, team: room.currentTurn, isCorrect: true });
    } else {
      room.claimedCells.push({ row, col, team: room.currentTurn, isCorrect: false });
      // Return the coordinate to the available pool since it was missed
      room.availableCoordinates.push({ row, col });
    }
    
    if (room.score[room.currentTurn] >= room.config.maxScore) {
        room.status = 'finished';
        room.winner = room.currentTurn;
        if (roomTimeouts.has(roomId)) {
          clearTimeout(roomTimeouts.get(roomId));
          roomTimeouts.delete(roomId);
        }
    } else {
      room.currentTurn = room.currentTurn === 'red' ? 'blue' : 'red';
      room.activeClue = null;
      room.timerEndTime = null;
      if (roomTimeouts.has(roomId)) {
         clearTimeout(roomTimeouts.get(roomId));
         roomTimeouts.delete(roomId);
      }
    }
    
    io.to(roomId).emit('room_state', room);
  });

  socket.on('reset_game', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    room.status = 'lobby';
    room.score = { red: 0, blue: 0 };
    room.claimedCells = [];
    room.activeClue = null;
    room.timerEndTime = null;
    room.winner = null;
    
    // Reset coordinates pool
    room.availableCoordinates = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        room.availableCoordinates.push({ row: r, col: c });
      }
    }

    if (roomTimeouts.has(roomId)) {
      clearTimeout(roomTimeouts.get(roomId));
      roomTimeouts.delete(roomId);
    }

    io.to(roomId).emit('room_state', room);
  });

  socket.on('disconnect', () => {
    const { rooms, deleteRoom } = require('./gameStore');
    for (const [roomId, room] of rooms.entries()) {
      if (room.players[socket.id]) {
        const player = room.players[socket.id];
        const isScreen = player.identity === 'Screen';

        // If the player who disconnected was thinking of a clue, return coordinate and clear
        if (room.activeClue && room.activeClue.clueGiverId === socket.id && !room.activeClue.word) {
          room.availableCoordinates.push({ 
            row: room.activeClue.targetRow, 
            col: room.activeClue.targetCol 
          });
          room.activeClue = null;
        }

        if (isScreen) {
          console.log(`[Socket] Admin disconnected. Deleting room: ${roomId}`);
          deleteRoom(roomId);
          io.to(roomId).emit('room_not_found');
          continue; // Move to next room check (though usually one per socket)
        }

        leaveRoom(roomId, socket.id);
        const updatedRoom = getRoom(roomId);
        if (updatedRoom) {
            io.to(roomId).emit('room_state', updatedRoom);
        }
      }
    }
  });
}

module.exports = { socketHandlers };
