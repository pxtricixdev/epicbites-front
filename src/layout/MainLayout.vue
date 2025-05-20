<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import Footer from '@/components/FooterComponent.vue'
import ChatbotAssistant from '@/components/ChatbotAssistant.vue'
</script>

<template>
  <MainHeader />
  <main>
    <RouterView />
  </main>
  <Footer />
  <ChatbotAssistant />
</template>
