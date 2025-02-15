<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps({
  stars: Number,
  text: String,
  author: String,
})
</script>

<template>
  <div class="card">
    <div class="card__stars">
      <Star v-for="n in stars" :key="n" class="card__icon filled" />
    </div>
    <p class="card__text">{{ text }}</p>
    <p class="card__author">{{ author }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.card {
  background-color: $light-grey;
  padding: 12px;
  border-radius: 12px;
  max-width: 335px;
  margin: 0 auto;
  text-align: justify;
  font-family: $body;

  &__stars {
    display: flex;
    gap: 5px;
    margin-bottom: 15px;
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

  &__text {
    font-size: 16px;
    line-height: 20px;
    color: $black;
    margin-bottom: 10px;
  }

  &__author {
    font-weight: bold;
    font-size: 14.4px;
    color: $black;
  }
}
</style>
