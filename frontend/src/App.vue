<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useConnection } from './composable/useConnection';
  import AlertMessages from './components/common/AlertMessages.vue';
  import FooterBar from './components/common/FooterBar.vue';

  const { createServer, disconnectServer} = useConnection();

  onMounted(() => {
    createServer();
  });

  onBeforeUnmount(() => {
    disconnectServer();
  });
  
</script>

<template>
  <div class="wrapContentPage bg-blue-50">
    <router-view />
    <AlertMessages />
    <FooterBar />
  </div>
</template>

<style scoped>

</style>