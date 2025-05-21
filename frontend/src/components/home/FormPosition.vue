<script setup lang="ts">
  import { useFormHome } from "../../composable/UseFormHome.ts";
  import { ref, defineEmits } from "vue";

  const userName = ref<string>('');
  const nameRoom = ref<string>('');
  const roomId = ref<string>('');
  const isSpectator = ref<boolean>(false);

  const { isAdmin } = defineProps<{
    isAdmin: boolean
  }>();

  const emit = defineEmits<{
    (e: 'selectMode', modeSelected: boolean, isAdmin: boolean): void;
  }>();

  const { handleCreateRoom, handleJoinRoom } = useFormHome();
</script>

<template>
  <div class="flex flex-col space-y-6 my-8">
    <button
      class="top-4 left-4 absolute flex items-center text-blue-500"
      @click="emit('selectMode', false, false)"
    >
      <img src="../../assets/arrow_back.svg" alt="Voltar">
       <span class="ml-2">Voltar</span>
    </button>
    <input
      v-model="userName"
      placeholder="Seu nome"
      class="border-0 border-b border-b-blue-500 border-solid p-2 focus:outline-none"
    />

    <input
      v-if="isAdmin"
      v-model="nameRoom"
      placeholder="Nome da sala"
      class="border-0 border-b border-b-blue-500 border-solid p-2 focus:outline-none"
    />

    <input
      v-if="!isAdmin"
      v-model="roomId"
      placeholder="ID da sala"
      class="border-0 border-b border-b-blue-500 border-solid p-2 focus:outline-none"
    />
    <div
      v-if="!isAdmin" 
     class="flex items-center justify-between"
    >
      <span class="text-sm font-medium text-gray-700">Entrar como espectador?</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          v-model="isSpectator"
          class="sr-only peer"
        />
        <div
          class="
            w-11
            h-6
            bg-gray-300
            peer-focus:outline-none
            rounded-full peer
            peer-checked:bg-blue-600
            transition-colors
          "
        >
        </div>
        <div
          class="
            absolute
            left-0.5
            top-0.5
            w-5
            h-5
            bg-white
            rounded-full
            shadow-md
            transform
            transition-transform
            peer-checked:translate-x-full
          "
        >
      </div>
      </label>
    </div>

    <button
      v-if="isAdmin"
      @click="handleCreateRoom(userName, nameRoom)"
      class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
    >
      Criar Sala
    </button>

    <button
      @click="handleJoinRoom(userName, roomId, isSpectator)"
      v-if="!isAdmin"
      class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
    >
      Entrar
    </button>
  </div>
</template>