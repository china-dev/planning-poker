import { Server, Socket } from "socket.io";
import { utils } from "./utils/useUtils";

const { getRandomAlertMessage } = utils();

type Player = {
  userId: string;
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

type CallbackResponse =
  | { success: true; message: string; room: Room }
  | { success: false; message: string };

type CallbackPlayers =
  | { success: true; message: string; players: Players }
  | { success: false; message: string };

const rooms: Record<string, Room> = {};
const userSocketMap = new Map<string, string>(); // userId -> socket.id
const disconnectTimeouts = new Map<string, NodeJS.Timeout>(); // userId -> timeout

export function setupRooms(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    const mapUserToSocket = (userId: string, socketId: string) => {
      userSocketMap.set(userId, socketId);
    };

    const clearDisconnectTimeout = (userId: string) => {
      const timeout = disconnectTimeouts.get(userId);
      if (timeout) {
        clearTimeout(timeout);
        disconnectTimeouts.delete(userId);
      }
    };

    socket.on(
      "createRoom",
      (
        { userId, userName, roomId, roomName }: { userId: string; userName: string; roomId: string; roomName: string },
        callback: (response: CallbackResponse) => void
      ) => {
        if (rooms[roomId]) {
          return callback({ success: false, message: "Sala já existe." });
        }

        const room: Room = {
          roomName,
          players: {
            [userId]: {
              userId,
              userName,
              isAdmin: true,
            },
          },
          voteReveal: false,
        };

        rooms[roomId] = room;
        mapUserToSocket(userId, socket.id);
        clearDisconnectTimeout(userId);
        socket.join(roomId);

        callback({
          success: true,
          message: "Sala criada com sucesso.",
          room,
        });
      }
    );

    socket.on(
      "joinedPlayer",
      (
        { userId, userName, roomId, isSpectator }: { userId: string; userName: string; roomId: string; isSpectator: boolean },
        callback: (response: CallbackResponse) => void
      ) => {
        const room = rooms[roomId];
        if (!room) {
          return callback({ success: false, message: "Sala não encontrada." });
        }

        room.players[userId] = {
          userId,
          userName,
          isAdmin: false,
          isSpectator,
        };

        mapUserToSocket(userId, socket.id);
        clearDisconnectTimeout(userId);
        socket.join(roomId);

        io.to(roomId).emit("onJoinedPlayer", {
          success: true,
          message: getRandomAlertMessage("onJoin", userName),
          players: room.players,
        });

        callback({
          success: true,
          message: "Entrou na sala com sucesso.",
          room,
        });
      }
    );

    socket.on(
      "votePlayer",
      (
        { roomId, vote, userId }: { roomId: string; vote: number; userId: string },
        callback: (response: CallbackResponse) => void
      ) => {
        const room = rooms[roomId];
        const player = room?.players?.[userId];

        if (!room) {
          return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
        }
        if (!player) {
          return callback({ success: false, message: "Jogador não está na sala." });
        }
        if (player.isSpectator) {
          return callback({ success: false, message: "Espectadores não podem votar." });
        }

        player.vote = vote;

        io.to(roomId).emit("playerVoted", {
          userId,
          userName: player.userName,
          vote,
          message: getRandomAlertMessage("onVote", player.userName),
        });

        callback({
          success: true,
          message: "Voto registrado.",
          room,
        });
      }
    );

    socket.on("getPlayers", (roomId: string, callback: (response: CallbackPlayers) => void) => {
      const room = rooms[roomId];
      
      console.log('to aqui', roomId);

      if (!callback || typeof callback !== 'function') {
        console.warn(`Callback não fornecido para getPlayers na sala ${roomId}`);
        return;
      }

      if (!room) {
        return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
      }

      callback({
        success: true,
        message: "Lista de jogadores.",
        players: room.players,
      });
    });

    socket.on("voteRevealed", (roomId: string, callback: (response: CallbackResponse) => void) => {
      const room = rooms[roomId];

      if (!room) {
        return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
      }

      room.voteReveal = true;

      io.to(roomId).emit("onVoteRevealed", {
        success: true,
        message: "Votos revelados!",
      });

      callback({
        success: true,
        message: "Votos revelados.",
        room,
      });
    });

    socket.on("restartVote", (roomId: string, callback: (response: CallbackPlayers) => void) => {
      const room = rooms[roomId];

      if (!room) {
        return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
      }

      Object.values(room.players).forEach((player) => {
        delete player.vote;
      });

      room.voteReveal = false;

      io.to(roomId).emit("onVotesReset", {
        success: true,
        players: room.players,
        message: "Todos os votos foram removidos.",
      });

      callback({
        success: true,
        message: "Votos resetados.",
        players: room.players,
      });
    });

    socket.on("disconnect", () => {
      const userId = [...userSocketMap.entries()].find(([_, sid]) => sid === socket.id)?.[0];

      if (!userId) {
        console.log(`❌ Disconnected: ${socket.id} (userId desconhecido)`);
        return;
      }

      const timeout = setTimeout(() => {
        for (const roomId in rooms) {
          const room = rooms[roomId];

          if (room.players[userId]) {
            const userName = room.players[userId].userName || "Jogador";
            delete room.players[userId];
            userSocketMap.delete(userId);

            io.to(roomId).emit("playerDisconnected", {
              success: true,
              userId,
              message: getRandomAlertMessage("onDisconnect", userName),
              room,
            });

            if (Object.keys(room.players).length === 0) {
              delete rooms[roomId];
            }

            break;
          }
        }
        disconnectTimeouts.delete(userId);
        console.log(`❌ Usuário ${userId} removido da sala após desconectar.`);
      }, 7000); // Timeout de 5 segundos

      disconnectTimeouts.set(userId, timeout);
      console.log(`⚠️ Disconnected: ${socket.id} aguardando reconexão (userId: ${userId})`);
    });
  });
}
