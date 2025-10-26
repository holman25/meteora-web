<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[1000]">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      <div class="absolute inset-0 flex items-center justify-center p-6">
        <div
          class="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0f14]/80 shadow-2xl overflow-hidden"
        >
          <div class="p-6 flex flex-col items-center text-center gap-4">
            <div class="relative w-16 h-16">
              <div
                class="absolute inset-0 rounded-full p-[2px] bg-gradient-to-tr from-fuchsia-500 via-cyan-400 to-purple-500 animate-spin-slow"
              >
                <div class="w-full h-full rounded-full bg-[#0b0f14]"></div>
              </div>
              <div class="absolute inset-2 rounded-full bg-gradient-to-br from-neutral-800/60 to-neutral-900/60"></div>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white">Creando nueva conversación…</h3>
              <p class="text-sm text-neutral-400 mt-1">
                {{ message }}<span class="inline-block w-4 text-cyan-300 animate-typing-dots">…</span>
              </p>
            </div>
            <div class="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div class="h-full w-1/3 bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-purple-500 animate-bar-move"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: 'Conectando con el servicio' },
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes spin-slow { from { transform: rotate(0);} to { transform: rotate(360deg);} }
.animate-spin-slow { animation: spin-slow 1.8s linear infinite; }

@keyframes bar-move {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(20%); }
  100% { transform: translateX(120%); }
}
.animate-bar-move { animation: bar-move 1.4s ease-in-out infinite; }

@keyframes typingDots { 0% {opacity:.2;} 50%{opacity:1;} 100%{opacity:.2;} }
.animate-typing-dots { animation: typingDots 1.2s ease-in-out infinite; }
</style>
