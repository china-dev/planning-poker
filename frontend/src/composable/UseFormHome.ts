import { useUserStore } from '../store/user.ts';
import { useRouter } from 'vue-router';
import { useConnection } from './useConnection.ts';
import { useSession } from './useSession.ts';

export interface ResponseForm {
  error: boolean;
  message: string;
}

export function useFormHome() {
  const userStore = useUserStore();
  const router = useRouter();
  const { createRoom, joinedPlayer } = useConnection();
  const { session, saveSession, tabId } = useSession();
  const userId = session.value?.userId || '';

  function validade(userName: string, roomId: string): ResponseForm {
    if (!userName.trim() && !roomId.trim()) return { error: true, message: 'Preencha seu nome e o código da sala.' };
    if (!userName.trim()) return { error: true, message: 'Preencha seu nome.' };
    if (!roomId.trim()) return { error: true, message: 'Preencha o código da sala.' };
    return { error: false, message: 'Campos preenchidos' };
  }

  function generateRoomId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  function handleJoinRoom(userNameRaw: string, roomIdRaw: string, isSpectator: boolean, isAdmin: boolean) {
    const userName = userNameRaw.trim();
    const roomId = roomIdRaw.trim();
    const result = validade(userName, roomId);

    if (result.error) {
      userStore.setMessage({ text: result.message, success: false });
      return;
    }


    joinedPlayer(userName, roomId, userId, isSpectator, isAdmin, tabId, (response) => {
      if (response.success && response.room) {
        
        const roomName = response.room.roomName;
        
        saveSession({ userName, roomId, roomName, isSpectator, isAdmin });
        userStore.setUser(userName, roomName, roomId, isAdmin, isSpectator, userId);
        userStore.removeAlert();
        router.push(`/room/${roomId}`);
      } else {
        userStore.setMessage({ text: response.message, success: false });
      }
    });
  }

  function handleCreateRoom(userNameRaw: string, nameRoomRaw: string) {
    const userName = userNameRaw.trim();
    const roomId = generateRoomId();
    const result = validade(userName, nameRoomRaw);

    if (result.error) {
      userStore.setMessage({ text: result.message, success: false });
      return;
    }

    createRoom(userName, nameRoomRaw, roomId, userId, tabId,  (response) => {
      if (response.success) {
        saveSession({ userName, roomId, roomName: nameRoomRaw, isSpectator: false, isAdmin: true });
        userStore.setUser(userName, nameRoomRaw, roomId, true, false, userId);
        router.push(`/room/${roomId}`);
      } else {
        userStore.setMessage({ text: response.message, success: false });
      }
    });
  }

  return { handleJoinRoom, handleCreateRoom };
}
