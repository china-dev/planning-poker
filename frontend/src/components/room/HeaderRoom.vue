<script setup lang="ts">
  import { useUserStore } from '../../store/user.ts';

  const userStore = useUserStore();
</script>

<template>
  <nav class="p-7 flex justify-between">
    <h1 class="text-3xl font-bold">♣️{{ userStore.nameRoom }}♦️</h1>
    <div class="flex items-center">
      <p class="text-3xl mr-10">
        ⏱️
      </p>
      <p class="text-2xl font-bold mr-10">
        {{ userStore.userName }}
      </p>
      <button v-if="userStore.isAdmin" class="
            p-3
            rounded-full
            font-bold
            hover:bg-blue-600
            text-white
            bg-blue-500
          ">
        Convidar jogadores
      </button>
    </div>
  </nav>
</template>