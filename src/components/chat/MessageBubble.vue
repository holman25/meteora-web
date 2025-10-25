<template>
  <motion.div
    v-motion
    :initial="{
      opacity: 0,
      y: 20,
      scale: 0.95
    }"
    :enter="{
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.05
      }
    }"
    :class="bubbleWrapperClass"
    class="mb-6"
  >
    <!-- Avatar opcional para el bot -->
    <div 
      v-if="!isUser" 
      class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gradient-start via-gradient-mid to-gradient-end flex items-center justify-center mr-3 shadow-fancy"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    </div>

    <div :class="bubbleClass">
      <p class="text-[15px] leading-relaxed whitespace-pre-wrap">{{ message.text }}</p>
      
      <!-- Timestamp opcional -->
      <span class="text-[11px] opacity-60 mt-2 block">
        {{ formatTime(message.timestamp) }}
      </span>
    </div>

    <!-- Avatar para el usuario -->
    <div 
      v-if="isUser" 
      class="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-meteora-cyan to-blue-500 flex items-center justify-center ml-3 shadow-lg"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
  </motion.div>
</template>

<script setup>
import { computed } from 'vue'
import { useMotion } from '@vueuse/motion'

const props = defineProps({
  message: { type: Object, required: true }
})

const isUser = computed(() => props.message.sender === 'user')

const bubbleWrapperClass = computed(() =>
  isUser.value ? 'flex justify-end items-end' : 'flex justify-start items-end'
)

const bubbleClass = computed(() => {
  const baseClasses = 'px-5 py-3.5 rounded-2xl shadow-lg max-w-[75%] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]'
  
  return isUser.value
    ? `${baseClasses} bg-gradient-to-br from-meteora-cyan/90 to-blue-500/90 text-white border border-meteora-cyan/20`
    : `${baseClasses} bg-neutral-800/80 text-gray-100 border border-neutral-700/50`
})

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* Efecto hover sutil */
.backdrop-blur-sm:hover {
  box-shadow: 0 8px 30px rgba(34, 211, 238, 0.15);
}
</style>