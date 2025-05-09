<script setup lang="ts">
  import HeaderRoom from '../components/room/HeaderRoom.vue';
  import VotesRoom from '../components/room/VotesRoom.vue';

  import { useUserStore } from '../store/user.ts';

  const userStore = useUserStore();
</script>

<template>
  <main>
    <HeaderRoom />
    
    <!-- <div>
      <pre>
        {{  userStore }}
      </pre>
    </div> -->

    <VotesRoom
      v-if="!userStore.isSpectator"
    />
  </main>
</template>