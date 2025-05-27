import type { Players } from './player.ts';

export interface CallbackResponse {
  success: boolean;
  message: string;
  room?: {
    roomName: string;
    players: Players;
    voteReveal?: boolean;
  };
}

export interface CallbackPlayers {
  success: boolean;
  message: string;
  players?: Players;
}

export interface ClientToServerEvents {
  createRoom: (
    data: {
      userId: string;
      userName: string;
      roomId: string;
      roomName: string;
      tabId: string;
    },
    callback: (response: CallbackResponse) => void
  ) => void;

  joinedPlayer: (
    data: {
      userId: string;
      userName: string;
      roomId: string;
      isSpectator: boolean;
      isAdmin: boolean;
      tabId: string;
    },
    callback: (response: CallbackResponse) => void
  ) => void;

  votePlayer: (
    data: { roomId: string; vote: number; userId: string },
    callback: (response: CallbackResponse) => void
  ) => void;

  getPlayers: (
    roomId: string,
    callback: (response: CallbackPlayers) => void
  ) => void;

  voteRevealed: (
    roomId: string,
    callback: (response: CallbackResponse) => void
  ) => void;

  restartVote: (
    roomId: string,
    callback: (response: CallbackPlayers) => void
  ) => void;

  leaveRoom: (
    data: { userId: string; roomId: string },
    callback: (response: CallbackResponse) => void
  ) => void;

  InitVotes: (
    data: { roomId: string, theme: { name: string }},
    callback: (response: CallbackResponse) => void
  ) => void;
}

export interface ServerToClientEvents {
  onJoinedPlayer: (data: {
    success: true;
    message: string;
    players: Players;
  }) => void;

  playerVoted: (data: {
    userId: string;
    userName: string;
    vote: number;
    message: string;
  }) => void;

  onVoteRevealed: (data: {
    success: true;
    message: string;
  }) => void;

  onVotesReset: (data: {
    success: true;
    message: string;
    players: Players;
  }) => void;

  onMultipleTabs: (data: {
    success: true;
    message: string;
  }) => void;

  playerDisconnected: (data: {
    userId: string;
    success: true;
    message: string;
  }) => void;

  roomClosed: (data: {
    success: true;
    message: string;
  }) => void;

  playerLeft: (data: {
    success: true;
    message: string;
  }) => void;

  onInitVotes: (data: {
    success: true;
    message: string;
    themes: []
  }) => void;
}


