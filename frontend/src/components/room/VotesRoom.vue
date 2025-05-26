<script setup lang="ts">
  import TrailCards from "./TrailCards.vue";
  import { useVotes } from "../../composable/useVotes.ts";
  import ResultVotes from './ResultVotes.vue';
  
  const { voteRevealedState } = useVotes();

</script>
<template>
  <section>    
    <transition name="fade" mode="out-in">
      <ResultVotes v-if="voteRevealedState" />
      <TrailCards v-else />
    </transition>
  </section>
</template>

<style scoped>

</style>