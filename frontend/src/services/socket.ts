import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/socketTypes.ts';

const URL = 'http://localhost:3001';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: true,
  transports: ['websocket'],
});

export default socket;
