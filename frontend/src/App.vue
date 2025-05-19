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
  <div>
    <div>
      {{ userStore.socketId }}
      <h1>Status: {{ userStore.socketId ? '🟢 Conectado' : '🔴 Desconectado' }}</h1>
    </div>
    <router-view />
  </div>
</template>

<style scoped>

</style>
