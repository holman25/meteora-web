<template>
  <div class="flex flex-col flex-1 overflow-y-auto px-4 sm:px-6 pt-12 pb-32 space-y-4">
    <!-- Mensaje de bienvenida -->
    <transition name="fade-slide" mode="out-in">
      <div v-if="messages.length === 0" key="empty" class="flex flex-col items-center justify-center mt-24 text-center text-neutral-400">
        <div class="text-5xl mb-4">🌤️</div>
        <h2 class="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent">
          ¡Hola! Soy Meteora
        </h2>
        <p class="mt-3 text-base sm:text-lg text-neutral-500 max-w-md">
          Pregúntame sobre el clima en tu ciudad y estaré encantado de ayudarte.
        </p>
      </div>

      <!-- Lista de mensajes -->
      <div v-else key="messages">
        <MessageBubble
          v-for="(msg, index) in messages"
          :key="index"
          :message="msg"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import MessageBubble from './MessageBubble.vue'

defineProps({
  messages: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
