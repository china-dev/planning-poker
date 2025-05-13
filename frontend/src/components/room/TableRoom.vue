<script setup lang="ts">
  import { useUserStore } from '../../store/user';
  import { onMounted } from 'vue';
  import { useVotes } from "../../composable/useVotes.ts";
  
  const { handlePlayers } = useVotes(); 

  const userStore = useUserStore();

  onMounted(() => {
    handlePlayers();
  });
  
</script>

<template>
  <div>
    oi
  </div>
</template>