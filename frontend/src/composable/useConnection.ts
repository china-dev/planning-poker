import { computed } from 'vue';
import socket from '../services/socket.ts';
import { useUserStore } from '../store/user.ts';

import type { 
  CallbackResponse,
  CallbackPlayers
 } from '../types/socketTypes.ts';



/** ---------------------- Tipagens ---------------------- */

type CallbackDefault = // não é mais usado em emits
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
    tabId: string,
    callback: (response: CallbackResponse) => void
  ) {
    socket.emit('createRoom', { userName, roomName, roomId, userId, tabId  }, callback);
  }

  function joinedPlayer(
    userName: string,
    roomId: string,
    userId: string,
    isSpectator: boolean,
    isAdmin: boolean,
    tabId: string,
    callback: (response: CallbackResponse) => void
  ) {
    socket.emit('joinedPlayer', { userName, roomId, userId, isSpectator, isAdmin,tabId }, callback);
  }

  function leaveRoom(callback: (res: CallbackResponse) => void) {
    socket.emit(
      'leaveRoom',
      { userId: userId.value, roomId: roomId.value },
      callback
    );
  }

  function votePlayer(vote: number, callback: (response: CallbackDefault) => void) {
    socket.emit('votePlayer', { roomId: roomId.value, vote, userId: userId.value }, callback);
  }

  function voteRevealed(callback: (response: CallbackDefault) => void) {
    socket.emit('voteRevealed', roomId.value, callback);
  }

  function restartVote(callback: (response: CallbackPlayers) => void) {
    socket.emit('restartVote', roomId.value, callback);
  }

  function getPlayers(callback: (response: CallbackPlayers) => void) {
    socket.emit('getPlayers', roomId.value, callback);
  }

  /** ---------------------- Listeners ---------------------- */

  function onJoinedPlayer(callback: (data: CallbackPlayers) => void) {
    socket.on('onJoinedPlayer', callback);
  }

  function onPlayerDisconnect(
    callback: (data: { userId: string; success: true; message: string }) => void
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

  function onMultipleTabs(callback: (data: CallbackDefault) => void) {
    socket.on('onMultipleTabs', callback);
  }

  function onRoomClosed (callback: (data: {success: true; message: string }) => void)  {    
    socket.on("roomClosed", () => callback);
  }

  function onPlayerLeft (callback: (data: {success: true; message: string }) => void)  {    
    socket.on("playerLeft", () => callback);
  }


  /** ---------------------- Remove Listeners ---------------------- */

  function removeListeners() {
    socket.off('onJoinedPlayer');
    socket.off('playerDisconnected');
    socket.off('playerVoted');
    socket.off('onVoteRevealed');
    socket.off('onVotesReset');
    socket.off('connect_error');
    socket.off('onMultipleTabs');
    socket.off('roomClosed');
    socket.off('playerLeft');
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
    leaveRoom,

    /** Listeners */
    onJoinedPlayer,
    onPlayerDisconnect,
    onPlayerVoted,
    onVoteRevealed,
    onVotesReset,
    onMultipleTabs,
    onRoomClosed,
    onPlayerLeft,

    /** Remove Listeners */
    removeListeners
  };
}
