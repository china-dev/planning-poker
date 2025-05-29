import { Socket } from 'socket.io-client';
import { users, rooms } from '../utils/fixtures';
import { 
  setupTestServer, 
  createRoom,
  TestServer,
  resetRoomsState,
  expectBroadcast,
  connectClient
} from '../utils/utils';

describe('CreateRoom flow', () => {
  let server: TestServer;
  let clientA: Socket;
  let clientB: Socket;

  beforeEach(async () => {
    resetRoomsState();
    server = await setupTestServer();
    
    
  [clientA, clientB] =
    await Promise.all([1,2].map(() => connectClient(server.port)));

  });

  afterEach(done => {
    clientA.close();
    clientB.close();
    server.ioServer.close();
    server.httpServer.close(done);
  });

  it('should create room successfully', async () => {
    const roomRes = await createRoom(clientA, {
      ...users.admin,
      ...rooms.default
    });
    expect(roomRes.success).toBe(true);
  });

  it('should reject duplicate room creation', async () => {
    await createRoom(clientA, {
      ...users.admin,
      ...rooms.default
    });

    const roomB = await createRoom(clientA, {
      ...users.adminOtherTab,
      ...rooms.default
    });
    expect(roomB.success).toBe(false);
    expect(roomB.message).toBe('Sala já existe.');

  });

  it('should notify previous tab on room creation', async () => {
    const roomA = await createRoom(clientA, {
      ...users.admin,
      ...rooms.default
    });
    expect(roomA.success).toBe(true);

    const onMultipleTabs = expectBroadcast(clientA, 'onMultipleTabs', (payload) => {
      expect(payload.success).toBe(true);
      expect(payload.message).toBe('Você abriu a aplicação em outra aba.');
    });
        
    createRoom(clientB, {
      ...users.adminOtherTab,
      ...rooms.other
    });
    
    await onMultipleTabs;
  });

});
