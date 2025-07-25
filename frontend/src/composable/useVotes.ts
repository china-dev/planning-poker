import { computed, reactive, ref } from 'vue';
import { useUserStore } from '../store/user';
import { useConnection } from './useConnection';
import type { Player, Players } from '../types/player';

/** ------------------------- Tipagem ------------------------- */

type ResultVotes = {
  votes: { vote: number; qtd: number }[];
  totalVotes: number;
  average: number;
  modeVote: number;
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
    removeListeners,
    onInitVotes,
    initVotesGeral
  } = useConnection();

  const userStore = useUserStore();

  const fibonacci = [1, 2, 3, 5, 8, 13, 21];
  const suits = ['♥', '♦', '♣', '♠'];
  const playerSuits = reactive(new Map<string, string>());

  const resultVotes = ref<ResultVotes>({
    votes: [],
    totalVotes: 0,
    average: 0,
    modeVote: 0
  });

  /** --------------------- Votação --------------------- */
  function startTheme(name: string) {
    initVotesGeral(name, (res) => {
      if (!res.success) {
        userStore.setMessage({ text: res.message, success: false });
      }
    });
  }

  function initVotes (): void {
     const title = `Lets Start ▶️`;
      const text = `Configure o tema da votação!` ;
      const type = 'initVotes';

      const message = {
        text,
        title,
        type
      }
    userStore.setAlert(message);
  }

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
      if (response.success && response.players) {
        userStore.setPlayers(toArray(response.players));
      } else {
        console.error('❌ Erro ao buscar players:', response.message);
      }
    });
  }

  function toArray(raw: Players): Player[] {
    return Object.values(raw).map(p => ({
      userId:    p.userId,
      userName:  p.userName,
      isAdmin:   p.isAdmin,
      isSpectator: !!p.isSpectator,
      vote:      typeof p.vote === 'number' ? p.vote : null,
    }));
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

  function startLinstenerOnInitVotes () {
    onInitVotes((data) => {
      if (data.success) {
        userStore.setInitVotes(true);
        data.themes.forEach((t) => {
          userStore.setThemes(t);
        });
      }
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
      if (response.success && response.players) {
        userStore.setPlayers(toArray(response.players))
        userStore.setVoteRevealed(false);
        resetResults();
        userStore.setInitVotes(false);
      }
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
    return Object.values(userStore.players).filter((player) => player.vote !== null);
  });

  const voteRevealedState = computed(() => userStore.voteRevealed);
  const voteResults = computed(() => userStore.resultVotes);
  
  /** --------------------- Resultados --------------------- */
  function countVotes(players: Player[]): void {
    let modeVote = 0;
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

    const average = total > 0 ? sum / total : 0;

    let modeCount = 0;
    for (const { vote, qtd } of votesArray) {
      if (qtd > modeCount) {
        modeCount = qtd;
        modeVote = vote;
      }
    }

    resultVotes.value = {
      votes: votesArray,
      totalVotes: total,
      average,
      modeVote
    };

    userStore.updateLastTheme({
      mostVoted: resultVotes.value.modeVote,
      avarage:  resultVotes.value.average
    });

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
      if (response.success && response.players) {
        userStore.setPlayers(toArray(response.players))
        userStore.setVoteRevealed(false);
        resetResults();
        userStore.setInitVotes(false);
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
    initVotes,
    startTheme,

    listenVotes,
    listenReveal,
    listenReset,
    startLinstenerOnInitVotes,
    removeAllListeners,

    playersWithVotes,
    voteRevealedState,
    voteResults,

    getSuitForPlayer,
    countVotes
  };
}
