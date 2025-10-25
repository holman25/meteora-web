<template>
  <motion.aside
    v-motion
    :initial="{ x: -100, opacity: 0 }"
    :enter="{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 18 } }"
    class="h-full bg-meteora-dark flex flex-col justify-between border-r border-neutral-800 w-64 hidden md:flex shadow-inner"
  >
    <div>
      <!-- Header -->
      <motion.div
        v-motion
        :initial="{ opacity: 0, y: -10 }"
        :enter="{ opacity: 1, y: 0, delay: 0.1 }"
        class="px-6 py-5 border-b border-neutral-800 flex items-center justify-between"
      >
        <div>
          <h1 class="text-xl font-semibold bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent">
            Meteora
          </h1>
          <p class="text-sm text-neutral-400">Asistente de Clima</p>
        </div>
        <img src="/Meteoralogo.png" alt="Meteora" class="w-9 h-9" />
      </motion.div>

      <!-- Botón animado -->
      <div class="p-4">
        <div class="relative group">
          <div class="absolute -inset-[2px] bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-border-loop"></div>
          <button
            class="relative w-full bg-meteora-dark text-white font-semibold py-2 px-4 rounded-lg border border-neutral-700 z-10"
          >
            + Nueva conversación
          </button>
        </div>
      </div>

      <!-- Chats -->
      <nav class="px-4 space-y-1 text-sm text-neutral-400">
        <p class="px-2 py-1 font-medium uppercase tracking-wide">Recientes</p>
        <div class="space-y-1">
          <button
            class="w-full text-left px-3 py-2 rounded-md hover:bg-meteora-light transition text-neutral-100 font-medium flex items-center gap-2"
          >
            💬 No hay conversaciones aún
          </button>
        </div>
      </nav>
    </div>

    <!-- Footer -->
    <footer class="px-6 py-4 border-t border-neutral-800 text-xs text-neutral-500">
      Holman Alba · All rights reserved. 2025 
    </footer>
  </motion.aside>
</template>

<script setup>
import { MotionPlugin } from '@vueuse/motion'
</script>
