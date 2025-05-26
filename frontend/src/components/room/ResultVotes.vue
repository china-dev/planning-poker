<script setup lang="ts">
  import Card from './CardVote.vue';
  import AvarageVote from './AvarageVote.vue';
  import { useVotes } from "../../composable/useVotes.ts";
  
  const { voteResults } = useVotes();

</script>
<template>
  <div class="wrapperCards">
    <div class="flex justify-center items-center h-40">
      <Card
        v-for="item in voteResults.votes"
        :key="item.vote"
        :value="item.vote"
        :totalVotes="voteResults.totalVotes"
        :qtdVotes="item.qtd"
        class="cardResult"
      />

      <AvarageVote
        v-if="voteResults.votes.length"
        :avarage="voteResults.average"
      />

    </div>
  </div>
</template>