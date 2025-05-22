<script setup lang="ts">
import { watch } from 'vue';
import { useUserStore } from '../../store/user.ts';

const store = useUserStore();

// Remove a mensagem depois de 3s
watch(
  () => store.alerts,
  (newAlerts) => {
    newAlerts.forEach((alert) => {
      setTimeout(() => {
        store.removeMessage(alert.id);
      }, 3000);
    });
  },
  { deep: true }
);
</script>

<template>
  <div class="fixed bottom-5 right-5 space-y-2 z-50">
    <transition-group name="slide-up" tag="div">
      <div
        v-for="alert in store.alerts"
        :key="alert.id"
        class="bg-gray-800 text-white px-4 py-2 rounded shadow-lg w-72 mb-4"
      >
        {{ alert.text }}
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
