import { computed } from 'vue';
import socket from '../services/socket.ts';
import { useUserStore } from '../store/user.ts';

export function useConnection() {
  const userStore = useUserStore();
  const roomId = computed(() => userStore.roomId);

  function createServer () :void {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('Socket conectado com id:', socket.id);
      userStore.setSocketId(socket.id);
    });
  
    socket.on('connect_error', (err) => {
      console.error('Erro ao conectar socket:', err.message);
    });
  }

  function disconnectServer () :void {
    socket.off('connect');
    socket.off('playerVoted');
    socket.disconnect();
  }

  function createRoom(userName: string, nameRoom: string, roomId: string, callback?: (response: any) => void) {
    socket.emit('createRoom', { userName, roomName: nameRoom, roomId }, callback);
  }

  function joinedPlayer(userName: string, roomId: string, isSpectator: boolean, callback?: (response: any) => void) {
    socket.emit('joinedPlayer', { userName, roomId, isSpectator }, callback);
  }

  function onJoinedPlayer(callback: (data: { success: boolean; message: string; players: any}) => void) {
    socket.on('onJoinedPlayer', callback);
  }


  function getPlayers(callback?: (response: any) => void) {
    socket.emit('getPlayers', roomId.value, callback);
  }

  function votePlayer(vote: number, callback?: (response: any) => void) {
    socket.emit('votePlayer', { roomId: roomId.value, vote }, callback);
  }

  function onPlayerVoted(callback: (data: { socketId: string; message: string; userName: string; vote: number }) => void) {
    socket.on('playerVoted', callback);
  }

  function removePlayerVotedListener() {
    socket.off('playerVoted');
  }

  function voteRevelead(callback?: (response: any) => void) {
    socket.emit('voteRevelead', roomId.value, callback);
  }

  function onVoteRevelead(callback: (data: {success: boolean, socketId: string, message: string}) => void) {
    socket.on('onVoteRevelead', callback);
  }

  function removeVoteReveleadListener() {
    socket.off('onVoteRevelead');
  }

  function restartVote(callback?: (response: any) => void) {
    socket.emit('restartVote', roomId.value, callback);
  }

  function onVotesReset(callback: (data: {success: boolean, message: string, players: any}) => void) {
    socket.on('onVotesReset', callback);
  }

  function removeOnVotesReset() {
    socket.off('onVotesReset');
  }


  return {
    createServer,
    disconnectServer,
    createRoom,
    joinedPlayer,
    onJoinedPlayer,
    votePlayer,
    getPlayers,
    onPlayerVoted,
    removePlayerVotedListener,
    voteRevelead,
    onVoteRevelead,
    removeVoteReveleadListener,
    restartVote,
    onVotesReset,
    removeOnVotesReset
  };
}
