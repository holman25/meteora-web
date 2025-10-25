<template>
  <div class="h-screen flex bg-meteora text-white overflow-hidden">
    <!-- Sidebar escritorio -->
    <Sidebar class="h-screen w-full max-w-[260px] border-r border-neutral-800 hidden md:block bg-meteora-dark" />

    <!-- Sidebar móvil -->
    <SidebarMobile :isOpen="showSidebar" @close="showSidebar = false" />

    <!-- Área principal -->
    <main class="flex-1 flex flex-col relative max-w-4xl mx-auto w-full">
      <!-- Header móvil -->
      <div class="md:hidden px-4 py-3 border-b border-neutral-800 flex items-center justify-between bg-meteora-dark">
        <h1 class="text-lg font-semibold text-meteora-accent">Meteora</h1>
        <button @click="showSidebar = true" class="p-2 rounded-md hover:bg-meteora-light">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Mensajes con scroll -->
      <div class="flex-1 overflow-hidden">
        <div ref="scrollArea" class="h-full overflow-y-auto px-4 py-6 space-y-4 bg-meteora">
          <ChatWindow
            :messages="messages"
            :isWaitingResponse="isWaitingResponse"
            v-if="hasMessages"
          />

          <!-- Estado inicial -->
          <div v-else class="flex flex-col items-center justify-center text-center py-16">
            <div class="relative mb-8">
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 via-meteora-cyan to-purple-500 opacity-20 blur-xl animate-pulse-slow" />
              <div class="relative w-20 h-20 md:w-24 md:h-24 p-[3px] rounded-full bg-gradient-to-r from-fuchsia-500 via-meteora-cyan to-purple-500 animate-spin-slow">
                <div class="w-full h-full bg-meteora rounded-full"></div>
              </div>
              <div class="absolute top-0 right-0 w-2 h-2 bg-meteora-cyan rounded-full animate-ping"></div>
              <div class="absolute bottom-0 left-0 w-2 h-2 bg-fuchsia-500 rounded-full animate-ping" style="animation-delay: 0.5s;" />
            </div>

            <h2 class="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-fuchsia-500 via-meteora-cyan to-purple-500 bg-clip-text text-transparent animate-gradient">
              ¡Hola! Soy Meteora
            </h2>
            <p class="text-base md:text-lg text-neutral-400 max-w-md">
              Pregúntame sobre el clima en tu ciudad y estaré encantado de ayudarte.
            </p>

            <div class="mt-8 flex flex-wrap gap-2 justify-center max-w-lg">
              <button @click="addMessage({ sender: 'user', text: '¿Cómo está el clima hoy?' })"
                class="px-4 py-2 rounded-full bg-meteora-light border border-neutral-800 hover:border-meteora-cyan transition-all text-sm text-neutral-300 hover:text-white">
                ¿Cómo está el clima hoy?
              </button>
              <button @click="addMessage({ sender: 'user', text: '¿Lloverá mañana?' })"
                class="px-4 py-2 rounded-full bg-meteora-light border border-neutral-800 hover:border-meteora-cyan transition-all text-sm text-neutral-300 hover:text-white">
                ¿Lloverá mañana?
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Input fijo -->
      <div class="sticky bottom-0 bg-meteora-light border-t border-neutral-800 z-10">
        <ChatInput @send="addMessage" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import Sidebar from './Sidebar.vue'
import SidebarMobile from './SidebarMobile.vue'
import ChatWindow from '../chat/ChatWindow.vue'
import ChatInput from '../chat/ChatInput.vue'
import useChatSession from '../../composables/useChatSession'
import useMessages from '../../composables/useMessages'
import useUserLocation from '@/composables/useUserLocation.js'

const showSidebar = ref(false)
const scrollArea = ref(null)
const isWaitingResponse = ref(false)

const { location } = useUserLocation()
const { chatId, startChatSession } = useChatSession()
const { messages, sendMessage } = useMessages(chatId)

onMounted(startChatSession)

watch(messages, async () => {
  await nextTick()
  if (scrollArea.value) {
    scrollArea.value.scrollTop = scrollArea.value.scrollHeight
  }
})

const hasMessages = computed(() => messages.value.length > 0)

async function addMessage(newMsg) {
  isWaitingResponse.value = true
  await sendMessage(newMsg.text)
  // Espera un poco para mostrar el ThinkingStatus aunque sea brevemente
  await new Promise(resolve => setTimeout(resolve, 500)) 
  isWaitingResponse.value = false
}
</script>

<style scoped>
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
}
@keyframes gradient {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}
.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}
.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s linear infinite;
}
</style>
