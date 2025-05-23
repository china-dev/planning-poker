<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useConnection } from './composable/useConnection';
  import AlertMessages from './components/common/AlertMessages.vue';
  import FooterBar from './components/common/FooterBar.vue';
  import { useSession } from './composable/useSession.ts';
  import { useFormHome } from './composable/UseFormHome.ts';

  const { loadSession, hasSession } = useSession();
  const { handleJoinRoom } = useFormHome();

  const { createServer, disconnectServer} = useConnection();

  onMounted(() => {
    createServer();
    if (hasSession()) {
      
      const session = loadSession();
      if (session?.roomId.length && session.userId.length && session.userName) {
        handleJoinRoom(
          session.userName,
          session.roomId,
          session.isSpectator as boolean,
          session.isAdmin as boolean
        );
      }
    }
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