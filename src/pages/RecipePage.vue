<template>
    <section v-if="dataRecipeDetail" class="recipe-page">
      <div class="recipe-page__main">
        <div v-if="dataRecipeDetailLoading" class="recipe-page__loading">
          <p>loading...</p>
        </div>
        <div v-else class="recipe-page__container">
          <div class="recipe-page__image">
            <img :src="dataRecipeDetail.image" alt="Imagen de la receta" />
          </div>
          <div class="recipe-page__info">
            <h1 class="recipe-page__title">{{ dataRecipeDetail.name }}</h1>
            <p class="recipe-page__author">By: {{ dataRecipeDetail.userName }}</p>
            <div class="recipe-page__meta">
              <span class="recipe-page__score">⭐ {{ dataRecipeDetail.score }}</span>
              <span class="recipe-page__time">⏳ {{ dataRecipeDetail.time }} min</span>
              <span class="recipe-page__calories">🔥 {{ dataRecipeDetail.calories }} kcal</span>
            </div>
          </div>
        </div>
      </div>
  
      <div class="recipe-page__details">
        <div class="recipe-page__ingredients">
          <h2>🛒 <span>Ingredientes</span></h2>
          <ul>
            <li v-for="ingredient in dataRecipeDetail.ingredients" :key="ingredient.ingredientId">
              {{ ingredient.quantity }} {{ ingredient.unit }} - {{ ingredient.ingredientName }}
            </li>
          </ul>
        </div>

        <div class="recipe-page__steps">
          <h2>🍽️ <span>Pasos a seguir</span></h2>
          <ul>
            <li>
              <p>{{ dataRecipeDetail.description }}</p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  import { useGetRecipeDetail } from '@/stores/useGetRecipeDetail'
  
  const {
    dataRecipeDetail,
    fetchRecipeDetail,
    loading: dataRecipeDetailLoading,
    error: dataRecipeDetailError,
  } = useGetRecipeDetail()
  
  onMounted(async () => {
    await fetchRecipeDetail()
    console.log('Datos de la receta:', dataRecipeDetail.value)
  })
  </script>
  
  <style lang="scss" scoped>
  @use '@/assets/styles/variables' as *;
  @use '@/assets/styles/variables' as *;
  
  .recipe-page {
    max-width: 1200px;
    margin: 40px auto;
    padding: 20px;
    font-family: $body;
  
    &__main {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      text-align: center;
    }
  
    &__image {
      width: 100%;
      max-width: 350px;
  
      img {
        width: 100%;
        border-radius: 12px;
        object-fit: cover;
      }
    }
  
    &__info {
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
  
    &__title {
      font-size: 28px;
      margin-top: 20px;
      color: $black;
      font-family: $heading;
    }
  
    &__author {
      font-size: 18px;
      color: $secondary-orange;
      font-weight: bold;
      margin-top: 5px;
    }
  
    &__meta {
      display: flex;
      justify-content: center;
      gap: 10px;
      font-size: 14px;
      margin: 10px 0;
    }
  
    &__score,
    &__time,
    &__calories {
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 16px;
    }
  
    &__details {
      display: flex;
      flex-direction: column;
      gap: 30px;
      margin-top: 30px;
      align-items: center;
    }
  
    &__ingredients,
    &__steps {
      width: 100%;
      max-width: 500px;
      text-align: left;
    }
  
    h2 {
      font-size: 20px;
      margin-bottom: 10px;
      color: $secondary-orange;
      font-family: $heading;
    }
  
    ul {
      list-style: none;
      padding: 0;
  
      li {
        font-size: 16px;
        margin-bottom: 12px;
        line-height: 1.5;
        background: $white;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
        strong {
          color: $black;
          font-size: 16px;
        }
      }
    }
  
    @media (min-width: 768px) {
      .recipe-page {
        &__container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          gap: 45px;
          margin-bottom: 30px;
        }
  
        &__image {
          width: 50%;
          max-width: 350px;
        }
  
        &__info {
          width: 50%;
          text-align: left;
          padding-left: 30px;
        }
  
        &__meta {
          justify-content: flex-start;
        }
  
        &__details {
          flex-direction: row;
          justify-content: space-between;
          text-align: left;
          width: 100%;
  
          &__ingredients,
          &__steps {
            width: 48%;
            text-align: left;
          }
        }
      }
    }
  }
  </style>
  