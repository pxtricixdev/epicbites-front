<template>
  <div class="chatbot" :class="{ 'chatbot--open': chatOpen }">
    <div class="chatbot__wrapper">
      <button
        class="chatbot__button"
        @click="toggleChat"
        :class="{ 'chatbot__button--open': chatOpen }"
      >
        <span v-if="!chatOpen">👨‍🍳</span>
        <span v-else>×</span>
      </button>
      <span class="chatbot__label" v-if="!chatOpen">¿Qué hay en el menú de hoy?</span>
    </div>

    <!-- Panel del chat -->
    <div class="chatbot__panel" v-show="chatOpen">
      <div class="chatbot__header">
        <h3>Chef Virtual 👨‍🍳</h3>
        <p>¿Quieres alguna recomendación?</p>
      </div>

      <div class="chatbot__messages" ref="messagesContainer">
        <div v-if="messages.length === 0" class="chatbot__welcome">
          <p>👋 ¡Hola! Soy tu asistente de cocina. ¿Que te apetece comer hoy?</p>
        </div>

        <div
          v-for="(message, index) in messages"
          :key="index"
          class="chatbot__message"
          :class="message.sender"
        >
          <span v-if="message.sender === 'user'" class="chatbot__avatar">👤</span>
          <span v-else class="chatbot__avatar">👨‍🍳</span>
          <div class="chatbot__bubble" v-html="formatMessage(message.text)"></div>
        </div>

        <div v-if="loading" class="chatbot__message assistant">
          <span class="chatbot__avatar">👨‍🍳</span>
          <div class="chatbot__bubble chatbot__loading">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="chatbot__footer">
        <input
          type="text"
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Haz tu pregunta aquí..."
          :disabled="loading"
        />
        <button @click="sendMessage" :disabled="loading || !userInput.trim()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { storeToRefs } from 'pinia'

const chatStore = useChatStore()
const { messages, loading, chatOpen } = storeToRefs(chatStore)
const { toggleChat, sendMessage: sendMessageStore } = chatStore

const userInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return
  await sendMessageStore(userInput.value)
  userInput.value = ''
}

const formatMessage = (text: string): string => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">${url}</a>`
  })
}

watch(messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

onMounted(() => {
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && chatOpen.value) {
      toggleChat()
    }
  }

  window.addEventListener('keydown', handleEscKey)
  return () => window.removeEventListener('keydown', handleEscKey)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.chatbot {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  font-family: $body;
  color: $black;

  &__button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: $black;
    color: $black;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    position: relative;
    z-index: 1001;
    font-size: 25px;

    &:hover {
      transform: scale(1.05);
    }

    &--open {
      background-color: #f44336;
      color: $white;
    }
  }

  &__wrapper {
    position: relative;
  }

  &__label {
    position: absolute;
    right: 0px;
    bottom: 60px;
    background-color: $black;
    color: $white;
    padding: 6px 10px;
    border-radius: 5px;
    font-size: 13px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);

    &::after {
      content: '';
      position: absolute;
      right: 10px;
      bottom: -5px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid $black;
    }
  }

  &__panel {
    position: absolute;
    bottom: 75px;
    right: 0;
    width: 350px;
    height: 450px;
    background-color: $white;
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  &__header {
    padding: 15px;
    background-color: $black;
    color: $white;
    text-align: center;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    p {
      margin: 4px 0 0;
      font-size: 14px;
      opacity: 0.8;
    }
  }

  &__messages {
    flex: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f9f9f9;
  }

  &__welcome {
    background-color: transparent;
    border-radius: 10px;
    padding: 12px;

    p {
      margin: 0;
      font-size: 14px;
      color: $black;
    }
  }

  &__message {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 6px;

    &.user {
      flex-direction: row-reverse;

      .chatbot__bubble {
        background-color: $primary-yellow;
        color: $black;
        border-top-right-radius: 2px;
      }
    }

    &.assistant .chatbot__bubble {
      background-color: $light-grey;
      color: $black;
      border-top-left-radius: 2px;
    }
  }

  &__avatar {
    font-size: 18px;
    margin-top: 2px;
  }

  &__bubble {
    padding: 10px 12px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.4;
    max-width: 80%;

    a {
      color: $secondary-orange;
      text-decoration: underline;
      word-break: break-all;
    }
  }

  &__footer {
    display: flex;
    padding: 10px;
    background-color: $white;
    border-top: 1px solid $light-grey;

    input {
      flex: 1;
      padding: 10px 15px;
      border: 1px solid $light-grey;
      border-radius: 20px;
      outline: none;
      font-size: 14px;
      background-color: #e4e4e4 !important;
      color: $black;

      &:focus {
        border-color: $primary-yellow;
      }
    }

    button {
      background-color: $primary-yellow;
      color: $black;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      &:disabled {
        background-color: $light-grey;
        cursor: not-allowed;
      }
    }
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;

    span {
      height: 8px;
      width: 8px;
      margin: 0 2px;
      background-color: #888;
      border-radius: 50%;
      display: inline-block;
      animation: bounce 1s infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-4px);
    opacity: 0.8;
  }
}

@media (max-width: 600px) {
  .chatbot {
    bottom: 20px;
    right: 20px;

    &__panel {
      width: calc(100vw - 60px);
      height: 400px;
    }
  }
}
</style>
