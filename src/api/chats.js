import axios from './axios'

export async function createChat({ title = '', meta = {} } = {}) {
  const { data } = await axios.post('/chats', { title, meta })
  return data
}
