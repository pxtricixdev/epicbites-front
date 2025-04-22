<template>
    <div class="note-card">
      <p class="note-card__text">{{ text }}</p>
      <button @click="$emit('delete')" class="note-card__delete-btn">×</button>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    text: string
  }>()
  
  defineEmits(['delete'])
  </script>
  
  <style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;
  
  .note-card {
    background-color: $white;
    position: relative;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    
    &__text {
      font-size: 14px;
      line-height: 1.5;
      color: $black;
      margin: 0;
      padding-right: 25px;
    }
    
    &__delete-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      color: #ff5252;
      font-size: 18px;
      cursor: pointer;
      line-height: 1;
      padding: 0 5px;
    }
  }
  </style>