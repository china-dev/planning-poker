<script setup lang="ts">
  import { useUtils } from '../../composable/useUtils.ts';
  import { onMounted } from 'vue';

  const {
    startListeningPlayerJoin,
    players,
    getRoleEmoji,
    handleGetPlayers,
    startListeningPlayerDisconnect,
    startListeningPlayerLeft
  } = useUtils();

  onMounted(() => {
    handleGetPlayers();
    startListeningPlayerJoin();
    startListeningPlayerDisconnect();
    startListeningPlayerLeft();
  });

</script>

<template>
  <aside class="fixed top-40 right-6">
    <TransitionGroup name="fade">
      <div v-for="player in players" :key="player.userName">
        <p class="text-xl font-semibold">🟢 {{ player.userName }} {{ getRoleEmoji(player) }}</p>
      </div>
    </TransitionGroup>
  </aside>
</template>