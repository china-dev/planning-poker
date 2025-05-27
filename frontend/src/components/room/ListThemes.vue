<script setup lang="ts">
import { useUserStore } from '../../store/user';
import { onUnmounted } from 'vue';
import { useVotes } from '../../composable/useVotes';

const userStore = useUserStore();
const { startLinstenerOnInitVotes } = useVotes();

onUnmounted(() => {
  startLinstenerOnInitVotes();
})

</script>

<template>
  <aside class="fixed top-40 left-6">
    <TransitionGroup name="fade">
      <div v-for="item in userStore.themes" :key="item.name" class="mb-4">
        <p class="text-xl font-semibold">📋 {{ item.name }}</p>
        <p v-if="item.mostVoted" class="text-sm font-semibold">🏆 Mais votado: {{ item.mostVoted }}</p>
        <p v-if="item.mostVoted" class="text-sm font-semibold">📊 Média: {{ item.avarage }}</p>
      </div>
    </TransitionGroup>
  </aside>
</template>