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
    stopListeningReveal
  } = useVotes();

  onMounted(() => {
    handlePlayers();
    startListeningVotes();
    startListeningReveal();
  });

  onBeforeUnmount(() => {
    stopListeningVotes();
    stopListeningReveal();
});
</script>

<template>
  <section>
    <div class="flex justify-center items-center">
      <button
        v-if="isAdmin"
        @click="filteredPlayers.length ? revealVotes : null"
        :class="[
          !filteredPlayers.length ? 'buttonDisable' : '',
          'px-4 py-2 bg-green-600 text-white rounded w-40 mb-12 hover:bg-green-900'
        ]"
      >
        Revelar Cartas
      </button>
    </div>
    <div class="flex justify-center items-start">
      <Card
          v-for="(item, index) in filteredPlayers"
          :key="index"
          :value="item"
        />
    </div>
  </section>
</template>


<style scoped src="../../styles/card.css"> 

</style>