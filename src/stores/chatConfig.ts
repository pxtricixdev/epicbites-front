import type { App } from 'vue'
import ChefChatbox from '@/components/ChefChatbox.vue'

// Configuración del chatbot
export const CHAT_API_URL: string = 'http://localhost:8000/chat'

// Función para registrar el componente globalmente
export function registerChatbox(app: App): void {
  app.component('ChefChatbox', ChefChatbox)
}