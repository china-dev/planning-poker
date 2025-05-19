<script setup lang="ts">
  import { useUserStore } from '../../store/user';
  import { onMounted } from 'vue';
  import { useVotes } from "../../composable/useVotes.ts";
  import Card from './CardVote.vue';
  
  const { handlePlayers, filteredPlayers } = useVotes(); 

  const userStore = useUserStore();

  onMounted(() => {
    handlePlayers();
  });
  
</script>

<template>
  <div class="flex justify-center items-center">
    <Card
        v-for="(item, index) in filteredPlayers"
        :key="index"
        :value="item"
      />
  </div>
</template>