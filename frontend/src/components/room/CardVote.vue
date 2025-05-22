<script setup lang="ts">
  import { defineProps } from 'vue'
  import { useUserStore } from '../../store/user.ts'
  import { useVotes } from '../../composable/useVotes.ts'

  const userStore = useUserStore()
  const { handleVote, getSuitForPlayer } = useVotes()

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
  <div class="flex flex-col items-center justify-center mx-1 text-center text-wrap max-w-36">
    <div
      :class="[
        'card-container',
        isPlayer(value) && userStore.voteRevealed ? 'flipped' : '',
        isPlayer(value) ? 'cardClose' : '',
        'rounded-md',
        'w-16',
        'h-24',
        'flex',
        'items-center',
        'justify-center',
        'mx-2',
      ]"
      @click="!isPlayer(value) && handleVote(value)"
    >
      <!-- Frente: Naipe ou valor de voto -->
      <div class="card-face front">
        <span class="font-bold text-2xl">
          {{
            isPlayer(value)
              ? getSuitForPlayer(value.userName)
              : value
          }}
        </span>
      </div>

      <!-- Verso: Número votado -->
      <div class="card-face back">
        <span class="font-bold text-2xl">
          {{
            isPlayer(value)
              ? value.vote ?? '?'
              : value
          }}
        </span>
      </div>
    </div>
    <p v-if="isPlayer(value)" class="font-bold text-2xl mt-1">
      {{ value.userName }}
    </p>
  </div>
</template>

<style scoped src="../../styles/card.css">

</style>