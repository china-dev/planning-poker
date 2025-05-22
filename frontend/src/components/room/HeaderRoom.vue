<script setup lang="ts">
  import { useUserStore } from '../../store/user.ts';
  import { utils } from '../../composable/useUtils.ts';

  const {userName, nameRoom, isAdmin, roomId } = useUserStore();
  const { invitePlayers } = utils();
</script>

<template>
  <nav class="p-7 flex justify-between">
    <h1 class="text-3xl font-bold">♣️{{ nameRoom }}♦️</h1>
    <div class="flex items-center">
      <p class="text-2xl font-bold mr-10">
        {{ userName }}
      </p>
      <button
        @click="invitePlayers(userName, nameRoom, roomId)"
        v-if="isAdmin" 
        class="
          p-3
          rounded-full
          font-bold
          hover:bg-blue-600
          text-white
          bg-blue-500
        "
      >
        Convidar jogadores
      </button>
    </div>
  </nav>
</template>