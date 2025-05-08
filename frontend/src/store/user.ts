import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	state: () => ({
		userName: '',
		nameRoom: '',
		roomId: '',
    socketId: null as string | null | undefined,
		isAdmin: false,
		isSpectator: false
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
    }
	}
});