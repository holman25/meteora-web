import { ref, watch } from 'vue'
import { getMessagesByChat, sendMessageToChat } from '@/api/messages'
import useUserLocation from '@/composables/useUserLocation'

export default function useMessages(chatId) {
  const messages = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const { location } = useUserLocation()

  const fetchMessages = async () => {
    if (!chatId.value) return
    isLoading.value = true
    try {
      const res = await getMessagesByChat(chatId.value)
      messages.value = res.messages || []
    } catch (err) {
      error.value = err
    } finally {
      isLoading.value = false
    }
  }

  const sendMessage = async (text) => {
    if (!chatId.value || !text) return

    const payload = {
      content: text,
      date: 'hoy',
    }

    if (location.value) {
      payload.location = {
        lat: location.value.lat,
        lon: location.value.lon,
      }
    }

    messages.value.push({ sender: 'user', text })

    try {
      const res = await sendMessageToChat(chatId.value, payload)
      messages.value.push({ sender: 'bot', text: res.assistant?.content || '🤖 Sin respuesta.' })
    } catch (err) {
      messages.value.push({ sender: 'bot', text: '❌ Error procesando tu consulta.' })
    }
  }

  watch(chatId, fetchMessages, { immediate: true })

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    sendMessage
  }
}
