<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useUserStore } from '../../store/user';
  import { useVotes } from '../../composable/useVotes.ts';
  import Card from './CardVote.vue';

  const { isAdmin } = useUserStore();

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
  <section class="flex flex-col justify-center items-center">
    <div class="flex justify-center items-center mb-12">
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
    <div class="tableVotes">
      <TransitionGroup
        class="flex justify-center items-start"
        name="fade"
        mode="out-in"
        tag="div"
      >
        <Card
          v-for="(item, index) in filteredPlayers"
          :key="index"
          :value="item"
          class="cardTable"
        />
      </TransitionGroup>
    </div>
  </section>
</template>


<style scoped src="../../styles/tableVotes.css"> 

</style>