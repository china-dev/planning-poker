import { computed } from 'vue';
import socket from '../services/socket.ts';
import { useUserStore } from '../store/user.ts';

/** ---------------------- Tipagens ---------------------- */

type Player = {
  userId: string;
  userName: string;
  isAdmin: boolean;
  isSpectator?: boolean;
  vote?: number;
};

type Players = Record<string, Player>;

type RoomData = {
  roomName: string;
  players: Players;
  voteReveal?: boolean;
};

type CallbackResponse =
  | { success: true; message: string; room: RoomData }
  | { success: false; message: string };

type CallbackPlayers =
  | { success: true; message: string; players: Players }
  | { success: false; message: string };

type CallbackDefault =
  | { success: true; message: string }
  | { success: false; message: string };

/** ------------------------------------------------------- */

export function useConnection() {
  const userStore = useUserStore();
  const roomId = computed(() => userStore.roomId);
  const userId = computed(() => userStore.userId);

  /** ---------------------- Connection ---------------------- */

  function createServer(): void {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Socket conectado com ID:', socket.id);
      userStore.setSocketId(socket.id);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Erro ao conectar socket:', err.message);
    });
  }

  function disconnectServer(): void {
    removeListeners();
    socket.disconnect();
  }

  function onConnectError(callback: (err: Error) => void) {
    socket.on('connect_error', callback);
  }

  /** ---------------------- Emits ---------------------- */

  function createRoom(
    userName: string,
    roomName: string,
    roomId: string,
    userId: string,
    callback?: (response: CallbackResponse) => void
  ) {
    socket.emit('createRoom', { userName, roomName, roomId, userId }, callback);
  }

  function joinedPlayer(
    userName: string,
    roomId: string,
    userId: string,
    isSpectator: boolean,
    callback?: (response: CallbackResponse) => void
  ) {
    socket.emit('joinedPlayer', { userName, roomId, userId, isSpectator }, callback);
  }

  function votePlayer(vote: number, callback?: (response: CallbackDefault) => void) {
    socket.emit('votePlayer', { roomId: roomId.value, vote, userId: userId.value }, callback);
  }

  function voteRevealed(callback?: (response: CallbackDefault) => void) {
    socket.emit('voteRevealed', roomId.value, callback);
  }

  function restartVote(callback?: (response: CallbackPlayers) => void) {
    socket.emit('restartVote', roomId.value, callback);
  }

  function getPlayers(callback?: (response: CallbackPlayers) => void) {
    socket.emit('getPlayers', roomId.value, callback);
  }

  /** ---------------------- Listeners ---------------------- */

  function onJoinedPlayer(callback: (data: CallbackPlayers) => void) {
    socket.on('onJoinedPlayer', callback);
  }

  function onPlayerDisconnect(
    callback: (data: { userId: string; success: boolean; message: string; room: RoomData }) => void
  ) {
    socket.on('playerDisconnected', callback);
  }

  function onPlayerVoted(
    callback: (data: { userId: string; message: string; userName: string; vote: number }) => void
  ) {
    socket.on('playerVoted', callback);
  }

  function onVoteRevealed(callback: (data: CallbackDefault) => void) {
    socket.on('onVoteRevealed', callback);
  }

  function onVotesReset(callback: (data: CallbackPlayers) => void) {
    socket.on('onVotesReset', callback);
  }

  /** ---------------------- Remove Listeners ---------------------- */

  function removeListeners() {
    socket.off('onJoinedPlayer');
    socket.off('playerDisconnected');
    socket.off('playerVoted');
    socket.off('onVoteRevealed');
    socket.off('onVotesReset');
    socket.off('connect_error');
  }

  return {
    /** Connection */
    createServer,
    disconnectServer,
    onConnectError,

    /** Emits */
    createRoom,
    joinedPlayer,
    votePlayer,
    voteRevealed,
    restartVote,
    getPlayers,

    /** Listeners */
    onJoinedPlayer,
    onPlayerDisconnect,
    onPlayerVoted,
    onVoteRevealed,
    onVotesReset,

    /** Remove Listeners */
    removeListeners
  };
}
