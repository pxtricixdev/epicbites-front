<template>
  <div class="star-rating-select">
    <div class="stars-container">
      <span
        v-for="i in 5"
        :key="i"
        class="star-item"
        @click="selectRating(i)"
        @mouseover="hoverRating = i"
        @mouseleave="hoverRating = 0"
      >
        <svg
          class="estrella-rating"
          :class="{ 'estrella-inactive': (hoverRating || props.modelValue) < i }"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25 5 L31.5 18.5 L46.5 20.5 L35.75 31 L38.5 46 L25 39 L11.5 46 L14.25 31 L3.5 20.5 L18.5 18.5 Z"
            fill="#FFD700"
            stroke="#FFA500"
            stroke-width="1"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:modelValue'])
const hoverRating = ref(0)

const selectRating = (rating: number) => {
  emit('update:modelValue', rating)
}
</script>

<style lang="scss" scoped>
.star-rating-select {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;

  .stars-container {
    display: flex;
    gap: 5px;
  }

  .star-item {
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  .estrella-rating {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    transition: opacity 0.2s ease;

    &.estrella-inactive {
      opacity: 0.3;
    }
  }

  .rating-value {
    font-size: 14px;
    font-weight: 500;
    margin-top: 5px;
  }
}
</style>
