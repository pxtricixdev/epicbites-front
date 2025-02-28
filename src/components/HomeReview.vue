<template>
  <div class="card">
    <div class="card__stars">
      <Star v-for="star in stars" :key="star" class="card__icon filled" />
    </div>
    <RouterLink class="card__link" :to="recipeLink">{{ recipe }}</RouterLink>
    <p class="card__text">{{ text }}</p>
    <p class="card__author">{{ author }}</p>
  </div>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps<{
  stars: number
  text: string
  author: string
  recipe: string
  recipeLink: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.card {
  background-color: $light-grey;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  border-radius: 12px;
  width: 335px;
  height: 150px;
  margin: 0 auto;
  text-align: justify;
  font-family: $body;
  box-shadow: 0 2px 8px rgba(122, 122, 122, 0.1);

  &__stars {
    display: flex;
    gap: 5px;
    padding-bottom: 5px;
  }

  &__icon {
    width: 18px;
    height: 18px;
    color: $black;

    &.filled {
      fill: $black;
      stroke: none;
    }
  }

  &__link {
    font-size: 12px;
    color: $secondary-orange;
    text-decoration: none;
    font-weight: 600;
  }

  &__link:hover {
    text-decoration: underline;
  }

  &__text {
    font-size: 14px;
    line-height: 15px;
    color: $black;
    margin-bottom: 5px;
    padding-top: 5px;
  }

  &__author {
    font-weight: bold;
    font-size: 14.4px;
    color: $black;
  }
}
</style>
