<script setup lang="ts">
  import { useVotes } from '../../composable/useVotes.ts';
  import { useUserStore } from '../../store/user.ts';
  import Card from './CardVote.vue';

  const userStore = useUserStore();
  
  const {
    playersWithVotes
  } = useVotes();

</script>

<template>
  <section class="flex flex-col justify-center items-center mb-8 wrapperTable">
    <div class="mb-4 h-8">
      <h2
        v-if="userStore.themes.length && userStore.initVotes"
        class="text-2xl font-bold text-center">
        📋 {{ userStore.themes[userStore.themes.length - 1].name }}
      </h2>
    </div>
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