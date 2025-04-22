<template>
  <footer class="footer">
    <ul class="footer__list">
      <li class="footer__item footer__item--logo">
        <img src="/logo_white.png" alt="epicbites logo" />
      </li>
      <li class="footer__item">
        <RouterLink to="/">Inicio</RouterLink>
      </li>
      <li class="footer__item">
        <RouterLink to="/recetas">Recetas</RouterLink>
      </li>
      <li class="footer__item">
        <RouterLink to="/sobre-nosotros">Sobre nosotros</RouterLink>
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
  padding: 8px 0 8px 0;
  background-color: $black;
  margin-top: auto;

  &__item {
    margin: 0 auto;
    font-family: $body;

    &--logo {
      width: 150px;
    }

    a {
      color: $white;
      font-size: 12px;

      &:hover {
        color: $secondary-orange;
        transition: 0.1s ease-in-out;
      }
    }

    &--logo {
      display: flex;
      justify-content: center;
    }
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
