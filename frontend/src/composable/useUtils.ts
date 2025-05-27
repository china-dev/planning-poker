import { ref } from 'vue';
import { useConnection } from './useConnection.ts';
import { useUserStore } from '../store/user.ts';

export function useUtils() {
  const userStore = useUserStore();
  const { onJoinedPlayer, getPlayers, onPlayerDisconnect } = useConnection();

  const players = ref<any[]>([]);

  function invitePlayers(userName: string, roomName: string, roomId: string): void {
    const message = 
      `${userName} convidou você para participar do Planning Poker: ${roomName}!\n\n` + 
      `Acesse: https://planning-poker-app-dun.vercel.app\n` + 
      `ID da sala: ${roomId}\n\n`;

    navigator.clipboard.writeText(message)
      .then(() => {
          userStore.setMessage({
            text: '✅ Convite copiado! Compartilhe com seus colegas.',
            success: true
        });
      })
      .catch((err) => {
        console.error('❌ Erro ao copiar convite:', err);
      });
  }

  function startListeningPlayerJoin(): void {
    onJoinedPlayer((response) => {
      if (response.success && response.players) {
        players.value = Object.values(response.players);
        userStore.setMessage({
          text: response.message,
          success: true
        });
      } else {
        console.error('❌ Erro ao receber entrada de jogador:', response.message);
      }
    });
  }

  function handleGetPlayers(): void {    
    getPlayers((response) => {
      if (response.success && response.players) {
        players.value = Object.values(response.players);
      } else {
        console.error('❌ Erro ao obter jogadores:', response.message);
      }
    });
  }

  function startListeningPlayerDisconnect(): void {
    onPlayerDisconnect((response) => {
      if (response.success) {
        handleGetPlayers();
        userStore.setMessage({
          text: response.message,
          success: true
        });
      } else {
        console.error('❌ Erro ao processar desconexão:', response.message);
      }
    });
  }

  function getRoleEmoji(player: any): string {
    if (player.isAdmin) return '👑';
    if (player.isSpectator) return '👀';
    return '🎮';
  }

  return {
    invitePlayers,
    players,
    getRoleEmoji,
    handleGetPlayers,
    startListeningPlayerJoin,
    startListeningPlayerDisconnect
  };
}
