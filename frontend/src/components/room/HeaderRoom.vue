<script setup lang="ts">
  import { onMounted  } from 'vue';
  import { useUserStore } from '../../store/user.ts';
  import { useUtils } from '../../composable/useUtils.ts';
  import { useVotes } from '../../composable/useVotes.ts';
  import { useSession } from '../../composable/useSession.ts';

  const userStore = useUserStore();
  const { invitePlayers } = useUtils();
  const { logout } = useSession(); 
  
  const {
    handlePlayers,
    playersWithVotes,
    handleRevealVotes,
    listenVotes,
    listenReveal,
    handleRestartVote,
    listenReset,
    voteRevealedState,
    initVotes
  } = useVotes();
  
  onMounted(() => {
    handlePlayers();
    listenVotes();
    listenReveal();
    listenReset();
  });
</script>

<template>
  <nav class="p-7 flex justify-between navRoom bg-gray-800 text-white shadow-lg">
    <h1 class="text-3xl font-bold">♣️{{ userStore.nameRoom }}♦️</h1>
    <div class="flex items-center">
      <p class="text-2xl font-bold mr-10 text-nowrap">
        {{ userStore.userName }}
      </p>
      <div class="mr-4">
        <button
          v-if="userStore.isAdmin && !userStore.initVotes"
          @click="initVotes()"
          :class="[
            'p-3 bg-blue-500 text-white rounded-full w-40 hover:bg-blue-600 font-bold'
          ]"
        >
          Iniciar votação
        </button>
        <template v-if="userStore.initVotes">
          <button
            v-if="userStore.isAdmin && !voteRevealedState"
            :disabled="!playersWithVotes.length"
            @click="playersWithVotes.length ? handleRevealVotes() : null"
            :class="[
              !playersWithVotes.length ? 'cursor-not-allowed opacity-50' : '',
              'p-3 bg-blue-500 text-white rounded-full w-40 hover:bg-blue-600 font-bold'
            ]"
          >
            Revelar Cartas
          </button>
          <button
            v-if="userStore.isAdmin && voteRevealedState"
            :disabled="!voteRevealedState"
            @click="handleRestartVote"
            :class="[
              !voteRevealedState ? 'cursor-not-allowed opacity-50' : '',
              'p-3 bg-blue-500 text-white rounded-full w-auto hover:bg-blue-600 font-bold'
            ]"
          >
            Reiniciar
          </button>
        </template>
      </div>
      <button
        @click="invitePlayers(userStore.userName, userStore.nameRoom, userStore.roomId)"
        v-if="userStore.roomId" 
        class="
        p-3
        rounded-full
        font-bold
        hover:bg-blue-600
        text-white
        bg-blue-500
        text-nowrap
        "
      >
        Convidar jogadores
      </button>
      <button
        @click="logout()"
        class="
          p-3
          rounded-full
          font-bold
          hover:bg-red-600
          text-white
          bg-red-500
          mx-4
        "
      >
        Sair 🔚👋
      </button>
    </div>
  </nav>
</template>