<script setup lang="ts">
  import HeaderRoom from '../components/room/HeaderRoom.vue';
  import VotesRoom from '../components/room/VotesRoom.vue';
  import TableVotes from '../components/room/TableRoom.vue';
  import ListPlayers from '../components/room/ListPlayers.vue';
  import { useUserStore } from '../store/user.ts';


  const userStore = useUserStore();
</script>

<template>
  <main class="flex flex-col justify-between h-full">
    <!-- <div class="fixed top-80">
      <pre>
        {{ userStore }}
      </pre>
    </div> -->
    <ListPlayers />
    <HeaderRoom />
    <TableVotes />
    <VotesRoom
      v-if="!userStore.isSpectator"
    />
  </main>
</template>