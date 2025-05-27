<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue';
  import { useConnection } from './composable/useConnection';
  import AlertMessages from './components/common/AlertMessages.vue';
  import FooterBar from './components/common/FooterBar.vue';
  import { useSession } from './composable/useSession.ts';
  import ModalAlert from './components/common/ModalAlert.vue';
  import { useUserStore } from './store/user.ts';

  const { startListeningOnMultipleTabs } = useSession();
 
  const userStore = useUserStore();

  const { createServer, disconnectServer} = useConnection();

  onMounted(() => {
    startListeningOnMultipleTabs();
    createServer();
  });

  onBeforeUnmount(() => {
    disconnectServer();
  });
  
</script>

<template>
  <div class="wrapContentPage bg-blue-50">

       <div class="fixed top-40">
      <pre>
        {{ userStore }}
      </pre>
    </div>
    <router-view />
    <AlertMessages />
    <ModalAlert v-if="userStore.modalActive" />
    <FooterBar />
  </div>
</template>

<style scoped>

</style>