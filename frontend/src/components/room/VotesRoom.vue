<script setup lang="ts">
  import TrailCards from "./TrailCards.vue";
  import { useVotes } from "../../composable/useVotes.ts";
  import ResultVotes from './ResultVotes.vue';
  
  const { dataVoteRevelead } = useVotes();

</script>
<template>
  <section>    
    <transition name="fade" mode="out-in">
      <ResultVotes v-if="dataVoteRevelead" />
      <TrailCards v-else />
    </transition>
  </section>
</template>

<style scoped>

</style>