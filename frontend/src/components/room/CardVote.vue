<script setup lang="ts">
  import { defineProps } from 'vue';
  import { useUserStore } from '../../store/user';
  import { useVotes } from '../../composable/useVotes';

  const userStore = useUserStore();
  
  const { handleVote } = useVotes();

  const { value } = defineProps<{
    value: number
  }>();
  
</script>

<template>
  <div @click="handleVote(value)"
    :class="[
      { 'cardActive': userStore.currentVote === value },
      'hover:bg-blue-500',
      'hover:text-white',
      'cursor-pointer',
      'border',
      'border-blue-500',
      'border-solid',
      'rounded-md',
      'w-16',
      'h-24',
      'flex',
      'items-center',
      'justify-center',
      'mx-2'
    ]"
  >
    <span class="font-bold text-2xl">{{ value }}</span>
  </div>
</template>