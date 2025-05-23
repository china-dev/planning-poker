import { useUserStore } from '../store/user.ts';
import { ref } from 'vue';

type SessionData = {
  userId: string;
  userName: string;
  roomId: string;
  roomName: string;
  isSpectator: boolean;
  isAdmin: boolean;
};

const SESSION_KEY = 'planningPokerSession';

const session = ref<SessionData | null>(null);

// Função interna para gerar uma nova sessão
function createNewSession(): SessionData {
  return {
    userId: crypto.randomUUID(),
    userName: '',
    roomId: '',
    roomName: '',
    isSpectator: false,
    isAdmin: false
  };
}

// Carrega sessão existente ou cria uma nova
function initSession(): void {
  const raw = sessionStorage.getItem(SESSION_KEY);

  if (raw) {
    try {
      session.value = JSON.parse(raw);
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      session.value = createNewSession();
      persistSession();
    }
  } else {
    session.value = createNewSession();
    persistSession();
  }
}

function persistSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session.value));
}

initSession();

export function useSession() {
  const userStore = useUserStore();

  function saveSession(data: Partial<Omit<SessionData, 'userId'>>) {
    if (!session.value) return;
    session.value = {
      ...session.value,
      ...data
    };
    persistSession();
  }

  function loadSession(): SessionData {
    if (!session.value) {
      session.value = createNewSession();
      persistSession();
    }
    userStore.setUser(
      session.value.userName,
      session.value.roomName,
      session.value.roomId,
      session.value.isAdmin,
      session.value.isSpectator,
      session.value.userId
    );
    return session.value;
  }

  function clearSession(): void {
    session.value = null;
    sessionStorage.removeItem(SESSION_KEY);
  }

  function hasSession(): boolean {
    return !!session.value;
  }

  return {
    session,
    saveSession,
    loadSession,
    clearSession,
    hasSession
  };
}
