import { Socket } from 'socket.io-client';
import { users, rooms, theme } from '../utils/fixtures';
import { 
  setupTestServer, 
  createRoom,
  joinPlayer,
  setupRoomWithPlayer,
  initVotes,
  TestServer,
  resetRoomsState,
  expectBroadcast,
  connectClient,
  votePlayer,
  voteRevealed,
  restartVote
} from '../utils/utils';

describe('Vote flow', () => {
  let server: TestServer;
  let clientA: Socket;
  let clientB: Socket;

  const fibonnaci = [1, 3, 5, 8, 13, 21];

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

  it('should start vote with theme', async () => {
    await setupRoomWithPlayer(clientA, clientB);

    const onInitVotes =  expectBroadcast(clientB, 'onInitVotes', (payload) => {
      expect(payload.success).toBe(true);
      expect(payload.message).toBe('Tema da sala atualizado.');
      expect(payload.themes[0]).toEqual(theme.default.theme);
    });

    const initRes = await initVotes(clientA, {
      ...theme.default
    });
    expect(initRes.success).toBe(true);
    expect(initRes.message).toBe('Tema Definido.');
    expect(initRes.room.initVotes).toBe(true);

    await onInitVotes;
  });

  it('should register a valid vote', async () => {
    const vote = fibonnaci[Math.floor(Math.random() * fibonnaci.length)];
    const userIdPlayer = users.player.userId;

    await setupRoomWithPlayer(clientA, clientB);

    const onPlayerVoted =  expectBroadcast(clientA, 'playerVoted', (payload) => {
      expect(payload.success).toBe(true);
      expect(payload.userId).toBe(users.player.userId);
      expect(payload.userName).toBe(users.player.userName);
      expect(payload.vote).toBe(vote)
    });
   
    const voteRes = await votePlayer(clientB, {
      roomId: rooms.default.roomId,
      vote,
      userId: users.player.userId
    });
    expect(voteRes.success).toBe(true);
    expect(voteRes.message).toBe('Voto registrado.');
    expect(voteRes.room.players[userIdPlayer]).toHaveProperty('vote');
    expect(voteRes.room.players[userIdPlayer].vote).toBe(vote);

    await onPlayerVoted;
  });
  
  it('should reject vote for invalid room', async () => {
    const vote = fibonnaci[Math.floor(Math.random() * fibonnaci.length)];

    await setupRoomWithPlayer(clientA, clientB);
    
    const voteRes = await votePlayer(clientB, {
      roomId: 'sala-errada',
      vote,
      userId: users.player.userId
    });

    expect(voteRes.success).toBe(false);
    expect(voteRes.message).toBe(`Sala sala-errada não encontrada.`);
  });

  it('should reject vote for invalid player', async () => {
    const vote = fibonnaci[Math.floor(Math.random() * fibonnaci.length)];

    await setupRoomWithPlayer(clientA, clientB);
    
    const voteRes = await votePlayer(clientB, {
      roomId: rooms.default.roomId,
      vote,
      userId: 'id_errado'
    });

    expect(voteRes.success).toBe(false);
    expect(voteRes.message).toBe(`Jogador não está na sala.`);
  });

  it('should reject spectator vote', async () => {
    const vote = fibonnaci[Math.floor(Math.random() * fibonnaci.length)];

    await setupRoomWithPlayer(clientA, clientB);
    
    const voteRes = await votePlayer(clientB, {
      roomId: rooms.default.roomId,
      vote,
      userId: users.spectator.userId
    });

    expect(voteRes.success).toBe(false);
    expect(voteRes.message).toBe(`Espectadores não podem votar.`);
  });

  it('should reveal votes', async () => {
    const vote = fibonnaci[Math.floor(Math.random() * fibonnaci.length)];

    await setupRoomWithPlayer(clientA, clientB);

    const onVoteRevealed = expectBroadcast(clientB, 'onVoteRevealed', (payload) => {
      expect(payload.success).toBe(true);
      expect(payload.message).toBe("Votos revelados!");
    });
    
    await votePlayer(clientB, {
      roomId: rooms.default.roomId,
      vote,
      userId: users.spectator.userId
    });

    const revealedRes = await voteRevealed(clientA, rooms.default.roomId);
    expect(revealedRes.success).toBe(true);
    expect(revealedRes.room.voteReveal).toBe(true);
    expect(revealedRes.message).toBe("Votos revelados.");

    await onVoteRevealed;

  });

  it('should reset votes', async () => {
    const vote = fibonnaci[Math.floor(Math.random() * fibonnaci.length)];
    const userIdPlayer = users.player.userId;

    await setupRoomWithPlayer(clientA, clientB);

    const onVotesReset = expectBroadcast(clientB, 'onVotesReset', (payload) => {
      expect(payload.success).toBe(true);
      expect(payload.message).toBe('Todos os votos foram removidos.');
    });

    const voteRes = await votePlayer(clientB, {
      roomId: rooms.default.roomId,
      vote,
      userId: users.player.userId
    });
    expect(voteRes.room.players[userIdPlayer]).toHaveProperty('vote');

    await voteRevealed(clientA, rooms.default.roomId);

    const resartRes = await restartVote(clientA, rooms.default.roomId);
    expect(resartRes.success).toBe(true);
    expect(resartRes.message).toBe('Votos resetados.');
    expect(resartRes.players).not.toHaveProperty('vote');

    await onVotesReset;

  });

});
