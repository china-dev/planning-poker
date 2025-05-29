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

type Themes = {
  name: string;
  mostVoted: number;
  average: number;
};

type Players = Record<string, Player>;

type Room = { 
  roomName: string; 
  players: Players; 
  voteReveal?: boolean;
  initVotes?: boolean;
  themes: Themes[];
};

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
    // console.log(`🔌 Connected: ${socket.id}`);

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
          themes: []
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
          success: true,
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
      room.initVotes = false;

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

    socket.on(
      "InitVotes",
      (
        { roomId, theme }: { roomId: string; theme: { name: string } },
        callback: (response: CallbackResponse) => void
      ) => {
        const room = rooms[roomId];
        if (!room) {
          return callback({ success: false, message: `Sala ${roomId} não encontrada.` });
        }

        room.themes.push({
          name: theme.name,
          mostVoted: 0,
          average: 0
        });

        room.initVotes = true;

        io.to(roomId).emit("onInitVotes", {
          success: true,
          themes: room.themes,
          message: "Tema da sala atualizado."
        });

        callback({
          success: true,
          message: "Tema Definido.",
          room
        });
      }
    );

    socket.on(
      "leaveRoom",
      (
        { userId, roomId }: { userId: string; roomId: string },
        cb: (res: CallbackResponse) => void
      ) => {
        const room = rooms[roomId];
        if (!room) {
          return cb({ success: false, message: "Sala não encontrada." });
        }

        const player = room.players[userId];
        if (!player) {
          return cb({ success: false, message: "Você não está na sala." });
        }


        clearDisconnect(userId);
        userConnectionMap.delete(userId);
        
        if (player.isAdmin) {
          io.to(roomId).emit("roomClosed", {
            success: true,
            message: `Sala ${room.roomName} encerrada pelo Admin.`,
          });
          
          delete rooms[roomId];

          const socketsInRoom = io.sockets.adapter.rooms.get(roomId) || new Set();
          for (const sockId of socketsInRoom) {
            io.sockets.sockets.get(sockId)?.leave(roomId);
          }
          cb({ success: true, message: "Sala encerrada com sucesso.", room: null as any });
        } else {

          delete room.players[userId];
          socket.leave(roomId);

          io.to(roomId).emit("playerLeft", {
            success: true,
            message: getRandomAlertMessage("onDisconnect", player.userName)
          });
          cb({ success: true, message: "Você saiu da sala.", room });
        }
      }
    );

    socket.on("disconnect", () => {
      const entry = Array.from(userConnectionMap.entries())
        .find(([, info]) => info.socketId === socket.id);
      if (!entry) {
        // console.log(`❌ Disconnected ${socket.id} (sem userId)`);
        return;
      }
      const [userId] = entry;
      const timeout = setTimeout(() => {
        
        userConnectionMap.delete(userId);
        disconnectTimeouts.delete(userId);
        Object.entries(rooms).forEach(([roomId, room]) => {
          const player = room.players[userId];
          if (player) {
            const { userName } = player;
            delete room.players[userId];

            // emite para todos na sala que o player desconectou
            io.to(roomId).emit("playerDisconnected", {
              userId,
              success: true,
              message: getRandomAlertMessage("onDisconnect", userName),
            });
          }
        });
      }, 7000);
      disconnectTimeouts.set(userId, timeout);
      // console.log(`⚠️ ${socket.id} aguardando reconexão de ${userId}`);
    });
    
  });
}

export function resetRoomsState() {
  Object.keys(rooms).forEach((key) => delete rooms[key]);
  userConnectionMap.clear();
  for (const t of disconnectTimeouts.values()) {
    clearTimeout(t);
  }
  disconnectTimeouts.clear();
}
