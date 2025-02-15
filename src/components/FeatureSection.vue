<template>
  <div class="feature-card">
    <div class="feature-card__image">
      <img :src="image" />
    </div>
    <LinkRouter :to="link">
      <div class="feature-card__content">
        <h3 class="feature-card__title">{{ title }}</h3>
        <p class="feature-card__description">{{ subtitle }}</p>
      </div>
    </LinkRouter>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  title: string
  subtitle: string
  link: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.feature-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(126, 126, 126, 0.2);
  background-color: $black;
  width: 250px;
  height: 230px;
  transition: ease-in-out 0.3s;

  &:hover {
    transform: translateY(2px);
    transition: transform 0.3s ease-in-out;
  }

  &__image {
    width: 100%;
    height: 155px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    padding: 16px;
    text-align: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    font-family: $body;
  }

  &__description {
    font-size: 12px;
    font-family: $body;
  }
}
</style>
