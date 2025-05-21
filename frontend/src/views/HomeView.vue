<script setup lang="ts">
import { ref } from "vue";
import ModalPosition from "../components/home/ModalPosition.vue";
import FormPosition from "../components/home/FormPosition.vue";

const isAdmin = ref<boolean>(false);
const modeSelected = ref<boolean>(false);

function handleUserMode(mode:boolean, admin: boolean) {
  isAdmin.value = admin;
  modeSelected.value = mode;
}

</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="flex flex-col items-center justify-center h-screen space-y-10">
      <h1 class="text-3xl font-bold">♣️Planning Poker♦️</h1>
  
      <div class="border border-blue-500 rounded-md px-10 py-8 w-[32rem] relative">
        <transition name="fade" mode="out-in">
          <ModalPosition
            v-if="!modeSelected"
            @selectMode="handleUserMode"
          />
          <FormPosition
            v-else
            :isAdmin="isAdmin"
            @selectMode="handleUserMode"
          />
        </transition>
  
      </div>
    </div>
  </main>
</template>