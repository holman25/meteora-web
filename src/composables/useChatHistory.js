import { ref } from 'vue'
import axios from '@/api/axios'

const chats = ref([])
const isLoading = ref(false)

async function loadHistory() {
  const raw = localStorage.getItem('meteora-chat-history') || '[]'
  const ids = JSON.parse(raw)
  if (!ids.length) return

  isLoading.value = true
  try {
    const response = await axios.get('/chats', {
      params: {
        ids: ids.join(',')
      }
    })
    chats.value = response.data
  } catch (err) {
  } finally {
    isLoading.value = false
  }
}

export default function useChatHistory() {
  return {
    chats,
    isLoading,
    loadHistory
  }
}
