<script setup lang="ts">
import MobileHeader from '@/components/MobileHeader.vue'
import Footer from '@/components/FooterComponent.vue'
</script>

<template>
  <MobileHeader />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>
