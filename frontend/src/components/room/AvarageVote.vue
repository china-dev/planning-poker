<script setup lang="ts">
  import { defineProps } from 'vue';

  const { avarage } = defineProps<{
    avarage: number
  }>();

</script>
<template>
  <div class="flex flex-col items-center justify-center ml-3">
    <p class="text-lg font-semibold">
      Média 
    </p>
    <div class="
        border-4
        border-solid
        border-blue-700
        rounded-full
        w-20
        h-20
        flex
        items-center
        justify-center
        font-bold
        text-2xl
        text-white
        bg-blue-500
      "
    >
      <span>{{ Math.round(avarage) }}</span>
    </div>
  </div>
</template>