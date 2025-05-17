<template>
  <section class="promo-banner">
    <div class="promo-banner__left" ref="videoSection">
      <video id="cooking-video" autoplay muted loop playsinline class="promo-banner__left__video">
        <source src="/cooking.mp4" type="video/mp4" />
        Tu navegador no soporta video HTML5.
      </video>
      <h1 id="cooking-slogan" class="promo-banner__left__slogan">Cocina. Disfruta. Repite.</h1>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
defineProps<{
  title: string
  description: string
  features: string[]
  note: string
}>()

const videoSection = ref<HTMLElement | null>(null)

onMounted(() => {
  const video = document.getElementById('cooking-video')
  const slogan = document.getElementById('cooking-slogan')

  const maxScroll = 100

  const handleScroll = () => {
    if (!video || !slogan) return

    const scrollTop = window.scrollY
    const clampedScroll = Math.min(scrollTop, maxScroll)

    const scale = Math.max(0.8, 1 - clampedScroll / maxScroll)
    video.style.transform = `translateX(-50%) scale(${scale})`
    video.style.transformOrigin = 'top center'

    if (scrollTop > 2) {
      slogan.classList.add('slogan-visible')
    } else {
      slogan.classList.remove('slogan-visible')
    }
  }

  window.addEventListener('scroll', handleScroll)

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.promo-banner {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: $white;
  text-align: center;

  &__divider {
    border: none;
    border-top: 2px solid $black;
    margin: 20px 0;
    box-sizing: border-box;
  }

  &__left {
    height: 600px;
    position: relative;
    overflow: hidden;

    &__video {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      height: auto;
      object-fit: cover;
      transition: transform 0.3s ease;
      will-change: transform;
      z-index: 1;
    }

    &__slogan {
      position: absolute;
      bottom: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 34px;
      font-weight: 700;
      text-align: center;
      color: $white;
      text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.7);
      z-index: 2;
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      pointer-events: none;
      font-family: $body;
      letter-spacing: 10px;
    }

    p {
      font-size: 14px;
      font-family: $body;
    }

    ul {
      list-style: none;
      padding: 0;
      margin-top: 5px;

      li {
        font-size: 14px;
        margin-bottom: 5px;
        font-family: $body;
        font-style: italic;
      }
    }

    &__divider {
      border: none;
      border-top: 2px solid $black;
    }
  }

  &__note {
    margin-top: 10px;
    font-weight: 600;
  }

  &__right {
    display: none;
    flex-wrap: wrap;
    justify-content: center;
    background-color: $primary-yellow;
    gap: 10px;
    padding-bottom: 20px;
  }

  &__image {
    max-width: 155px;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 12px;
  }

  &__image-small {
    max-width: 115px;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 12px;
  }
}
.slogan-visible {
  opacity: 1;
}
</style>
