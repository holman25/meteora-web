<template>
  <transition name="slide">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex">
      <!-- Fondo oscuro transparente -->
      <div class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Panel lateral animado -->
      <aside class="relative w-64 bg-meteora-dark text-white shadow-xl z-50 flex flex-col justify-between border-r border-neutral-800">
        <!-- Encabezado -->
        <div>
          <div class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h1 class="text-xl font-semibold bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent">
                Meteora
              </h1>
              <p class="text-sm text-neutral-400">Asistente de Clima</p>
            </div>
            <button @click="$emit('close')" class="text-neutral-400 hover:text-white text-lg">
              ✖
            </button>
          </div>

          <!-- Botón animado -->
          <div class="p-4">
            <div class="relative group">
              <div class="absolute -inset-[2px] bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-border-loop"></div>
              <button class="relative w-full bg-meteora-dark text-white font-semibold py-2 px-4 rounded-lg border border-neutral-700 z-10">
                + Nueva conversación
              </button>
            </div>
          </div>

          <!-- Chats recientes -->
          <nav class="px-4 space-y-1 text-sm text-neutral-400">
            <p class="px-2 py-1 font-medium uppercase tracking-wide">Recientes</p>
            <div class="space-y-1">
              <button class="w-full text-left px-3 py-2 rounded-md hover:bg-meteora-light transition text-white font-medium flex items-center gap-2">
                💬 No hay conversaciones aún
              </button>
            </div>
          </nav>
        </div>

        <!-- Footer -->
        <footer class="px-6 py-4 border-t border-neutral-800 text-xs text-neutral-500">
          Holman Alba · All rights reserved. 2025
        </footer>
      </aside>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
