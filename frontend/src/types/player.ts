export interface Player {
  userId: string;
  userName: string;
  isAdmin: boolean;
  isSpectator: boolean;
  vote: number | null;
}

export type Players = Record<string, Omit<Player, 'isSpectator' | 'vote'> & {
  isSpectator?: boolean;
  vote?: number;
}>;