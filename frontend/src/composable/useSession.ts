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
  const { onMultipleTabs } = useConnection();
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

  return {
    session,
    tabId,
    saveSession,
    loadSession,
    clearSession,
    hasSession,
    startListeningOnMultipleTabs,
  };
}
