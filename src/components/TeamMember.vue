<template>
  <div class="team-card">
    <div class="team-card__image">
      <img :src="image" :alt="name" />
    </div>
    <div class="team-card__content">
      <h3 class="team-card__name">{{ name }}</h3>
      <p class="team-card__role">{{ role }}</p>
      <p class="team-card__description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  name: string
  role: string
  description: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.team-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $white;
  border-radius: 12px;
  padding: 20px;
  width: 250px;
  height: 350px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  &__image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 10px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-size: 18px;
    font-weight: bold;
    color: $black;
    margin-bottom: 4px;
    font-family: $body;
  }

  &__role {
    font-size: 12px;
    font-weight: 600;
    color: $secondary-orange;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-family: $body;
  }

  &__description {
    font-size: 14px;
    color: $black;
    line-height: 1.5;
    font-family: $body;
  }
}
</style>
