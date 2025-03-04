<template>
  <div class="card-recipe">
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
        <RouterLink :to="`/recetas/${flavour}`" class="card-recipe__flavour"
          >{{ flavour }}
        </RouterLink>
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
                difficulty === 'Facil' ? '#7fe570' : difficulty === 'Media' ? 'orange' : '#8bd2ff',
            }"
          >
            {{ difficulty }}
          </span>
        </RouterLink>
      </div>
    </div>
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
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
.card-recipe {
  width: 241px;
  height: 381px;
  box-shadow: 0px 2px 10px rgba(126, 126, 126, 0.05);
  border-radius: 16px;
  background-color: $white;
  color: $black;
  overflow: hidden;
  position: relative;

  &__image {
    width: 100%;
    height: 60%;
    object-fit: cover;
    border-radius: 8px 8px 0 0;
    transition: transform 0.3s ease-in-out;

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
    gap: 10px;
  }

  &__time {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #676767;
  }

  &__title {
    font-weight: 400;
    font-size: 15px;
    color: $black;
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
  }

  &__meal,
  &__diet,
  &__flavour {
    color: #656565;
    border: 1px solid #ffc993;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 12px;
    width: fit-content;

    &:hover {
      background-color: #f3f3f3;
    }
  }
}
</style>
