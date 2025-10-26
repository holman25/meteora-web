import { ref, watch, isRef } from 'vue'
import { getMessagesByChat, sendMessageToChat } from '@/api/messages'
import useUserLocation from '@/composables/useUserLocation'
import useChatSession, { confirmChatInHistory } from '@/composables/useChatSession'

export default function useMessages(chatIdMaybeRef) {
  const chatIdRef = isRef(chatIdMaybeRef) ? chatIdMaybeRef : ref(chatIdMaybeRef)
  const { startChatSession } = useChatSession()

  const messages   = ref([])
  const isLoading  = ref(false)
  const isSending  = ref(false)
  const error      = ref(null)
  const { location } = useUserLocation()

  // --- helpers ---
  const normalizeFetched = (arr = []) =>
    arr.map(m => ({
      role: m.role || m.sender || (m.is_user ? 'user' : 'assistant'),
      content: m.content ?? m.text ?? '',
      id: m.id ?? m.messageId ?? undefined,
      createdAt: m.createdAt ?? m.created_at ?? m.regstamp ?? undefined,
    }))

  const fetchMessages = async () => {
    const id = chatIdRef.value
    if (!id) return
    isLoading.value = true
    error.value = null
    try {
      const res  = await getMessagesByChat(id)
      const list = res?.messages ?? res?.data?.messages ?? (Array.isArray(res) ? res : [])
      messages.value = normalizeFetched(list)
    } catch (err) {
      console.error('[useMessages] fetch error', err)
      error.value = err
      messages.value = []
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (text) => {
    if (!text) return

    if (!chatIdRef.value) {
      const { id } = await startChatSession({ forceNew: true })
      chatIdRef.value = id
    }

    const id = chatIdRef.value
    if (!id) return

    messages.value.push({ role: 'user', content: text })

    const payload = {
      content: text,
      date: 'hoy',
      ...(location.value && { location: { lat: location.value.lat, lon: location.value.lon } }),
    }

    isSending.value = true
    try {
      const res = await sendMessageToChat(id, payload)
      const botText =
        res?.assistant?.content ??
        res?.data?.assistant?.content ??
        '🤖 Sin respuesta.'
      messages.value.push({ role: 'assistant', content: botText })

      confirmChatInHistory(id)
      window.dispatchEvent(new CustomEvent('meteora:chat-updated', { detail: { chatId: id } }))
    } catch (err) {
      console.error('[useMessages] send error', err)
      messages.value.push({ role: 'assistant', content: '❌ Error procesando tu consulta.' })
    } finally {
      isSending.value = false
    }
  }
  // Recargar al cambiar de chat
  watch(chatIdRef, async (newId) => {
    messages.value = []
    if (newId) await fetchMessages()
  }, { immediate: true })

  return {
    messages,
    isLoading,
    isSending,
    error,
    fetchMessages,
    sendMessage,
  }
}
