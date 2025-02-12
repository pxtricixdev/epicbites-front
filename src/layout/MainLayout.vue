<script setup lang="ts">
import NavbarMobile from '@/components/NavbarMobile.vue'
import { navbarLinks } from '@/data/navbarLinks'
</script>

<template>
  <header><h1>Esto será el header</h1></header>
  <main>
    <RouterView />
  </main>
  <NavbarMobile :links="navbarLinks" />
  <footer>Esto será el footer</footer>
</template>
