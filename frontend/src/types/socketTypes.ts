export interface ClientToServerEvents {
  createRoom: (
    data: { userName: string; roomName: string; roomId: string },
    callback: (response: any) => void
  ) => void;
  joinedPlayer: (
    data: { userName: string; roomId: string; isSpectator: boolean },
    callback: (response: any) => void
  ) => void;
  votePlayer: (
    data: { roomId: string; vote: number },
    callback: (response: any) => void
  ) => void;
  getPlayers: (
    roomId: string,
    callback: (response: any) => void
  ) => void;
}

export interface ServerToClientEvents {
  playerVoted: (data: { socketId: string; userName: string; vote: number }) => void;
}
