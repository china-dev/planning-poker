import { ref } from "vue";
import { useConnection } from "./useConnection";
import { useUserStore } from '../store/user.ts';


export function utils () {
  const { setMessage } = useUserStore();
  
  const { onJoinedPlayer, getPlayers, onPlayerDisconnect } = useConnection();
  const players = ref([]);

  function invitePlayers (userName: string, roomName: string, roomId: string): void {
    const message = `${userName} convidou para participar do Planning Poker: ${roomName}!!!\nAcesse https://planingpokerapp.com e insira o ID da sala: ${roomId} ou clique no link direto: https://planingpokerapp.com/room/${roomId}`;

    navigator.clipboard.writeText(message)
    .then(() => {
      console.log('Convite copiado para a área de transferência!');
      alert('Convite copiado! Compartilhe com seus colegas.');
    })
    .catch((err) => {
      console.error('Erro ao copiar convite:', err);
    });
  }

  function onPlayersJoined (): void {
    onJoinedPlayer( (response) => {
      if (response.success) {
        players.value = Object.values(response.players);
        setMessage({
          text: response.message,
          success: response.success
        });
      }
    });
  }

  function handleGetPlayers (): void {
    getPlayers( response => {
      if (response.success) {
        players.value = Object.values(response.players);
      }
    })
  }

  function handleOnPlayerDisconnect (): void {
    onPlayerDisconnect( (response) => {
      console.log(response);
      
      if (response.success) {
        handleGetPlayers();
        setMessage({
          text: response.message,
          success: response.success
        });
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
    onPlayersJoined,
    players,
    getRoleEmoji,
    handleGetPlayers,
    handleOnPlayerDisconnect
  }
}