<script setup lang="ts">
  import { onMounted  } from 'vue';
  import { useUserStore } from '../../store/user.ts';
  import { useUtils } from '../../composable/useUtils.ts';
  import { useVotes } from '../../composable/useVotes.ts';

  const userStore = useUserStore();
  const { invitePlayers } = useUtils();
  
  const {
    handlePlayers,
    playersWithVotes,
    handleRevealVotes,
    listenVotes,
    listenReveal,
    handleRestartVote,
    listenReset,
    voteRevealedState
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
    <div class="flex justify-center items-center">
      <button
        v-if="userStore.isAdmin"
        :disabled="!playersWithVotes.length"
        @click="playersWithVotes.length ? handleRevealVotes() : null"
        :class="[
          !playersWithVotes.length ? 'cursor-not-allowed opacity-50' : '',
          'p-3 bg-blue-500 text-white rounded-lg w-40 hover:bg-blue-600 font-bold mr-5'
        ]"
      >
        Revelar Cartas
      </button>
      <button
        v-if="userStore.isAdmin"
        :disabled="!voteRevealedState"
        @click="handleRestartVote"
        :class="[
          !voteRevealedState ? 'cursor-not-allowed opacity-50' : '',
          'p-3 bg-blue-500 text-white rounded-lg w-auto hover:bg-blue-600 font-bold'
        ]"
      >
        Reiniciar
      </button>
    </div>
    <div class="flex items-center">
      <p class="text-2xl font-bold mr-10">
        {{ userStore.userName }}
      </p>
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
        "
      >
        Convidar jogadores
      </button>
    </div>
  </nav>
</template>