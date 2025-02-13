<template>
  <footer class="footer">
    <hr class="footer__hr" />
    <ul class="footer__list">
      <li class="footer__item footer__item--logo">
        <img src="" alt="lumifilm logo" />
      </li>
      <li class="footer__item">
        <RouterLink to="/cartelera">Home</RouterLink>
      </li>
      <li class="footer__item">
        <RouterLink to="/recetas">Recetas</RouterLink>
      </li>
      <li class="footer__item">
        <RouterLink to="/recetas">Sobre nosotros</RouterLink>
      </li>
      <li class="footer__item">
        <RouterLink to="/terminos">Términos y Condiciones</RouterLink>
      </li>
      <li class="footer__item">
        <RouterLink to="/politicas">Política de Privacidad</RouterLink>
      </li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.footer {
  width: 100%;
  text-align: center;

  &__item {
    margin: 0 auto;
    font-family: $body;

    a {
      color: $black;
    }

    &--logo {
      width: 166px;
      height: 53px;
      display: flex;
      justify-content: center;

      img {
        max-width: 80%;
        margin: 0 auto;
      }
    }
  }

  &__hr {
    border-color: $secondary-orange;
    opacity: 50%;
    width: 90%;
  }
}

@media only screen and (min-width: 768px) {
  .footer {
    &__list {
      display: flex;
      flex-direction: row;
      max-width: 1000px;
      margin: 0 auto;
      align-items: center;
    }

    &__social-list {
      max-width: 300px;
      margin-bottom: 40px;
    }
  }
}

@media only screen and (min-width: 1200px) {
  .footer__hr {
    max-width: 1200px;
  }
}
</style>
