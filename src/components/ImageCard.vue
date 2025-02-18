<template>
    <div class="image-card">
      <Image :src="image" class="image-card__image" />
    </div>
  </template>
  
  <script setup lang="ts">
  import Image from 'primevue/image';
  
  defineProps<{
    image: string
  }>()
  </script>
  
  <style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;
  @use '@/assets/styles/mixins' as *;
  
  .image-card {
    width: 100%;
    max-width: 400px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
  
    &__image {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: 12px;
    }
  }
  </style>
  