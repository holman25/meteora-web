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
          <h1 class="text-xl font-semibold bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end bg-clip-text text-transparent">Meteora</h1>
          <p class="text-sm text-neutral-400">Asistente de Clima</p>
        </div>
        <img src="/Meteoralogo.png" alt="Meteora" class="w-9 h-9" />
      </motion.div>

      <!-- Botón Nueva conversación -->
      <div class="p-4">
        <div class="relative group">
          <div class="absolute -inset-[2px] bg-gradient-to-r from-gradient-start via-gradient-mid to-gradient-end rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300 animate-border-loop"></div>
          <button id="btn-new-convo"
            class="relative w-full bg-meteora-dark text-white font-semibold py-2 px-4 rounded-lg border border-neutral-700 z-10 disabled:opacity-60"
            :disabled="isLoading"
            @click="newConversation"
          >
            + Nueva conversación
          </button>
        </div>
      </div>

      <!-- Chats -->
      <nav id="sidebar-chats" class="px-4 space-y-1 text-sm text-neutral-400">
        <p class="px-2 py-1 font-medium uppercase tracking-wide">Recientes</p>

        <div v-if="isLoading" class="px-3 py-2 text-neutral-500">Cargando…</div>

        <div v-else class="space-y-1">
          <template v-if="chats.length">
            <div
              v-for="chat in chats"
              :key="chat.id"
              class="group flex items-center justify-between gap-2 px-2 py-1 rounded-md hover:bg-meteora-light"
            >
              <!-- Botón seleccionar -->
              <button
                class="flex-1 text-left px-1 py-1 rounded-md transition font-medium flex items-center gap-2 text-neutral-100 hover:text-white"
                :class="chat.id === activeChatId ? 'animate-pulse text-white' : ''"
                @click="emitSelect(chat.id)"
                :title="preview(chat)"
              >
                💬 {{ preview(chat) }}
              </button>

              <!-- Botón eliminar -->
              <button
                class="opacity-70 hover:opacity-100 p-1 rounded-md border border-neutral-700 hover:border-red-400 hover:text-red-300 transition"
                title="Eliminar"
                @click.stop="askDelete(chat.id)"
              >
                🗑️
              </button>
            </div>
          </template>

          <p v-else class="px-3 py-2 text-neutral-500">No hay conversaciones aún</p>
        </div>
      </nav>
    </div>

    <!-- Footer -->
    <footer class="px-6 py-4 border-t border-neutral-800 text-xs text-neutral-500">
      Holman Alba · All rights reserved. 2025
    </footer>

    <transition name="fade">
      <div v-if="showConfirm" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="cancelDelete"></div>
        <div class="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-[#0b0f14]/90 p-5 shadow-2xl">
          <h3 class="text-lg font-semibold">Eliminar conversación</h3>
          <p class="text-sm text-neutral-400 mt-2">¿Seguro que deseas eliminar esta conversación del historial?</p>
          <div class="mt-5 flex justify-end gap-2">
            <button class="px-3 py-1.5 rounded-md border border-neutral-700 hover:bg-neutral-800" @click="cancelDelete">Cancelar</button>
            <button class="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </transition>
  </motion.aside>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import useChatHistory from '@/composables/useChatHistory'
import useChatSession from '@/composables/useChatSession'

const { chats, isLoading, loadHistory } = useChatHistory()
const { startChatSession, removeChatFromHistory } = useChatSession()

onMounted(() => {
  loadHistory()
  window.addEventListener('meteora:chat-updated', onChatUpdated)
})
onBeforeUnmount(() => {
  window.removeEventListener('meteora:chat-updated', onChatUpdated)
})
function onChatUpdated() {
  loadHistory()
}

const emit = defineEmits(['select-chat'])
function emitSelect(id) {
  emit('select-chat', id)
}

const props = defineProps({ activeChatId: String })

function preview(chat) {
  const lm = chat.lastMessage?.content ?? chat.messages?.[0]?.content ?? ''
  const text = (lm || 'Sin mensaje').trim()
  return text.length > 40 ? text.slice(0, 40) + '…' : text
}

async function newConversation() {
  try {
    window.dispatchEvent(new CustomEvent('meteora:overlay-show', { detail: { message: 'Creando nueva conversación…' } }))
    const { id } = await startChatSession({ forceNew: true })
    emit('select-chat', id)
  } catch (err) {
    console.error('Error creando nueva conversación:', err)
  } finally {
    window.dispatchEvent(new Event('meteora:overlay-hide'))
  }
}

const showConfirm = ref(false)
const toDeleteId  = ref(null)

function askDelete(id) {
  toDeleteId.value = id
  showConfirm.value = true
}
function cancelDelete() {
  showConfirm.value = false
  toDeleteId.value = null
}

async function confirmDelete() {
  const id = toDeleteId.value
  if (!id) return

  window.dispatchEvent(new CustomEvent('meteora:overlay-show', { detail: { message: 'Eliminando conversación…' } }))

  const remaining = removeChatFromHistory(id)

  const now = (chats.value || []).filter(c => c.id !== id)
  chats.value = now
  await nextTick()

  await loadHistory()
  await nextTick()

  if (props.activeChatId === id) {
    if (remaining.length > 0) {
      emit('select-chat', remaining[0])
    } else {
      try {
        window.dispatchEvent(new CustomEvent('meteora:overlay-show', { detail: { message: 'Creando nueva conversación…' } }))
        const { id: newId } = await startChatSession({ forceNew: true })
        emit('select-chat', newId)
      } catch (e) {
        console.error('[Sidebar] Error creando chat nuevo tras eliminar el único', e)
      } finally {
        window.dispatchEvent(new Event('meteora:overlay-hide'))
      }
    }
  }

  cancelDelete()
  window.dispatchEvent(new Event('meteora:overlay-hide'))
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
