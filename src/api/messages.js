import axios from './axios'

export async function getMessagesByChat(chatId) {
  const response = await axios.get(`/chats/${chatId}/messages`)
  return response.data
}

export async function sendMessageToChat(chatId, payload) {
  const response = await axios.post(`/chats/${chatId}/messages`, payload)
  return response.data
}

