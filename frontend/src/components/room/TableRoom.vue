<script setup lang="ts">
  import { useVotes } from '../../composable/useVotes.ts';
  import Card from './CardVote.vue';

  const {
    playersWithVotes
  } = useVotes();

</script>

<template>
  <section class="flex flex-col justify-center items-center mb-8 wrapperTable">
    <div class="tableVotes">
      <TransitionGroup
        class="flex justify-center items-start"
        name="fade"
        mode="out-in"
        tag="div"
      >
        <Card
          v-for="(item, index) in playersWithVotes"
          :key="index"
          :value="item"
          class="cardTable"
        />
      </TransitionGroup>
    </div>
  </section>
</template>


<style scoped src="../../styles/tableVotes.css"> 

</style>