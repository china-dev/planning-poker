<script setup lang="ts">

  const emit = defineEmits<{
    (e: 'selectMode', modeSelected: boolean, isAdmin: boolean): void;
  }>();

</script>

<template>
  <div class="flex justify-between my-8 space-x-4">
    <button
      @click="emit('selectMode', true, false)"
      class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
    >
      Entrar
    </button>

    <button
      @click="emit('selectMode', true, true)"
      class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
    >
      Criar Sala
    </button>
  </div>
</template>