<script setup lang="ts">
  import { utils } from '../../composable/useUtils.ts';
  import { onMounted } from 'vue';

  const {
    onPlayersJoined,
    players,
    getRoleEmoji,
    handleGetPlayers,
    handleOnPlayerDisconnect
  } = utils();

  onMounted(() => {
    handleGetPlayers();
    onPlayersJoined();
    handleOnPlayerDisconnect();
  });

</script>

<template>
  <aside class="fixed top-40 right-6">
    <TransitionGroup name="fade">
      <div v-for="player in players" :key="player.userName">
        <p>🟢 {{ player.userName }} {{ getRoleEmoji(player) }}</p>
      </div>
    </TransitionGroup>
  </aside>
</template>