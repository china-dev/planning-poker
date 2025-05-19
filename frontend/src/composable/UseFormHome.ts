import { useUserStore } from '../store/user.ts';
import { useRouter } from 'vue-router';
import { useConnection } from './useConnection.ts';

export interface responseForm {
  error: boolean,
  message: string
}

export function useFormHome () {
  const userStore = useUserStore();
  const router = useRouter();
  const { createRoom, joinedPlayer } = useConnection();

  function validade (userName: string, roomId: string): responseForm {
    if (!userName.trim()) {
      return {
        error: true,
        message: "Preencha todos os campos!!!"
      }
    }

    if (!roomId.trim()) {
      return {
        error: true,
        message: "Preencha todos os campos!!!"
      }
    }

    return {
      error: false,
      message: 'Campos preenchidos'
    }    
  }

  function generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }


  function handleJoinRoom (userName: string, roomId: string, isSpectator: boolean): void {
    const result = validade(userName, roomId);

    if (result.error === true) {
      alert(result.message);
    } else {

      joinedPlayer(userName, roomId, isSpectator, (response) => {
        if (response.success) {         
          userStore.setUser(userName, response.room[roomId].roomName, roomId, false, isSpectator);
          router.push(`/room/${roomId}`);
        } else {
          alert(response.message);
        }
      });

    }
  }
  
  function handleCreateRoom (userName: string, nameRoom: string): void {
    const result = validade(userName, nameRoom);
    const roomId = generateRoomId();
    
    if (result.error === true) {
      alert(result.message);
    } else {

      
      createRoom(userName, nameRoom, roomId, (response) => {
        if (response.success) {
          userStore.setUser(userName, nameRoom, roomId, true, false);
          router.push(`/room/${roomId}`);
        } else {
          alert(response.message);
        }
      });
    }
  }


  return { handleJoinRoom, handleCreateRoom }
}