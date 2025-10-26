<template>
  <div id="chat-input" class="w-full px-4 py-4 border-t border-neutral-800 bg-meteora-dark">
    <form @submit.prevent="handleSubmit" class="mx-auto w-full max-w-3xl flex items-center gap-2">
      <!-- Contenedor animado -->
      <div class="relative flex-1 rounded-2xl p-[2px] bg-gradient-to-r from-fuchsia-500 via-meteora-cyan to-purple-500 animate-border">
        <div class="rounded-2xl bg-meteora-light">
          <input
            v-model="message"
            type="text"
            placeholder="¿Cómo puedo ayudarte hoy?"
            class="w-full rounded-2xl bg-transparent px-4 py-3 pr-12 text-base text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>

        <!-- Botón enviar -->
        <button
          type="submit"
          :disabled="message.trim() === ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white text-meteora-dark flex items-center justify-center transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['send'])
const message = ref('')

function handleSubmit() {
  if (message.value.trim() === '') return
  emit('send', { sender: 'user', text: message.value.trim() })
  message.value = ''
}
</script>

<style scoped>
@keyframes borderShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-border {
  background-size: 200% 200%;
  animation: borderShift 6s ease infinite;
}
</style>