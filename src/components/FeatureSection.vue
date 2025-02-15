<script setup lang="ts">
defineProps({
  image: String,
  title: String,
  subtitle: String,
})
</script>

<template>
  <div class="feature-card">
    <div class="feature-card__image">
      <img :src="image" />
    </div>
    <div class="feature-card__content">
      <h3 class="feature-card__title">{{ title }}</h3>
      <p class="feature-card__description">{{ subtitle }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.feature-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: $secondary-orange;
  width: 335px;

  &__image {
    width: 100%;
    height: 250px;
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
  }

  &__title {
    font-size: 20px;
    font-weight: 800;
    color: $black;
    margin-bottom: 12px;
    font-family: $heading;
  }

  &__description {
    font-size: 14px;
    color: $black;
    line-height: 1.5;
    font-family: $body;
  }
}
</style>
