import { describe, it, expect, vi, beforeEach } from 'vitest'
import useChatSession from '../../src/composables/useChatSession'

vi.mock('@/api/axios', () => {
  return {
    default: {
      post: vi.fn(async () => ({
        data: { chatId: 'test-chat-123' }
      }))
    }
  }
})

beforeEach(() => {
  localStorage.clear()
})

describe('useChatSession', () => {
  it('creates new chat when forceNew = true and does not push to history immediately', async () => {
    const { startChatSession, getChatHistory, chatId } = useChatSession()
    const res = await startChatSession({ forceNew: true })
    expect(res.reused).toBe(false)
    expect(res.id).toBe('test-chat-123')
    expect(chatId.value).toBe('test-chat-123')
    expect(getChatHistory()).toEqual([])
  })
})
