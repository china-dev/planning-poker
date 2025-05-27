<script setup lang="ts">
  import { ref } from "vue";
  import { useUserStore } from "../../store/user";
  import { useVotes } from "../../composable/useVotes";
  const {startTheme} = useVotes();

  const userStore = useUserStore();
  const theme = ref<string>('');

</script>
<template>
  <form class="flex flex-col space-y-6 my-8" @submit.prevent @keydown.enter.prevent>
    <input
      required="true"
      v-model="theme"
      placeholder="Tema para a votação"
      class="border-0 border-b border-b-blue-500 border-solid p-2 focus:outline-none"
    />
    <button
      @click="
        userStore.setThemes({name: theme, mostVoted: 0, avarage: 0}),
        userStore.removeAlert(),
        startTheme(theme)
      "
      class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
    >
      Enviar
    </button>
  </form>
</template>