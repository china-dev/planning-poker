import { Server, Socket } from "socket.io";
import { utils } from "./utils/useUtils";

const { getRandomAlertMessage } = utils();

export function setupRooms(io: Server) {
  type Player = {
    userName: string;
    isAdmin: boolean;
    isSpectator?: boolean;
    vote?: number;
  };

  type Players = Record<string, Player>;

  type Room = {
    roomName: string;
    players: Players;
    voteReveal?: boolean;
  };

  const rooms: Record<string, Room> = {};

  type RoomData = {
    roomName: string;
    players: Players;
    voteReveal?: boolean;
  };

  type CallbackResponse =
    | { success: true; message: string; room: RoomData }
    | { success: false; message: string };

  type CallbackPlayers =
    | { success: true; message: string; players: Players }
    | { success: false; message: string };

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 New connection: ${socket.id}`);

    // Criar uma nova sala
    socket.on(
      "createRoom",
      (
        data: { userName: string; roomName: string; roomId: string },
        callback: (response: CallbackResponse) => void
      ) => {
        const { userName, roomName, roomId } = data;

        if (rooms[roomId]) {
          return callback({ success: false, message: "Sala já existe." });
        }

        rooms[roomId] = {
          roomName,
          players: {
            [socket.id]: {
              userName,
              isAdmin: true
            }
          }
        };

        socket.join(roomId);

        return callback({
          success: true,
          message: "Sala criada com sucesso.",
          room: rooms[roomId]
        });
      }
    );

    // Jogador entra em uma sala
    socket.on(
      "joinedPlayer",
      (
        data: { userName: string; roomId: string; isSpectator: boolean },
        callback: (response: CallbackResponse) => void
      ) => {
        const { userName, roomId, isSpectator } = data;
        const room = rooms[roomId];

        if (!room) {
          return callback({ success: false, message: "Sala não encontrada." });
        }

        room.players[socket.id] = {
          userName,
          isAdmin: false,
          isSpectator
        };

        io.to(roomId).emit("onJoinedPlayer", {
          success: true,
          message: getRandomAlertMessage('onJoin', userName),
          players: room.players
        });

        socket.join(roomId);

        return callback({
          success: true,
          message: "Entrou na sala com sucesso.",
          room
        });
      }
    );

    // Jogador envia um voto
    socket.on(
      "votePlayer",
      (
        data: { roomId: string; vote: number },
        callback: (response: CallbackResponse) => void
      ) => {
        const { roomId, vote } = data;
        const room = rooms[roomId];
        const player = room?.players?.[socket.id];

        if (!room) {
          return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
        }

        if (!player) {
          return callback({ success: false, message: `Jogador não está na sala.` });
        }

        if (player.isSpectator) {
          return callback({ success: false, message: "Espectadores não podem votar." });
        }

        player.vote = vote;

        io.to(roomId).emit("playerVoted", {
          socketId: socket.id,
          message: getRandomAlertMessage('onVote', player.userName),
          userName: player.userName,
          vote
        });

        return callback({
          success: true,
          message: "Voto registrado.",
          room
        });
      }
    );

    // Retorna os jogadores da sala
    socket.on("getPlayers", (roomId: string, callback: (response: CallbackPlayers) => void) => {
      const room = rooms[roomId];

      if (!room) {
        return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
      }

      return callback({
        success: true,
        message: "Lista de jogadores.",
        players: room.players
      });
    });

    // Revelar votos
    socket.on("voteRevelead", (roomId: string, callback: (response: CallbackResponse) => void) => {
      const room = rooms[roomId];

      if (!room) {
        return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
      }

      room.voteReveal = true;

      io.to(roomId).emit("onVoteRevelead", {
        success: true,
        socketId: socket.id,
        message: "Votos revelados!"
      });

      return callback({
        success: true,
        message: "Votos revelados.",
        room
      });
    });

    // Reiniciar votação
    socket.on("restartVote", (roomId: string, callback: (response: CallbackPlayers) => void) => {
      const room = rooms[roomId];

      if (!room) {
        return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
      }

      Object.values(room.players).forEach(player => {
        if (player.vote !== undefined) {
          delete player.vote;
        }
      });

      io.to(roomId).emit("onVotesReset", {
        success: true,
        players: room.players,
        message: "Todos os votos foram removidos.",
      });

      return callback({
        success: true,
        message: "Todos os votos foram removidos.",
        players: room.players
      });
    });

    // Desconectar e limpar jogador da sala
    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];

        if (room.players[socket.id]) {
          delete room.players[socket.id];

          if (Object.keys(room.players).length === 0) {
            delete rooms[roomId];
          } else {
            io.to(roomId).emit("playerDisconnected", {
              socketId: socket.id
            });
          }

          break;
        }
      }

      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
}
