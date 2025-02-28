<script setup lang="ts">
import MainHeader from '@/components/MainHeader.vue'
import Footer from '@/components/FooterComponent.vue'
</script>

<template>
  <MainHeader />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>
