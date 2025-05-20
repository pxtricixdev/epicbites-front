<template>
  <section class="inspira-section">
    <h2 class="inspira-section__title">Hazlo fácil, cocina mejor</h2>
    <ul class="inspira-section__list">
      <li class="inspira-section__item">✔ Rápido</li>
      <li class="inspira-section__item">✔ Sencillo</li>
      <li class="inspira-section__item">✔ Delicioso</li>
    </ul>
    <RouterLink :to="redirectTo" class="inspira-section__button"
      >Empieza ahora<ArrowRight width="20" />
    </RouterLink>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { authStore } from '@/stores/authStore'

const auth = authStore()
const redirectTo = computed(() => (auth.isAuthenticated ? '/' : '/registro'))
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;
.inspira-section {
  background-image: url('/images/pexels-jonathanborba-2878745.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px 5px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 30px auto;
  max-width: 1160px;
  font-family: $body;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.214);
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &__title {
    @include semibold-text(18px);
    color: $black;
    background-color: #f5f5f5;
    max-width: 260px;
    margin: 10px auto;
    padding: 5px 0;
    margin-bottom: 20px;

    @media (min-width: 768px) {
      @include semibold-text(24px);
      max-width: 340px;
    }
  }

  &__list {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    flex-wrap: wrap;

    @media (min-width: 1024px) {
      gap: 30px;
    }

    &__item,
    li {
      color: $white;
      padding: 5px 15px;
      border-radius: 5px;
      @include semibold-text(14px);

      @media (min-width: 768px) {
        @include semibold-text(18px);
      }
    }
  }

  &__button {
    background-color: $primary-yellow;
    color: black;
    border: none;
    padding: 6px 20px;
    border-radius: 10px;
    @include semibold-text(14px);
    cursor: pointer;
    transition: background-color 0.3s ease;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 180px;
    margin: 0 auto;

    @media (min-width: 768px) {
      @include semibold-text(16px);
      padding: 8px 25px;
      width: 200px;
    }

    &:hover {
      background-color: rgb(255, 250, 91);
    }
    transition: all 0.3s ease;
  }
}
</style>
