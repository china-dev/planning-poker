import { defineStore } from 'pinia';
import type { Player } from '../types/player';

type AlertMessage = {
  text: string;
  success: boolean;
  id: number;
};

type Themes = {
  name: string;
  mostVoted: number;
  avarage: number;
};

type AlertData = { text: string; success: boolean };

type ModalAlerts = {
  title: string;
  text: string;
  type: string;
};

type ResultVotes = {
  votes: { vote: number; qtd: number }[],
  totalVotes: number,
  average: number,
  modeVote: number
};

let alertCounter = 0;

// Chave para persistir temas
const THEMES_STORAGE_KEY = 'planningPokerThemes';

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
    mostVoted: 0,
    initVotes: false,
    // Inicia com o que estiver no localStorage
    themes: JSON.parse(localStorage.getItem(THEMES_STORAGE_KEY) || '[]') as Themes[],
    resultVotes: {} as ResultVotes,
    currentVote: 0,
    alerts: [] as AlertMessage[],
    modalActive: false,
    modal: {} as ModalAlerts,
    players: [] as Player[]
  }),

  actions: {
    setUser(
      userName: string,
      nameRoom: string,
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

    setSocketId(socketId: string | null | undefined) {
      this.socketId = socketId;
    },

    setRoomId(roomId: string) {
      this.roomId = roomId;
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

    setInitVotes(data: boolean) {
      this.initVotes = data;
    },

    setThemes(data: Themes) {
      this.initVotes = true;
      this.themes.push(data);
      localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(this.themes));
    },

    setResultsVote(data: ResultVotes) {
      this.resultVotes = data;
    },

    updateLastTheme(data: { mostVoted: number; avarage: number }) {
      const idx = this.themes.length - 1;
      if (idx < 0) return;
      this.themes[idx] = {
        ...this.themes[idx],
        mostVoted: data.mostVoted,
        avarage: data.avarage
      };
      localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(this.themes));
    },

    removeResultsVote() {
      this.resultVotes = { votes: [], totalVotes: 0, average: 0, modeVote: 0 };
      this.currentVote = 0;
    },

    setMessage(data: AlertData) {
      this.alerts.push({
        id: alertCounter++,
        text: data.text,
        success: data.success
      });
    },

    setAlert(data: ModalAlerts) {
      this.modalActive = true;
      this.modal.title = data.title;
      this.modal.text = data.text;
      this.modal.type = data.type;
    },

    removeAlert() {
      this.modalActive = false;
      this.modal.title = '';
      this.modal.text = '';
      this.modal.type = '';
    },

    removeMessage(id: number) {
      this.alerts = this.alerts.filter((msg) => msg.id !== id);
    }
  }
});
