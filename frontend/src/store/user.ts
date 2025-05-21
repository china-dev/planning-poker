import { defineStore } from 'pinia';
import { ref } from 'vue';

type userVote = {
  userName: string;
  vote: number | null;
};

export const useUserStore = defineStore('user', {
	state: () => ({
		userName: '',
		nameRoom: '',
		roomId: '',
    socketId: null as string | null | undefined,
		isAdmin: false,
		isSpectator: false,
		voteRevealed: false,
    currentVote: 0,
    players: []
	}),
	actions: {
		setUser(
      userName: string,
      nameRoom:string,
      roomId: string,
      isAdmin: boolean,
      isSpectator: boolean
    ) {
			this.userName = userName;
			this.nameRoom = nameRoom;
			this.roomId = roomId;
		  this.isAdmin = isAdmin;
		  this.isSpectator = isSpectator;
		},
    setSocketId (socketId: string | null | undefined) {
      this.socketId = socketId;
    },
    setVote(vote: number) {
      this.currentVote = vote;
    },
    setPlayers(players: []) {
      this.players = players;
    },
    setVoteRevealed(data: boolean) {
      this.voteRevealed = data;
    }
	}
});