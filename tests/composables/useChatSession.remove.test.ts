import { describe, it, expect, beforeEach } from 'vitest'
import useChatSession, { confirmChatInHistory } from '../../src/composables/useChatSession'

const CHAT_KEY = 'meteora-chat-id'
const HISTORY_KEY = 'meteora-chat-history'

describe('useChatSession/removeChatFromHistory', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('removes id from history and handles current chat', () => {
    const { chatId, removeChatFromHistory, getChatHistory } = useChatSession()
    window.localStorage.setItem(CHAT_KEY, 'a')
    confirmChatInHistory('a')
    confirmChatInHistory('b')
    confirmChatInHistory('c')
    expect(getChatHistory()).toEqual(['c', 'b', 'a'])
    chatId.value = 'b'

    const remaining = removeChatFromHistory('b')
    expect(remaining).toEqual(['c', 'a'])
    expect(getChatHistory()).toEqual(['c', 'a'])
  })
})
