<script setup lang="ts">
  import { useConnection } from './composable/useConnection';
  import { useUserStore } from "./store/user.ts";

  const { connectServer } = useConnection();
  const userStore = useUserStore();

  connectServer();
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
