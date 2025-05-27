import { io, Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '../types/socketTypes.ts';

const URL = import.meta.env.VITE_API_URL as string;

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
  autoConnect: true,
  transports: ['websocket'],
});

export default socket;
