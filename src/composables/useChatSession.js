import { ref } from 'vue'
import axios from '@/api/axios'

const CHAT_KEY = 'meteora-chat-id'
const HISTORY_KEY = 'meteora-chat-history'

const chatId = ref(localStorage.getItem(CHAT_KEY) || '')

function pushToHistory(id) {
  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  const updated = [id, ...history.filter(x => x !== id)]
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

function setCurrent(id) {
  chatId.value = id
  localStorage.setItem(CHAT_KEY, id)
}

export function confirmChatInHistory(id) {
  if (!id) return
  pushToHistory(id)
}

const startChatSession = async ({ forceNew = false } = {}) => {
  const existing = localStorage.getItem(CHAT_KEY)

  if (!forceNew && existing) {
    setCurrent(existing)
    return { id: existing, reused: true }
  }

  try {
    const { data } = await axios.post('http://localhost:8080/api/v1/chats')
    const newId = data.chatId
    setCurrent(newId)
    return { id: newId, reused: false }
  } catch (err) {
    console.error('[useChatSession] Error creando chat:', err)
    throw err
  }
}

const setChatId = (id) => {
  if (!id) return
  setCurrent(id)
}

const getChatHistory = () => {
  const raw = localStorage.getItem(HISTORY_KEY)
  return raw ? JSON.parse(raw) : []
}

const clearChatHistory = () => {
  localStorage.removeItem(HISTORY_KEY)
}

const clearCurrentChat = () => {
  localStorage.removeItem(CHAT_KEY)
  chatId.value = ''
}

const removeChatFromHistory = (id) => {
  if (!id) return []

  const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  const remaining = history.filter(x => x !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(remaining))
  if (localStorage.getItem(CHAT_KEY) === id) {
    clearCurrentChat()
  }

  return remaining
}

export default function useChatSession() {
  return {
    chatId,
    startChatSession,
    setChatId,
    getChatHistory,
    clearChatHistory,
    clearCurrentChat,
    removeChatFromHistory
  }
}
