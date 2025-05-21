import { computed, reactive } from 'vue';
import { useUserStore } from '../store/user.ts';
import { useConnection } from './useConnection.ts';

export function useVotes () {
  const { 
    votePlayer,
    getPlayers,
    onPlayerVoted,
    removePlayerVotedListener,
    voteRevelead,
    onVoteRevelead,
    removeVoteReveleadListener
  } = useConnection();
  const userStore = useUserStore();
  
  const fibonacci: number[] = [1, 2, 3, 5, 8, 13, 21];
  const suits = ['♥', '♦', '♣', '♠'];
  const playerSuits = reactive(new Map<string, string>());

  function handleVote(userVote: number): void {
    votePlayer(userVote, (response) => {
      if (!response.success) {
        console.error('Erro ao votar:', response.message);
      } else {
        userStore.setVote(userVote);
      }
    });
  }

  function handlePlayers(): void {
    getPlayers((response) => {
      if (!response.success) {
        console.error('Erro ao mostrar players:', response.message);
      } else {
        userStore.setPlayers(response.players);
      }
    });
  }

  function startListeningVotes(): void {
    onPlayerVoted(() => {
      handlePlayers();
    });
  }

  function stopListeningVotes(): void {
    removePlayerVotedListener();
  }

  function getRandomSuit(): string {
    return suits[Math.floor(Math.random() * suits.length)];
  }

  function getSuitForPlayer(playerName: string): string {
    if (!playerSuits.has(playerName)) {
      playerSuits.set(playerName, getRandomSuit());
    }
    return playerSuits.get(playerName)!;
  }

  function revealVotes() {
    voteRevelead((response) => {
      if (!response.success) {
        console.error('Erro ao revelar votos:', response.message);
      } else {
        userStore.setVoteRevealed(response.success);
      }
    });
  }

  function startListeningReveal(): void {
    onVoteRevelead((response) => {
      userStore.setVoteRevealed(response.success);
    });
  }

  function stopListeningReveal(): void {
    removeVoteReveleadListener();
  }

  const filteredPlayers = computed(() => {
    return Object.values(userStore.players).filter(player => player.vote !== undefined);
  });

  return {
    fibonacci,
    handleVote,
    handlePlayers,
    revealVotes,
    filteredPlayers,
    getSuitForPlayer,
    startListeningVotes,
    stopListeningVotes,
    startListeningReveal,
    stopListeningReveal
  };
}
