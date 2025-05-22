<script setup lang="ts">
  import Card from './CardVote.vue';
  import { useVotes } from "../../composable/useVotes.ts";
  
  const { fibonacci } = useVotes();

</script>
<template>
  <div class="wrapperCards">
    <h2 class="text-2xl font-bold text-center mb-10">Escolha seu voto 👇</h2>
    <div class="flex justify-center items-center">
      <Card
        v-for="item in fibonacci"
        :key="item"
        :value="item"
        class="cardVotes"
      />
    </div>
  </div>
</template>