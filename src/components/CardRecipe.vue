<template>
  <div class="card" :style="{ 'background-image': 'url( {{ src }} )'}">
    <span class="card__score"> {{ score }}</span>
    <div class="card__text">
      <span class="card__text__title">{{ title }}</span>
      <span class="card__text__user">{{ user }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: string,
  title: string,
  user: string,
  src: string,
}>()

</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.card {
  width: 160px;
  height: 140px;
  position: relative;
  font-family: $body;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 10px;
  box-shadow: -2px 3px 51px -18px rgba(0,0,0,0.10);

  &__score {
    position: absolute;
    top: 5px;
    right: 10px;
    font-size: 12px;
  }

  &__text {
    position: absolute;
    bottom: 10px;
    left: 15px;
    display: flex;
    flex-direction: column;

    &__title {
      font-size: 12px;
    }

    &__user {
      font-size: 10px;
    }
  }
}
</style>
