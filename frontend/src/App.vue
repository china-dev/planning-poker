<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useConnection } from './composable/useConnection';
  import AlertMessages from './components/common/AlertMessages.vue';

  const { createServer, disconnectServer} = useConnection();

  onMounted(() => {
    createServer();
  });

  onBeforeUnmount(() => {
    disconnectServer();
  });
  
</script>

<template>
  <router-view />
  <AlertMessages />
</template>

<style scoped>

</style>