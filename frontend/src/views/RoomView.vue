<script setup lang="ts">
  import HeaderRoom from '../components/room/HeaderRoom.vue';
  import VotesRoom from '../components/room/VotesRoom.vue';
  import TableVotes from '../components/room/TableRoom.vue';
  import ListPlayers from '../components/room/ListPlayers.vue';
  import { utils } from '../composable/useUtils.ts';
  import { useUserStore } from '../store/user.ts';
  import { onMounted } from 'vue';


  const userStore = useUserStore();
</script>

<template>
  <main class="flex flex-col justify-between">
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