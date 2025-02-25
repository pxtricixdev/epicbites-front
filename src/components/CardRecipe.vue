<template>
  <RouterLink :to="link">
    <div class="card">
      <div class="card__img" :style="{ backgroundImage: `url(${src})` }"></div>
      <div class="card__info">
        <div class="card__text">
          <div class="card__text__top">
            <span class="card__score"> {{ score }}</span>
            <span class="card__text__title">{{ title }}</span>
          </div>
          <span class="card__text__user">{{ user }}</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
defineProps<{
  score: string
  title: string
  user: string
  src: string
  link: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.card {
  font-family: $body;
  height: 240px;
  width: 190px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-top: 20px;
  align-items: center;
  transition: ease-in-out 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  &__img {
    width: 150px;
    height: 140px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    border-radius: 10px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
  }

  &__score {
    font-size: 10px;
    color: #000000;
    background-color: $primary-yellow;
    border-radius: 999px;
    width: 20px;
    height: 20px;
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
      font-size: 12px;
      color: $black;
      font-weight: 570;
      width: 80%;
    }

    &__user {
      font-size: 12px;
      color: #656565;
      font-weight: 570;
    }
  }
}
</style>
