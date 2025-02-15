<script setup lang="ts">
defineProps({
  title: String,
  description: String,
  features: Array,
  note: String,
  image1: String,
  image2: String,
  image3: String,
})
</script>

<template>
  <section class="promo-banner">
    <div class="promo-banner__left">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <ul>
        <li v-for="(feature, index) in features" :key="index">✔ {{ feature }}</li>
      </ul>
      <p class="promo-banner__note">{{ note }}</p>
      <hr class="promo-banner__divider" />
    </div>
    <div class="promo-banner__right">
      <img :src="image2" class="promo-banner__image-small" />
      <img :src="image1" class="promo-banner__image" />
      <img :src="image3" class="promo-banner__image-small" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.promo-banner {
  display: flex;
  flex-direction: column;
  margin: 20px auto;
  overflow: hidden;

  &__divider {
    border: none;
    border-top: 2px solid $black;
    margin: 20px 0;
    box-sizing: border-box;
  }

  &__left {
    background: $primary-yellow;
    padding: 20px;
    text-align: center;
    font-family: $heading;

    h1 {
      font-size: 1.8rem;
      margin-bottom: 10px;
    }

    p {
      font-size: 1rem;
      margin-bottom: 10px;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
    }

    &__note {
      font-size: 0.8rem;
      color: $black;
      margin-top: 10px;
    }

    &__divider {
      border: none;
      border-top: 2px solid $black;
    }
  }

  &__right {
    display: flex;
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
