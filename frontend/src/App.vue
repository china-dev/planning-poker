<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useConnection } from './composable/useConnection';
  import AlertMessages from './components/common/AlertMessages.vue';
  import FooterBar from './components/common/FooterBar.vue';
  import { useSession } from './composable/useSession.ts';
  import ModalAlert from './components/common/ModalAlert.vue';
  import { useUserStore } from './store/user.ts';

  const { loadSession, hasSession, startListeningOnMultipleTabs } = useSession();
 
  const userStore = useUserStore();

  const { createServer, disconnectServer} = useConnection();

  onMounted(() => {
    startListeningOnMultipleTabs();
    createServer();
    if (hasSession()) {
      const session = loadSession();

      if (
          session.userId?.length &&
          session.userName &&
          session.roomName &&
          session.roomId
        ) {

            const title = `Ops!!! 🤭`;
            const text = `${session.userName} parece que você já participa da sala ${session.roomName} \n\n` +
              `Deseja continuar de onde parou?` ;
            const type = 'reconnectSession';

            const data = {
              text,
              title,
              type
            }

            userStore.setAlert(data);
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
    <ModalAlert v-if="userStore.modalActive" />
    <FooterBar />
  </div>
</template>

<style scoped>

</style>