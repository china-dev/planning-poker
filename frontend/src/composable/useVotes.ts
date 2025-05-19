import { onMounted, onBeforeUnmount, computed } from 'vue';
import { useUserStore } from '../store/user.ts';
import { useConnection } from './useConnection.ts';



export function useVotes () {
  const { votePlayer, getPlayers, onPlayerVoted, removePlayerVotedListener } = useConnection();
  const userStore = useUserStore();
  
  const fibonacci: number[] = [
    1, 2, 3, 5, 8, 13, 21
  ]

  function handleVote (userVote: number) :void {
    votePlayer(userVote, (response) => {
      if (!response.success) {
        console.error('Erro ao votar:', response.message);
      } else {
        console.log('Voto registrado com sucesso!');
        userStore.setVote(userVote);
      }
    });
  }

  function handlePlayers (): void {
    getPlayers((response) => {
      if (!response.success) {
        console.error('Erro ao mostrar players:', response.message);
      } else {
        userStore.setPlayers(response.players);
      }
    });
  }

  
  function listenForVotes(): void {
    onPlayerVoted((data) => {
      console.log('Voto recebido:', data);
      handlePlayers();
    });
  }

  const filteredPlayers = computed(() => {
    return Object.values(userStore.players).filter(player => player.vote !== undefined);
  });

  onMounted(() => {
    listenForVotes();
  });

  onBeforeUnmount(() => {
    removePlayerVotedListener();
  });

  return { fibonacci, handleVote, handlePlayers, filteredPlayers };
}