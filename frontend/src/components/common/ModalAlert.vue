<script lang="ts" setup>
  import { useUserStore } from "../../store/user.ts";
  import { useFormHome } from '../../composable/UseFormHome.ts';
  import { useSession } from '../../composable/useSession.ts';
  
  const { modal, removeAlert } = useUserStore();
  const { handleJoinRoom } = useFormHome();
  const { loadSession, clearSession } = useSession();

  const { userName, roomId, isSpectator, isAdmin }= loadSession();
</script>
<template>

  <section class="w-screen bg-black bg-opacity-40 fixed h-screen flex items-center justify-center">
    <div class="modalAlert">
      <h2 class="text-4xl text-center font-semibold text-gray-800">{{ modal.title }}</h2>
      <p class="text-center font-semibold text-gray-600">
        {{ modal.text }}
      </p>
      <div class="flex justify-around">
        <button
          v-if="modal.type === 'multipleSessions'"
          class="bg-green-500 p-2 font-bold text-white rounded-full mr-4 hover:bg-green-700"
          @click="removeAlert()"
        >
          OK !!!
        </button>

        <template v-else>
          <button
            v-if="modal.type != 'multipleSessions'"
            class="bg-green-500 p-2 font-bold text-white rounded-full mr-4 hover:bg-green-700"
            @click="handleJoinRoom(userName, roomId, isSpectator, isAdmin)"
          >
            Sim 👍
          </button>
          <button
            class="bg-red-500 p-2 font-bold text-white rounded-full hover:bg-red-700"
            @click="clearSession()"
          >
            Não 👎
          </button>
        </template>
      </div>
    </div>
  </section>

</template>

<style src="../../styles/modalAlert.css">
</style>