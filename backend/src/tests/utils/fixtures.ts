export const users = {
  admin: { 
    userId: 'u1',
    userName: 'Admin',
    tabId: 'tab-1' 
  },
  player: {
    userId: 'u2',
    userName: 'Player',
    tabId: 'tab-2',
    isSpectator: false,
    isAdmin: false 
  },
  spectator: {
    userId: 'u3', 
    userName: 'Arya Stark',
    tabId: 'tab-3',
    isSpectator: true,
    isAdmin: false 
  },
  adminOtherTab: { 
    userId: 'u1',
    userName: 'Admin',
    tabId: 'tab-4' 
  },
  playerOtherTab: {
    userId: 'u2',
    userName: 'Player',
    tabId: 'tab-5',
    isSpectator: false,
    isAdmin: false 
  },
};

export const rooms = {
  default: { roomId: 'room-123', roomName: 'Sala de Teste' },
  other:   { roomId: 'room-456', roomName: 'Outra Sala' },
};

export const theme = {
  default: { 
    roomId: 'room-123',
    theme: {
      name: 'Theme default',
      mostVoted: 0,
      average: 0
    }
  },
  test: { 
    roomId: 'room-123',
    theme: {
      name: 'Theme default',
      mostVoted: 0,
      average: 0
    }
  },
}
