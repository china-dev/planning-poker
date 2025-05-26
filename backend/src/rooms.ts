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
type Room = { roomName: string; players: Players; voteReveal?: boolean };

type CallbackResponse =
  | { success: true; message: string; room: Room }
  | { success: false; message: string };
type CallbackPlayers =
  | { success: true; message: string; players: Players }
  | { success: false; message: string };

const rooms: Record<string, Room> = {};


type ConnectionInfo = { socketId: string; tabId: string };
const userConnectionMap = new Map<string, ConnectionInfo>();

const disconnectTimeouts = new Map<string, NodeJS.Timeout>();

export function setupRooms(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Connected: ${socket.id}`);

    const clearDisconnect = (userId: string) => {
      const t = disconnectTimeouts.get(userId);
      if (t) {
        clearTimeout(t);
        disconnectTimeouts.delete(userId);
      }
    };

    socket.on(
      "createRoom",
      (
        { userId, userName, roomId, roomName, tabId }: 
        { userId: string; userName: string; roomId: string; roomName: string; tabId: string },
        cb: (res: CallbackResponse) => void
      ) => {
        if (rooms[roomId]) {
          return cb({ success: false, message: "Sala já existe." });
        }
        // Mesma lógica de múltiplas abas:
        const prev = userConnectionMap.get(userId);
        if (prev && prev.tabId !== tabId) {
          io.to(prev.socketId).emit("onMultipleTabs", {
            success: true,
            message: "Você abriu a aplicação em outra aba.",
          });
          io.sockets.sockets.get(prev.socketId)?.disconnect();
        }

        rooms[roomId] = {
          roomName,
          players: {
            [userId]: { userId, userName, isAdmin: true }
          },
          voteReveal: false,
        };

        userConnectionMap.set(userId, { socketId: socket.id, tabId });
        clearDisconnect(userId);
        socket.join(roomId);

        cb({ success: true, message: "Sala criada com sucesso.", room: rooms[roomId] });
      }
    );

    socket.on(
      "joinedPlayer",
      (
        { userId, userName, roomId, isSpectator, isAdmin, tabId }:
        { userId: string; userName: string; roomId: string; isSpectator: boolean; isAdmin: boolean; tabId: string },
        cb: (res: CallbackResponse) => void
      ) => {
        const room = rooms[roomId];
        if (!room) {
          return cb({ success: false, message: "Sala não encontrada." });
        }

        const prev = userConnectionMap.get(userId);
        if (prev && prev.tabId !== tabId) {
          io.to(prev.socketId).emit("onMultipleTabs", {
            success: true,
            message: "Você abriu a aplicação em outra aba.",
          });
          io.sockets.sockets.get(prev.socketId)?.disconnect();
        }

        room.players[userId] = { userId, userName, isAdmin, isSpectator };

        userConnectionMap.set(userId, { socketId: socket.id, tabId });
        clearDisconnect(userId);
        socket.join(roomId);

        io.to(roomId).emit("onJoinedPlayer", {
          success: true,
          message: getRandomAlertMessage("onJoin", userName),
          players: room.players,
        });

        cb({ success: true, message: "Entrou na sala com sucesso.", room });
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
      const entry = Array.from(userConnectionMap.entries())
        .find(([, info]) => info.socketId === socket.id);
      if (!entry) {
        console.log(`❌ Disconnected ${socket.id} (sem userId)`);
        return;
      }
      const [userId] = entry;
      const timeout = setTimeout(() => {
        // remove jogador da sala...
        userConnectionMap.delete(userId);
        disconnectTimeouts.delete(userId);
      }, 7000);
      disconnectTimeouts.set(userId, timeout);
      console.log(`⚠️ ${socket.id} aguardando reconexão de ${userId}`);
    });
  });
}
