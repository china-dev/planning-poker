import { onMounted } from 'vue';
import socket from '../services/socket.ts';
import { useUserStore } from '../store/user.ts';

export function useConnection () {
  const userStore = useUserStore();

  function connectServer () :void {
    onMounted(() => {
      socket.on('connect', () => {
        userStore.setSocketId(socket.id);
      });
    });
  }

  function createRoom(
    userName: string, roomName: string, roomId: string,
    callback?: (response: any) => void
  ): void {
  
    socket.emit('createRoom', { userName, roomName, roomId }, (response: any) => {
      console.log(response);
      if (callback) callback(response);
    });
  }

  function joinedPlayer(
    userName: string, roomId:string, isSpectator: boolean,
    callback?: (response: any) => void
  ): void {
      socket.emit('joinedPlayer', { userName, roomId, isSpectator }, (response: any) => {
      console.log(response);
      if (callback) callback(response);
    });
  }

  

  function votePlayer (vote: number,  callback?: (response: any) => void):void {
    const roomId:string = userStore.roomId;
    
    socket.emit('votePlayer', {roomId, vote}, (response: any) => {
      console.log(response);
      if (callback) callback(response);
    });
  }

  return { connectServer, createRoom, joinedPlayer, votePlayer }
}