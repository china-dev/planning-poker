import { Server, Socket } from "socket.io";

export function setupRooms(io: Server) {

  type Room = {
    roomName: string;
    players: {
      [socketId: string]: {
        userName: string;
        isAdmin: boolean;
        isSpectator?: boolean;
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

  });
}