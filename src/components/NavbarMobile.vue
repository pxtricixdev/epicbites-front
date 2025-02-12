<template>
  <div class="navbar">
    <ul class="navbar__list">
      <li v-for="link in links" :key="link.url">
        <RouterLink :to="link.url" class="navbar__list__links">
          <component
            :is="link.icon"
            class="navbar__list__icons"
            v-if="link.icon"
            :stroke="'#E57309'"
          />
          {{ link.text }}
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { navbarLinks } from '@/data/navbarLinks'

defineProps<{
  links: navbarLinks[]
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.navbar {
  height: 55px;
  background-color: $white;
  bottom: 0;
  position: fixed;
  width: 100%;
  z-index: 1000;
  padding: 5px 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  box-shadow: 0px -6px 17px -3px rgba(209, 208, 208, 0.54);

  &__list {
    display: flex;
    flex-direction: row;
    list-style: none;
    justify-content: space-around;
    align-items: center;
    font-family: $body;
    font-size: 10px;
    width: 100%;

    &__links {
      color: $secondary-orange;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
