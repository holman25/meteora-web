import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

vi.mock('@/composables/useUserLocation', () => ({
  default: () => ({ location: { value: null } }),
}))

describe('useMessages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('fetches and normalizes messages when chatId changes', async () => {
    const getMessagesByChat = vi.fn(async () => ({
      messages: [
        { role: 'user', content: 'hola' },
        { role: 'assistant', content: 'hey' },
      ],
    }))
    const sendMessageToChat = vi.fn()

    vi.doMock('@/api/messages', () => ({
      getMessagesByChat,
      sendMessageToChat,
    }))

    const { default: useMessages } = await import('../../src/composables/useMessages')
    const chatId = ref('chat-1')
    const { messages, fetchMessages } = useMessages(chatId)

    await fetchMessages()
    expect(messages.value).toHaveLength(2)
    expect(messages.value[0]).toMatchObject({ role: 'user', content: 'hola' })
    expect(messages.value[1]).toMatchObject({ role: 'assistant', content: 'hey' })
  })

  it('sendMessage pushes user and assistant messages', async () => {
    const getMessagesByChat = vi.fn(async () => ({ messages: [] }))
    const sendMessageToChat = vi.fn(async () => ({
      assistant: { content: 'Respuesta del bot' },
    }))

    vi.doMock('@/api/messages', () => ({
      getMessagesByChat,
      sendMessageToChat,
    }))

    const { default: useMessages } = await import('../../src/composables/useMessages')
    const chatId = ref('chat-2')
    const { messages, sendMessage, fetchMessages, isLoading } = useMessages(chatId)

    await fetchMessages()
    await sendMessage('¿Clima hoy?')
    expect(messages.value.length).toBeGreaterThanOrEqual(2)
    const hasUser = messages.value.some(m => m.role === 'user' && m.content === '¿Clima hoy?')
    const hasAssistant = messages.value.some(m => m.role === 'assistant' && m.content === 'Respuesta del bot')
    expect(hasUser).toBe(true)
    expect(hasAssistant).toBe(true)
  })
})
