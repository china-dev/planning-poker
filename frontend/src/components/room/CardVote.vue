<script setup lang="ts">
  import { defineProps } from 'vue'
  import { useUserStore } from '../../store/user.ts'
  import { useVotes } from '../../composable/useVotes.ts'

  const userStore = useUserStore();
  const { handleVote, getSuitForPlayer } = useVotes()

  type Player = {
    userName: string;
    isAdmin: boolean;
    isSpectator?: boolean;
    vote?: number;
  }

  const { value, totalVotes, qtdVotes } = defineProps<{
    value: number | Player;
    totalVotes?: number;
    qtdVotes?: number;
  }>()

  const isPlayer = (val: number | Player): val is Player => {
    return typeof val === 'object'
  }
  
</script>

<template>
  <div class="flex items-end mx-1 text-center text-wrap max-w-36">
    <div
      v-if="totalVotes && qtdVotes"
      class="relative mr-2 w-2 h-24 border border-solid border-blue-500 rounded"
    >
      <div
        class="absolute bg-blue-500 bottom-0 w-full rounded"
        :style="{ height: `${(qtdVotes / totalVotes) * 100}%` }"
      >
      </div>
    </div>
    <div class="flex flex-col items-center justify-center">
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
        <div
          class="card-face front relative overflow-hidden"
        >
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
  </div>
</template>

<style scoped src="../../styles/card.css">

</style>