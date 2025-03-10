<template>
  <header class="header">
    <div class="header__content">
      <RouterLink to="/">
        <LogoCanvas />
      </RouterLink>

      <!-- Menú para pantallas > 768 -->
      <nav class="header__nav-desktop" v-if="isDesktop">
        <RouterLink class="header__nav__item" to="/">Home</RouterLink>
        <RouterLink class="header__nav__item" to="/recetas">Recetas</RouterLink>
        <RouterLink class="header__nav__item" to="/sobre-nosotros">Sobre Nosotros</RouterLink>
      </nav>

      <div class="header__content__buttons">
        <!-- Ocultar el btn hamburguesa en desktop -->
        <button v-if="!isDesktop" @click="toggleMenu" class="header__content__button-x">
          <span class="icon-container" :class="{ rotate: isOpen }">
            <Menu :size="28" v-if="!isOpen" color="black" />
            <X :size="28" v-else color="black" />
          </span>
        </button>
        <RouterLink
          v-if="isAuthenticated && isDesktop"
          class="header__content__button-user"
          to="/perfil"
        >
          Perfil
          <UserRoundPen :size="16" color="black" />
        </RouterLink>
        <button v-if="isAuthenticated" @click="handleAuth" class="header__content__button-logout">
          Logout
        </button>
        <RouterLink v-else to="/login" class="header__content__button-login"> Login </RouterLink>
      </div>
    </div>

    <!-- Menú hamburguesa (solo móviles) -->
    <nav v-if="!isDesktop" :class="{ header__nav__open: isOpen }" class="header__nav">
      <ul class="header__nav__list">
        <li>
          <RouterLink class="header__nav__item" to="/">
            Home
            <ArrowRight :size="18" color="#E57309" />
          </RouterLink>
        </li>
        <li>
          <RouterLink class="header__nav__item" to="/recetas">
            Todas las recetas
            <ArrowRight :size="18" color="#E57309" />
          </RouterLink>
          <RouterLink class="header__nav__item" to="/sobre-nosotros">
            Sobre Nosotros
            <ArrowRight :size="18" color="#E57309" />
          </RouterLink>
          <RouterLink v-if="isAuthenticated" class="header__nav__item" to="/perfil">
            Mi perfil
            <ArrowRight :size="18" color="#E57309" />
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ArrowRight, Menu, X, UserRoundPen } from 'lucide-vue-next'
import LogoCanvas from '@/components/LogoCanvas.vue'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = authStore()
const isAuthenticated = computed(() => auth.isAuthenticated)

const handleAuth = () => {
  if (isAuthenticated.value) {
    auth.logout()
    router.push('/')
  }
}

const isOpen = ref(false)
const isDesktop = ref(window.innerWidth > 768)

// Alternar menú hamburguesa
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

// Detectar el tamaño de la pantalla
const updateScreenSize = () => {
  isDesktop.value = window.innerWidth > 768
}

// Detectar el cambio de pantalla
onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.header {
  display: flex;
  flex-direction: column;
  background-color: $white;
  padding: 10px 20px 10px 20px;
  font-family: $body;
  position: sticky;
  width: 100%;
  z-index: 1000;
  top: 0;

  &__nav {
    display: block;
    opacity: 0;
    max-height: 0;
    transform: translateX(-100px);
    transition:
      opacity 0.3s ease-out,
      transform 0.3s ease-out;
    pointer-events: none;

    &__item {
      padding: 10px 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: $black;
      font-size: 14px;
    }

    &__open {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
      max-height: 300px;
      background-color: $white;
    }
  }

  &__nav-desktop {
    display: flex;
    gap: 20px;

    .header__nav__item {
      font-size: 16px;
      color: $black;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: #4c4c4c;
      }
    }
  }

  &__content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    max-width: 1300px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;

    &__buttons {
      display: flex;
      flex-direction: row;
      gap: 15px;
    }

    &__button-x {
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      height: 30px;
    }

    &__button-user {
      border: 1px solid #e7e34f;
      border-radius: 10px;
      width: 90px;
      font-size: 14px;
      color: #000000;
      transition: 0.1s ease-in-out;
      display: inline-flex;
      margin: auto;
      gap: 5px;
      justify-content: center;
      padding: 3px 0;

      &:hover {
        background-color: #e7e24f40;
      }
    }

    &__button-logout {
      padding: 8px 25px;
      background-color: $primary-yellow;
      color: $black;
      text-transform: uppercase;
      font-weight: 600;
      border: none;
      padding: 8px 20px !important;
      border-radius: 10px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: 0.1s ease-in-out;

      &:hover {
        background-color: #e9e67c;
      }
    }

    &__button-login {
      background-color: $primary-yellow;
      color: $black;
      text-transform: uppercase;
      font-weight: 600;
      border: none;
      padding: 5px 25px;
      border-radius: 10px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: 0.1s ease-in-out;

      &:hover {
        background-color: #e9e67c;
      }
    }
  }

  &__search {
    width: 100%;

    &__icon {
      color: #7d7d7d;
    }

    &__text {
      width: 100%;
      height: 30px;
      border: none;
      padding: 10px 0;
      border-radius: 15px;
      background-color: #f2f2f2;
      font-size: 12px;
      color: #4c4c4c;
      font-style: italic;
    }
  }
}

.icon-container {
  display: inline-block;
  transition: transform 0.4s ease-in-out;

  &.rotate {
    transform: rotate(180deg) scale(1.1);
  }
}

@media (max-width: 768px) {
  .header__nav-desktop {
    display: none;
  }
}

@media (min-width: 769px) {
  .header__content__button-x {
    display: none;
  }

  .header__nav {
    display: none;
  }
}

@media (min-width: 1024px) {
  .header__search {
    margin-bottom: 30px;
  }
}
</style>
