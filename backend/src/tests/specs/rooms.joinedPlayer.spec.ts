import { Socket } from 'socket.io-client';
import { users, rooms } from '../utils/fixtures';
import { 
  setupTestServer, 
  createRoom,
  joinPlayer,
  TestServer,
  resetRoomsState,
  expectBroadcast,
  connectClient
} from '../utils/utils';

describe('joinedPlayer flow', () => {
  let server: TestServer;
  let clientA: Socket;
  let clientB: Socket;
  let clientC: Socket;

  beforeEach(async () => {
    resetRoomsState();
    server = await setupTestServer();
    
    
  [clientA, clientB, clientC] =
    await Promise.all([1,2,3].map(() => connectClient(server.port)));

  });

  afterEach(done => {
    clientA.close();
    clientB.close();
    clientC.close();
    server.ioServer.close();
    server.httpServer.close(done);
  });

  it('should reject join for invalid room', async () => {
    await createRoom(clientA, {
      ...users.admin,
      ...rooms.default
    });

    const joinRes = await joinPlayer(clientB, {
      ...users.player,
      ...rooms.other
    });

    expect(joinRes.success).toBe(false);
    expect(joinRes.message).toBe('Sala não encontrada.');
  });

  it('should allow join for valid room', async () => {
    await createRoom(clientA, {
      ...users.admin,
      ...rooms.default
    });

    const onJoinedPlayer = expectBroadcast(clientB, 'onJoinedPlayer', (payload) => {
      expect(payload.players).toHaveProperty(users.player.userId);
    });
    
    const joinRes = await joinPlayer(clientB, {
      ...users.player,
      ...rooms.default
    });
    expect(joinRes.success).toBe(true);
    expect(joinRes.room.players).toHaveProperty(users.player.userId);
    
    await onJoinedPlayer;
  });

  it('should notify previous tab on multiple login', async () => {
    await createRoom(clientA, {
      ...users.admin,
      ...rooms.default
    });
    
    await joinPlayer(clientB, {
      ...users.player,
      ...rooms.default
    });

    const onMultipleTabs = expectBroadcast(clientB, 'onMultipleTabs', (payload) => {
      expect(payload.success).toBe(true);
      expect(payload.message).toBe('Você abriu a aplicação em outra aba.');
    });

    const joinOtherPlayer = await joinPlayer(clientC, {
      ...users.playerOtherTab,
      ...rooms.default
    });
    expect(joinOtherPlayer.success).toBe(true);
  
    await onMultipleTabs;
  });

});
