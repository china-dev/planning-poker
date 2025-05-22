<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
  import { useConnection } from './composable/useConnection';
  import { useUserStore } from "./store/user.ts";

  const { createServer, disconnectServer} = useConnection();

  onMounted(() => {
    createServer();
  });

  onBeforeUnmount(() => {
    disconnectServer();
  });
  
  const userStore = useUserStore();

</script>

<template>
  <router-view />
</template>

<style scoped>

</style>
