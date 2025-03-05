<template>
  <RouterLink :to="link">
    <div class="cardperfil">
      <div class="cardperfil__img" :style="{ backgroundImage: `url(${src})` }" :alt="alt"></div>
      <div class="cardperfil__info">
        <div class="cardperfil__text">
          <div class="cardperfil__text__top">
            <span class="cardperfil__score">{{ time }} '</span>
            <span class="cardperfil__text__title">{{ title }} </span>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  time: number
  title: string
  src: string
  link: string
  alt: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.cardperfil {
  font-family: $body;
  height: 270px;
  width: 190px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-top: 20px;
  align-items: center;
  text-decoration: none;

  &__img {
    width: 170px;
    height: auto;
    aspect-ratio: 1 / 1;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 10px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    margin: 10px;
  }

  &__score {
    font-size: 10px;
    color: #000000;
    font-weight: 600;
    border-radius: 999px;
    width: 25px;
    height: 25px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__text {
    display: flex;
    flex-direction: column;
    color: $black;

    &__top {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      align-items: start;
      gap: 10px;
    }

    &__title {
      font-size: 13px;
      color: $black;
      font-weight: 570;
      width: 80%;
    }
  }
}
</style>
