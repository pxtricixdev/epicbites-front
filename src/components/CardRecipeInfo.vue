<template>
  <div class="card-recipe">
    <template v-if="!isLoading">
      <RouterLink :to="link">
        <img :src="image" :alt="alt" class="card-recipe__image" />
      </RouterLink>
      <div class="card-recipe__info">
        <RouterLink :to="link">
          <h3 class="card-recipe__title">{{ title }}</h3>
        </RouterLink>
        <div class="card-recipe__tags">
          <RouterLink :to="`/recetas/${meal}`" class="card-recipe__meal">{{ meal }}</RouterLink>
          <RouterLink :to="`/recetas/${diet}`" class="card-recipe__diet">{{ diet }}</RouterLink>
          <RouterLink :to="`/recetas/${flavour}`" class="card-recipe__flavour">{{
            flavour
          }}</RouterLink>
        </div>
        <div class="card-recipe__details">
          <div class="card-recipe__time">
            <Clock color="#676767" :size="15" />
            {{ time }}'
          </div>
          <RouterLink :to="`/recetas/${difficulty}`">
            <span
              class="card-recipe__difficulty"
              :style="{
                paddingLeft: '8px',
                paddingRight: '8px',
                borderRadius: '3px',
                backgroundColor:
                  difficulty === 'Fácil'
                    ? '#7fe570'
                    : difficulty === 'Media'
                      ? 'orange'
                      : '#8bd2ff',
              }"
            >
              {{ difficulty }}
            </span>
          </RouterLink>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="card-recipe__image skeleton"></div>
      <div class="card-recipe__info">
        <div class="skeleton skeleton-title"></div>
        <div class="card-recipe__tags">
          <div class="skeleton skeleton-tag" v-for="i in 3" :key="i"></div>
        </div>
        <div class="card-recipe__details">
          <div class="skeleton skeleton-time"></div>
          <div class="skeleton skeleton-difficulty"></div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Clock } from 'lucide-vue-next'

defineProps<{
  image: string
  alt: string
  title: string
  time: number
  diet: string
  difficulty: string
  meal: string
  flavour: string
  link: string
  isLoading?: boolean
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.card-recipe {
  width: 170px;
  height: 320px;
  box-shadow: 0px 2px 10px rgba(126, 126, 126, 0.05);
  border-radius: 16px;
  background-color: $white;
  color: $black;
  overflow: hidden;
  position: relative;

  @media (min-width: 768px) {
    width: 250px;
    height: 400px;
  }

  &__image {
    width: 100%;
    height: 50%;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
    transition: transform 0.3s ease-in-out;

    @media (min-width: 768px) {
      width: 100%;
      height: 60%;
    }

    &:hover {
      cursor: pointer;
      transform: scale(1.02);
    }
  }

  &__info {
    padding: 10px 16px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    align-items: center;

    @media (min-width: 768px) {
      gap: 10px;
    }
  }

  &__time {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #676767;
  }

  &__title {
    font-weight: 600;
    font-size: 13px;
    color: $black;
    height: 40px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }

  &__details {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2px 5px;
    position: absolute;
    bottom: 12px;
    width: 87%;
    left: 10px;
  }

  &__difficulty {
    color: $black;
    font-size: 12px;
    text-align: center;
    display: flex;
    align-items: center;
    margin-right: 5px;

    @media (min-width: 768px) {
      margin-right: 0;
    }
  }

  &__meal,
  &__diet,
  &__flavour {
    color: #656565;
    border: 1px solid #ffc993;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 11px;
    width: fit-content;

    &:hover {
      background-color: #f3f3f3;
    }

    @media (min-width: 768px) {
      font-size: 12px;
    }

    @media (min-width: 1024px) {
      font-size: 13px;
    }
  }
}

.skeleton {
  background: linear-gradient(90deg, #e0e0e0 25%, #f8f8f8 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;

  &.skeleton-title {
    height: 20px;
    width: 80%;
    margin: 10px 0;
  }

  &.skeleton-tag {
    width: 50px;
    height: 16px;
    margin-right: 5px;
  }

  &.skeleton-time {
    width: 40px;
    height: 16px;
  }

  &.skeleton-difficulty {
    width: 60px;
    height: 18px;
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
