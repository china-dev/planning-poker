<script setup lang="ts">
  import HeaderRoom from '../components/room/HeaderRoom.vue';
  import VotesRoom from '../components/room/VotesRoom.vue';
  import TableVotes from '../components/room/TableRoom.vue';
  import ListPlayers from '../components/room/ListPlayers.vue';
  import ListThemes from '../components/room/ListThemes.vue';
  import { useUserStore } from '../store/user.ts';
  import { useConnection } from '../composable/useConnection.ts';
  import { onBeforeUnmount } from "vue";


  const userStore = useUserStore();
  const { removeListeners } = useConnection();
  
  onBeforeUnmount(() => {
    removeListeners();
  });
</script>

<template>
  <main class="flex flex-col justify-between h-full">
    <ListPlayers />
    <ListThemes />
    <HeaderRoom />
    <TableVotes />
    <VotesRoom
      v-if="!userStore.isSpectator"
    />
  </main>
</template>