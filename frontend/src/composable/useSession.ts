import { ref } from 'vue';
import { useUserStore } from '../store/user.ts';
import { useConnection } from './useConnection.ts';
import { useRouter } from 'vue-router';

type SessionData = {
  userId: string;
  userName: string;
  roomId: string;
  roomName: string;
  isSpectator: boolean;
  isAdmin: boolean;
  themes: []
};

const SESSION_KEY = 'planningPokerSession';
const TAB_KEY     = 'planningPokerTabId';

const session = ref<SessionData|null>(null);

function createNewSession(): SessionData {
  return {
    userId: crypto.randomUUID(),
    userName: '',
    roomId: '',
    roomName: '',
    isSpectator: false,
    isAdmin: false,
    themes: []
  };
}

function initSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  session.value = raw ? JSON.parse(raw) : createNewSession();
  localStorage.setItem(SESSION_KEY, JSON.stringify(session.value));
}

function getOrCreateTabId(): string {
  let id = sessionStorage.getItem(TAB_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(TAB_KEY, id);
  }
  return id;
}

initSession();

export function useSession() {
  const userStore = useUserStore();
  const router = useRouter();
  const {
    onMultipleTabs,
    leaveRoom,
    disconnectServer,
    onRoomClosed,
    createServer
  } = useConnection();
  const tabId = getOrCreateTabId();

  function saveSession(data: Partial<Omit<SessionData, 'userId'>>) {
    if (!session.value) return;
    session.value = { ...session.value, ...data };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session.value));
  }

  function loadSession() {
    if (!session.value) initSession();

    const s = session.value!;

    userStore.setUser(
      s.userName,
      s.roomName,
      s.roomId,
      s.isAdmin,
      s.isSpectator,
      s.userId
    );

    return { ...s, tabId };
  }

  function clearAll() {
    clearSession();
    localStorage.clear();
    sessionStorage.clear();
    userStore.$reset();
  }

  function logout() {
    leaveRoom((res) => {
      if (!res.success) {
        console.warn(res.message);
      }
      disconnectServer();
      clearAll();
      createServer();
      loadSession();
      router.replace({ name: 'Home' });
    });
  }

  function clearSession() {
    session.value = null;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TAB_KEY);
  }

  function hasSession() {
    return !!session.value;
  }

  function startListeningOnMultipleTabs() {
    onMultipleTabs((_data) => {
      const title = `Ops!!! 🤭🙅‍♂️`;
      const text = `Você abriu a aplicação em outra aba. Não é possivél dar 2 votos` ;
      const type = 'multipleSessions';

      const message = {
        text,
        title,
        type
      }

      userStore.setAlert(message);

      router.push('/');
    });
  }

  function startOncloseRoom () {
    onRoomClosed((data) => {
      alert(data.message);
      clearAll();
      router.replace({ name: 'Home' });
    });
  }

  function verifySession () {
    if (hasSession()) {
    const session = loadSession();

      if (
          session.userId?.length &&
          session.userName &&
          session.roomName &&
          session.roomId
        ) {
            const title = `Ops!!! 🤭`;
            const text = `${session.userName} parece que você já participa da sala ${session.roomName} \n\n` +
              `Deseja continuar de onde parou?` ;
            const type = 'reconnectSession';

            const data = {
              text,
              title,
              type
            }

            userStore.setAlert(data);
      } else {
        const title = `Ops!!! 🫷`;
        const text = `Realize o login para continuar, utilize o ID da Sala fornecido pelo Admin` ;
        const type = 'loginHome';

        const message = {
          text,
          title,
          type
        }

        userStore.setAlert(message);
      }
    }
  }

  return {
    session,
    tabId,
    saveSession,
    loadSession,
    clearSession,
    hasSession,
    startListeningOnMultipleTabs,
    verifySession,
    logout,
    startOncloseRoom
  };
}
