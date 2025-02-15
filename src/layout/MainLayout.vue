<script setup lang="ts">
import MobileHeader from '@/components/MobileHeader.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <MobileHeader />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>
