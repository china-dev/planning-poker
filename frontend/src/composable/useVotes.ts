import { computed, reactive, ref } from 'vue';
import { useUserStore } from '../store/user.ts';
import { useConnection } from './useConnection.ts';

type Player = {
  userName: string;
  isAdmin: boolean;
  isSpectator?: boolean;
  vote?: number;
};

type ResultVotes = {
  votes: {vote: number, qtd: number}[],
  totalVotes: number,
  avarage: number
}

export function useVotes () {
  const { 
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
  } = useConnection();

  const userStore = useUserStore();
  const fibonacci: number[] = [1, 2, 3, 5, 8, 13, 21];
  const suits = ['♥', '♦', '♣', '♠'];
  const playerSuits = reactive(new Map<string, string>());
  let ListResultVotes = ref<ResultVotes>({
    votes: [],
    totalVotes: 0,
    avarage: 0
  });

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
    onPlayerVoted((response) => {
      handlePlayers();
      userStore.setMessage({
          text: response.message,
          success: true
        });
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

  const filteredPlayers = computed<Player[]>(() => {
    return Object.values(userStore.players).filter(player => player.vote !== undefined);
  });

  const dataVoteRevelead = computed(() => {
    return userStore.voteRevealed;
  });

  const dataResultList = computed(() => {
    return userStore.resultVotes;
  });

  function countVotes(players: Player[]): void {
    const votosContados: Record<number, number> = {};
    let totalVotes = 0;
    let sumVotes = 0;

    players.forEach((player) => {
      if (typeof player.vote === 'number') {
        votosContados[player.vote] = (votosContados[player.vote] || 0) + 1;
        sumVotes = sumVotes + player.vote;
        totalVotes++;
      }
    });

    const resultado = Object.entries(votosContados).map(([vote, qtd]) => ({
      vote: Number(vote),
      qtd,
    }));

    console.log(sumVotes);
    console.log(totalVotes);
    

    ListResultVotes.value = {
      votes: resultado,
      totalVotes,
      avarage: sumVotes/totalVotes
    };

    userStore.setResultsVote(ListResultVotes.value);
  }
    
  function revealVotes() {
    voteRevelead((response) => {
      if (!response.success) {
        console.error('Erro ao revelar votos:', response.message);
      } else {
        userStore.setVoteRevealed(response.success);
        countVotes(filteredPlayers.value);
      }
    });
  }

  function startListeningReveal(): void {
    onVoteRevelead((response) => {
      userStore.setVoteRevealed(response.success);
      countVotes(filteredPlayers.value);
    });
  }

  function stopListeningReveal(): void {
    removeVoteReveleadListener();
  }

  function startOnVotesReset(): void {
    onVotesReset((response) => {
      userStore.setPlayers(response.players);
      userStore.setVoteRevealed(false);
    });
  }

  function stopRemoveOnVotesReset(): void {
    removeOnVotesReset();
  }

  function handleRestartVote() {
    restartVote((response: { success: boolean; message: string; players: any }) => {
      userStore.setPlayers(response.players);
      userStore.setVoteRevealed(false);
      userStore.removeResultsVote({
        votes: [],
        totalVotes: 0
       });
    });
  }

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
    stopListeningReveal,
    handleRestartVote,
    startOnVotesReset,
    stopRemoveOnVotesReset,
    dataVoteRevelead,
    countVotes,
    dataResultList
  };
}
