import { defineStore } from 'pinia';
import ResultVotes from '../components/room/ResultVotes.vue';


type AlertMessage = {
  text: string;
  success: boolean;
  id?: number;
};

type ResultVotes = {
  votes: {vote: number, qtd: number}[],
  totalVotes: number,
  average: number
}

type Player = {
  userId: string;
  userName: string;
  vote: number | null;
  isSpectator: boolean;
};


let alertCounter = 0;

export const useUserStore = defineStore('user', {
	state: () => ({
    userId: '',
		userName: '',
		nameRoom: '',
		roomId: '',
    socketId: null as string | null | undefined,
		isAdmin: false,
		isSpectator: false,
		voteRevealed: false,
    resultVotes: {} as ResultVotes,
    currentVote: 0,
    alerts: [] as AlertMessage[],
    players: [] as Player[]
	}),
	actions: {
		setUser(
      userName: string,
      nameRoom:string,
      roomId: string,
      isAdmin: boolean,
      isSpectator: boolean,
      userId: string
    ) {
			this.userName = userName;
			this.nameRoom = nameRoom;
			this.roomId = roomId;
		  this.isAdmin = isAdmin;
		  this.isSpectator = isSpectator;
      this.userId = userId;
		},
    setSocketId (socketId: string | null | undefined) {
      this.socketId = socketId;
    },
    setVote(vote: number) {
      this.currentVote = vote;
    },
    setPlayers(players: Player[]) {
      this.players = players;
    },
    setVoteRevealed(data: boolean) {
      this.voteRevealed = data;
    },
    setResultsVote(data: ResultVotes) {
      this.resultVotes = data;
    },
    removeResultsVote() {
      this.resultVotes = { votes: [], totalVotes: 0, average: 0 };
      this.currentVote = 0;
    },
    setMessage(data: AlertMessage) {
      this.alerts.push({
        id: alertCounter++,
        text: data.text,
        success: data.success
      });
    },
    removeMessage(id: number) {
      this.alerts = this.alerts.filter((msg) => msg.id !== id);
    }
	}
});