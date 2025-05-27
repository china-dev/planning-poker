import { createServer, Server as HttpServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { io as Client, Socket } from 'socket.io-client';
import { setupRooms } from '../rooms';

describe('WebSocket rooms – createRoom', () => {
  let httpServer: HttpServer;
  let ioServer: IOServer;
  let clientSocket: Socket;
  let port: number;

  beforeAll((done) => {
    
    httpServer = createServer();
    ioServer = new IOServer(httpServer, {
      cors: { origin: '*' }
    });
    
    setupRooms(ioServer);

    httpServer.listen(0, () => {
      port = (httpServer.address() as any).port;
      done();
    });
  });

  afterAll((done) => {
    clientSocket.close();
    ioServer.close();
    httpServer.close(done);
  });

  it('Room created successfully', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      forceNew: true,
    });

    const payload = {
      userId: 'u123',
      userName: 'Lucas',
      roomId: 'room42',
      roomName: 'Sala de Teste',
      tabId: 'tab-A',
    };

    clientSocket.on('connect', () => {
      
      clientSocket.emit('createRoom', payload, (response: any) => {
        try {
          expect(response.success).toBe(true);
          expect(response.message).toMatch(/Sala criada com sucesso/);
          expect(response.room).toMatchObject({
            roomName: 'Sala de Teste',
            players: {
              u123: { userId: 'u123', userName: 'Lucas', isAdmin: true }
            }
          });
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });


  it('deve criar uma sala e retornar callback com sucesso e dados da sala', (done) => {
    clientSocket = Client(`http://localhost:${port}`, {
      transports: ['websocket'],
      forceNew: true,
    });

    const payload = {
      userId: 'u123',
      userName: 'Alice',
      roomId: 'room42',
      roomName: 'Sala de Teste',
      tabId: 'tab-A',
    };

    clientSocket.on('connect', () => {
      // 5) Emite createRoom e recebe a resposta no callback
      clientSocket.emit('createRoom', payload, (response: any) => {
        try {
          expect(response.success).toBe(true);
          expect(response.message).toMatch(/Sala criada com sucesso/);
          expect(response.room).toMatchObject({
            roomName: 'Sala de Teste',
            players: {
              u123: { userId: 'u123', userName: 'Alice', isAdmin: true }
            }
          });
          done();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
