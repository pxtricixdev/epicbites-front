import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CHAT_API_URL } from '@/stores/chatConfig'

interface ChatMessage {
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const loading = ref(false)
  const chatOpen = ref(false)
  const error = ref<string | null>(null)

  const toggleChat = () => {
    chatOpen.value = !chatOpen.value
  }

  const sendMessage = async (message: string) => {
    if (!message || loading.value) return

    // mensaje del usuario
    messages.value.push({
      text: message,
      sender: 'user',
      timestamp: new Date()
    })

    loading.value = true
    error.value = null

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mensaje: message })
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      const data = await response.json()

      //  respuesta
      messages.value.push({
        text: data.respuesta,
        sender: 'assistant',
        timestamp: new Date()
      })
    } catch (err: any) {
      console.error('Error al enviar mensaje:', err)
      error.value = err.message

      messages.value.push({
        text: '❌ Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
        sender: 'assistant',
        timestamp: new Date()
      })
    } finally {
      loading.value = false
    }
  }

  const clearChat = () => {
    messages.value = []
    error.value = null
  }

  return {
    messages,
    loading,
    chatOpen,
    error,

    toggleChat,
    sendMessage,
    clearChat
  }
})