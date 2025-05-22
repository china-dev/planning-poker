<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useUserStore } from '../../store/user.ts';
  import { utils } from '../../composable/useUtils.ts';
  import { useVotes } from '../../composable/useVotes.ts';

  const {userName, nameRoom, isAdmin, roomId } = useUserStore();
  const { invitePlayers } = utils();

  const {
    handlePlayers,
    filteredPlayers,
    revealVotes,
    startListeningVotes,
    stopListeningVotes,
    startListeningReveal,
    stopListeningReveal,
    handleRestartVote,
    startOnVotesReset,
    stopRemoveOnVotesReset,
    dataVoteRevelead
  } = useVotes();

  onMounted(() => {
    handlePlayers();
    startListeningVotes();
    startListeningReveal();
    startOnVotesReset();
  });

  onBeforeUnmount(() => {
    stopListeningVotes();
    stopListeningReveal();
    stopRemoveOnVotesReset();
  });
</script>

<template>
  <nav class="p-7 flex justify-between navRoom bg-gray-800 text-white shadow-lg">
    <h1 class="text-3xl font-bold">♣️{{ nameRoom }}♦️</h1>
    <div class="flex justify-center items-center">
      <button
        v-if="isAdmin"
        :disabled="!filteredPlayers.length"
        @click="filteredPlayers.length ? revealVotes() : null"
        :class="[
          !filteredPlayers.length ? 'cursor-not-allowed opacity-50' : '',
          'p-3 bg-blue-500 text-white rounded-lg w-40 hover:bg-blue-600 font-bold mr-5'
        ]"
      >
        Revelar Cartas
      </button>
      <button
        v-if="isAdmin"
        :disabled="!dataVoteRevelead"
        @click="handleRestartVote"
        :class="[
          !dataVoteRevelead ? 'cursor-not-allowed opacity-50' : '',
          'p-3 bg-blue-500 text-white rounded-lg w-auto hover:bg-blue-600 font-bold'
        ]"
      >
        Reiniciar
      </button>
    </div>
    <div class="flex items-center">
      <p class="text-2xl font-bold mr-10">
        {{ userName }}
      </p>
      <button
        @click="invitePlayers(userName, nameRoom, roomId)"
        v-if="isAdmin" 
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