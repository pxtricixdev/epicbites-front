<template>
  <section class="promo-banner">
    <div class="promo-banner__left">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <ul>
        <li v-for="(feature, index) in features" :key="index">✔ {{ feature }}</li>
      </ul>
      <p class="promo-banner__note">{{ note }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  features: string[]
  note: string
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.promo-banner {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: $white;
  text-align: center;

  &__divider {
    border: none;
    border-top: 2px solid $black;
    margin: 20px 0;
    box-sizing: border-box;
  }

  &__left {
    background-image: url('/images/pexels-jonathanborba-2878745.webp'),
      linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5));
    background-blend-mode: darken;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    opacity: 1;
    padding: 30px 15px;
    font-family: $heading;

    h1 {
      font-size: 1.8rem;
      margin-bottom: 10px;
    }

    p {
      font-size: 14px;
      font-family: $body;
    }

    ul {
      list-style: none;
      padding: 0;
      margin-top: 5px;

      li {
        font-size: 14px;
        margin-bottom: 5px;
        font-family: $body;
        font-style: italic;
      }
    }

    &__divider {
      border: none;
      border-top: 2px solid $black;
    }
  }

  &__note {
    margin-top: 10px;
    font-weight: 600;
  }

  &__right {
    display: none;
    flex-wrap: wrap;
    justify-content: center;
    background-color: $primary-yellow;
    gap: 10px;
    padding-bottom: 20px;
  }

  &__image {
    max-width: 155px;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 12px;
  }

  &__image-small {
    max-width: 115px;
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 12px;
  }
}
</style>
