<template>
  <div v-if="!isLoading" class="card">
    <div class="card__stars">
      <Star v-for="star in stars" :key="star" class="card__icon filled" />
    </div>
    <RouterLink class="card__link" :to="recipeLink">{{ recipe }}</RouterLink>
    <p class="card__text">{{ text }}</p>
    <p class="card__author">{{ author }}</p>
  </div>

  <div v-else class="card">
    <div class="card__stars">
      <div v-for="n in 5" :key="n" class="skeleton skeleton-star"></div>
    </div>
    <div class="card__link skeleton skeleton-text--short"></div>
    <div class="card__text skeleton skeleton-text--multi"></div>
    <div class="card__author skeleton skeleton-text--short"></div>
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
  isLoading?: boolean
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__author {
    font-weight: bold;
    font-size: 14.4px;
    color: $black;
  }
}

// Skeleton styles
.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f8f8f8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  &-star {
    width: 18px;
    height: 18px;
    border-radius: 50%;
  }

  &-text--short {
    width: 40%;
    height: 14px;
    margin: 6px 0;
  }

  &-text--multi {
    width: 100%;
    height: 34px;
    margin: 6px 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
