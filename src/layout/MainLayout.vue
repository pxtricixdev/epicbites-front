<script setup lang="ts">
import NavbarMobile from '@/components/NavbarMobile.vue'
import Footer from '@/components/Footer.vue';
import { navbarLinks } from '@/data/navbarLinks'
</script>

<template>
  <header><h1>Esto será el header</h1></header>
  <main>
    <RouterView />
  </main>
  <NavbarMobile :links="navbarLinks" />
  <footer>
    <Footer />
  </footer>


</template>
