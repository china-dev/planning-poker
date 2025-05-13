import { useUserStore } from '../store/user.ts';
import { useConnection } from './useConnection.ts';



export function useVotes () {
  const { votePlayer, getPlayers } = useConnection();
  const userStore = useUserStore();
  
  const fibonacci: number[] = [
    1, 2, 3, 5, 8, 13, 21
  ]

  function handleVote (userVote: number) :void {
    userStore.setVote(userVote);
    votePlayer(userVote);
  }

  function handlePlayers (): void {
    getPlayers();
  }

  return { fibonacci, handleVote, handlePlayers };
}