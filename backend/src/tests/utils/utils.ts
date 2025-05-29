import { createServer, Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { io as Client, Socket } from 'socket.io-client';
import { setupRooms, resetRoomsState  } from '../../rooms';
import {users, rooms  } from './fixtures';

export type TestServer = {
  httpServer: HttpServer;
  ioServer: IOServer;
  port: number;
};

export async function setupTestServer(): Promise<TestServer> {
  const httpServer = createServer();
  const ioServer = new IOServer(httpServer, { cors: { origin: '*' } });
  setupRooms(ioServer);

  await new Promise<void>(resolve => {
    httpServer.listen(0, () => resolve());
  });
  const port = (httpServer.address() as any).port;
  return { httpServer, ioServer, port };
}


export function createRoom(client: Socket, payload: {
  userId: string;
  userName: string;
  roomId: string;
  roomName: string;
  tabId: string;
}): Promise<any> {
  return new Promise((resolve) => {
    client.emit('createRoom', payload, (res: any) => {
      resolve(res);
    });
  });
}

export function joinPlayer(client: Socket, payload: {
  userId: string;
  userName: string;
  roomId: string;
  isSpectator: boolean;
  isAdmin: boolean;
  tabId: string;
}): Promise<any> {
  return new Promise((resolve) => {
    client.emit('joinedPlayer', payload, (res: any) => {
      resolve(res);
    });
  });
}

export function initVotes(client: Socket, payload: {
  roomId: string;
  theme: {
    name: string;
    mostVoted: number;
    average: number;
  }
}): Promise<any> {
  return new Promise((resolve) => {
    client.emit('InitVotes', payload, (res: any) => {
      resolve(res);
    });
  });
}

export function votePlayer(client: Socket, payload: {
  roomId: string;
  vote: number;
  userId: string;
}): Promise<any> {
  return new Promise((resolve) => {
    client.emit('votePlayer', payload, (res: any) => {
      resolve(res);
    });
  });
}

export function voteRevealed(client: Socket, roomId: string): Promise<any> {
  return new Promise((resolve) => {
    client.emit('voteRevealed', roomId, (res: any) => {
      resolve(res);
    });
  });
}

export function restartVote(client: Socket, roomId: string): Promise<any> {
  return new Promise((resolve) => {
    client.emit('restartVote', roomId, (res: any) => {
      resolve(res);
    });
  });
}

export function connectClient(port: number) {
  const s = Client(`http://localhost:${port}`, { transports: ['websocket'], forceNew: true });
  return new Promise<Socket>(res => s.once('connect', () => res(s)));
}

export function waitForEvent<T>(client: Socket, event: string): Promise<T> {
  return new Promise((resolve) => {
    client.once(event, (payload: T) => resolve(payload));
  });
}
export async function expectBroadcast<T = any>(
  client: Socket,
  event: string,
  assertFn: (payload: T) => void
): Promise<void> {
  const payload = await waitForEvent<T>(client, event);
  assertFn(payload);
}

export async function setupRoomWithPlayer(
  clientA: Socket,
  clientB: Socket
): Promise<void> {
  await createRoom(clientA, { ...users.admin, ...rooms.default });
  await joinPlayer(clientB, { ...users.player, ...rooms.default });
}

export { resetRoomsState };