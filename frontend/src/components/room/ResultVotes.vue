<script setup lang="ts">
  import Card from './CardVote.vue';
  import AvarageVote from './AvarageVote.vue';
  import { useVotes } from "../../composable/useVotes.ts";
  
  const { dataResultList } = useVotes();

</script>
<template>
  <div class="wrapperCards">
    <div class="flex justify-center items-center h-40">
      <Card
        v-for="item in dataResultList.votes"
        :key="item.vote"
        :value="item.vote"
        :totalVotes="dataResultList.totalVotes"
        :qtdVotes="item.qtd"
        class="cardResult"
      />

      <AvarageVote
        v-if="dataResultList.votes.length"
        :avarage="dataResultList.avarage"
      />

    </div>
  </div>
</template>