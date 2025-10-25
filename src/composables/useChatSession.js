import { ref } from 'vue'
import axios from '@/api/axios'

const CHAT_KEY = 'meteora-chat-id'

export default function useChatSession() {
  const chatId = ref(localStorage.getItem(CHAT_KEY) || '')

  const startChatSession = async () => {
    if (chatId.value) return

    try {
      const response = await axios.post('/chats')
      chatId.value = response.data.chatId
      localStorage.setItem(CHAT_KEY, chatId.value)
    } catch (error) {
      console.error('Error creating chat session:', error)
    }
  }

  return {
    chatId,
    startChatSession
  }
}
