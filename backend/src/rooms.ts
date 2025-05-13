import { Server, Socket } from "socket.io";

export function setupRooms(io: Server) {

  type Vote = {
    userName: string;
    vote: number | null;
  };

  type Room = {
    roomName: string;
    players: {
      [socketId: string]: {
        userName: string;
        isAdmin: boolean;
        isSpectator?: boolean;
        vote?: number
      };
    };
  };

  const rooms: {
    [roomId: string]: Room
  } = {};

  type CallbackResponse = {
    success: boolean;
    message: string;
    room?: typeof rooms;
  };

  type CallbackResponseRoom = {
    success: boolean;
    message: string;
    room: Room;
  };

  io.on('connection', (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on(
      'createRoom',
      (
        data: { userName: string, roomName: string, roomId: string },
        callback: (response: CallbackResponse) => void
      ) => {
        const { userName, roomName, roomId } = data;
      
        if (rooms[roomId]) {
          return callback({ success: false, message: 'Sala já existe.' });
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
          message: 'Room created successfully.',
          room: rooms
        });
    });

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

        rooms[roomId].players[socket.id] = {
          userName,
          isAdmin: false,
          isSpectator
        };

        socket.join(roomId);

        return callback({
          success: true,
          message: "Entrou na sala com sucesso.",
          room: rooms,
        });
      }
    );

    socket.on(
      "votePlayer",
      (
        data: {roomId: string, vote: number},
        callback: (response: CallbackResponse) => void
      ) => {
        const { roomId, vote } = data;

        const room = rooms[roomId];
        
        if (!room) {
          return callback({ success: false, message: `Sala ${roomId} não encontrada.`,  room: rooms });
        }

        rooms[roomId].players[socket.id].vote = vote;

        return callback({
          success: true,
          message: "Voto registrado!!",
          room: rooms,
        });
      }
    );

    socket.on('getPlayers', (roomId: string, callback: (response: CallbackResponseRoom) => void) => {

      return callback({
        success: true,
        message: "Informações da Sala!!!",
        room: rooms[roomId]
      });

    });

  });
}