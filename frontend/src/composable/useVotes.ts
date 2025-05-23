import { computed, reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import { useConnection } from './useConnection';

/** ------------------------- Tipagem ------------------------- */
type Player = {
  userId: string;
  userName: string;
  isAdmin: boolean;
  isSpectator?: boolean;
  vote?: number;
};

type ResultVotes = {
  votes: { vote: number; qtd: number }[];
  totalVotes: number;
  average: number;
};

/** ----------------------------------------------------------- */

export function useVotes() {
  const {
    votePlayer,
    getPlayers,
    voteRevealed,
    restartVote,
    onPlayerVoted,
    onVoteRevealed,
    onVotesReset,
    removeListeners
  } = useConnection();

  const userStore = useUserStore();

  const fibonacci = [1, 2, 3, 5, 8, 13, 21];
  const suits = ['♥', '♦', '♣', '♠'];
  const playerSuits = reactive(new Map<string, string>());

  const resultVotes = ref<ResultVotes>({
    votes: [],
    totalVotes: 0,
    average: 0
  });

  /** --------------------- Votação --------------------- */
  function handleVote(userVote: number): void {
    votePlayer(userVote, (response) => {
      if (response.success) {
        userStore.setVote(userVote);
      } else {
        console.error('❌ Erro ao votar:', response.message);
      }
    });
  }

  /** --------------------- Players --------------------- */
  function handlePlayers(): void {
    getPlayers((response) => {
      if (response.success) {
        userStore.setPlayers(response.players);
      } else {
        console.error('❌ Erro ao buscar players:', response.message);
      }
    });
  }

  /** --------------------- Listeners Voto --------------------- */
  function listenVotes(): void {
    onPlayerVoted((response) => {
      handlePlayers();
      userStore.setMessage({
        text: response.message,
        success: true
      });
    });
  }

  /** --------------------- Listeners Reveal --------------------- */
  function listenReveal(): void {
    onVoteRevealed((response) => {
      userStore.setVoteRevealed(response.success);
      countVotes(playersWithVotes.value);
    });
  }

  /** --------------------- Listeners Reset --------------------- */
  function listenReset(): void {
    onVotesReset((response) => {
      console.log(response);
      
      userStore.setPlayers(response.players);
      userStore.setVoteRevealed(false);
      resetResults();
    });
  }

  /** --------------------- Suit --------------------- */
  function getRandomSuit(): string {
    return suits[Math.floor(Math.random() * suits.length)];
  }

  function getSuitForPlayer(playerId: string): string {
    if (!playerSuits.has(playerId)) {
      playerSuits.set(playerId, getRandomSuit());
    }
    return playerSuits.get(playerId)!;
  }

  /** --------------------- Computed --------------------- */
  const playersWithVotes = computed<Player[]>(()=>{
    return Object.values(userStore.players).filter((player) => player.vote !== undefined);
  });

  const voteRevealedState = computed(() => userStore.voteRevealed);
  const voteResults = computed(() => userStore.resultVotes);

  /** --------------------- Resultados --------------------- */
  function countVotes(players: Player[]): void {
    const voteCounter: Record<number, number> = {};
    let total = 0;
    let sum = 0;

    players.forEach((player) => {
      if (typeof player.vote === 'number') {
        voteCounter[player.vote] = (voteCounter[player.vote] || 0) + 1;
        sum += player.vote;
        total++;
      }
    });

    const votesArray = Object.entries(voteCounter).map(([vote, qtd]) => ({
      vote: Number(vote),
      qtd
    }));

    resultVotes.value = {
      votes: votesArray,
      totalVotes: total,
      average: total > 0 ? sum / total : 0
    };

    userStore.setResultsVote(resultVotes.value);
  }

  function resetResults(): void {
    userStore.removeResultsVote();
  }

  /** --------------------- Reveal --------------------- */
  function handleRevealVotes() {
    voteRevealed((response) => {
      if (response.success) {
        userStore.setVoteRevealed(true);
        countVotes(playersWithVotes.value);
      } else {
        console.error('❌ Erro ao revelar votos:', response.message);
      }
    });
  }

  /** --------------------- Restart --------------------- */
  function handleRestartVote() {
    restartVote((response) => {
      if (response.success) {
        userStore.setPlayers(response.players);
        userStore.setVoteRevealed(false);
        resetResults();
      } else {
        console.error('❌ Erro ao resetar votos:', response.message);
      }
    });
  }

  /** --------------------- Clean All Listeners --------------------- */
  function removeAllListeners() {
    removeListeners();
  }

  /** --------------------- Export --------------------- */
  return {
    fibonacci,
    handleVote,
    handlePlayers,
    handleRevealVotes,
    handleRestartVote,

    listenVotes,
    listenReveal,
    listenReset,
    removeAllListeners,

    playersWithVotes,
    voteRevealedState,
    voteResults,

    getSuitForPlayer,
    countVotes
  };
}
