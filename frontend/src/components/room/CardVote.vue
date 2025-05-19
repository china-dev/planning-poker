<script setup lang="ts">
  import { defineProps } from 'vue'
  import { useUserStore } from '../../store/user'
  import { useVotes } from '../../composable/useVotes'

  const userStore = useUserStore()
  const { handleVote } = useVotes()

  type Player = {
    userName: string;
    isAdmin: boolean;
    isSpectator?: boolean;
    vote?: number;
  }

  const { value } = defineProps<{
    value: number | Player
  }>()

  const isPlayer = (val: number | Player): val is Player => {
    return typeof val === 'object'
  }
  
</script>

<template>
  <div class="flex flex-col items-center justify-center mb-12">
    <div
      @click="!isPlayer(value) && handleVote(value)"
      :class="[
        isPlayer(value) ? 'cardClose' : '',
        isPlayer(value) && value.vote === userStore.currentVote ? 'cardActive' : '',
        !isPlayer(value) && userStore.currentVote === value ? 'cardActive' : '',
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
      <span class="font-bold text-2xl">
        {{ isPlayer(value) ? value.vote ?? '?' : value }}
      </span>
    </div>
    <p v-if="isPlayer(value)" class="font-bold text-2xl mt-1">
      {{ value.userName }}
    </p>
  </div>
</template>