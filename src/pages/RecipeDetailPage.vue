<template>
  <section class="recipe-page">
    <div class="recipe-page__main">
      <div v-if="dataRecipeDetailLoading" class="recipe-page__loading">
        <p>Cargando...</p>
      </div>
      <div v-else class="recipe-page__container">
        <div class="recipe-page__top-content">
          <div class="recipe-page__image">
            <img :src="dataRecipeDetail.image" alt="Imagen de la receta" />
          </div>
          <div>
            <div class="recipe-page__info">
              <h1 class="recipe-page__title">{{ dataRecipeDetail.name }}</h1>
              <p class="recipe-page__description">{{ dataRecipeDetail.description }}</p>
              <p class="recipe-page__author">{{ dataRecipeDetail.userName }}</p>

              <div class="recipe-page__meta">
                <span class="recipe-page__score">⭐ {{ dataRecipeDetail.score }}</span>
                <span class="recipe-page__time">⏳ {{ dataRecipeDetail.time }} min</span>
                <span class="recipe-page__calories">🔥 {{ dataRecipeDetail.calories }} kcal</span>
              </div>
            </div>
            <div class="recipe-page__ingredients">
              <h2>🛒 <span>Ingredientes</span></h2>
              <ul>
                <li
                  v-for="ingredient in dataRecipeDetail.ingredients"
                  :key="ingredient.ingredientId"
                >
                  {{ ingredient.quantity }} {{ ingredient.unit }} - {{ ingredient.ingredientName }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="recipe-page__details">
          <div class="recipe-page__steps">
            <h2>🍽️ <span>Pasos a seguir</span></h2>
            <ul>
              <li class="recipe-page__steps__list">
                <p>{{ dataRecipeDetail.steps }}</p>
              </li>
            </ul>
          </div>
        </div>
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

  &__top-content {
    display: flex;
    flex-direction: row;
    gap: 70px;
  }

  &__loading {
    font-size: 16px;
    color: $black;
    text-align: center;
  }

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
    color: $black;
    font-family: $body;
  }

  &__description {
    font-size: 18px;
    margin-top: 10px;
    color: $black;
  }

  &__author {
    font-size: 16px;
    color: #777777;
    font-weight: 600;
    margin-top: 5px;
  }

  &__meta {
    display: flex;
    justify-content: center;
    gap: 10px;
    font-size: 14px;
    margin: 10px 0;
    color: $black;
  }

  &__score,
  &__time,
  &__calories {
    padding: 6px 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 16px;
  }

  &__ingredients {
    width: 100%;
    max-width: 500px;
    text-align: left;
    margin-top: 60px;
  }

  &__steps {
    &__list {
      max-width: 910px;
      height: auto;
    }
  }

  h2 {
    font-size: 20px;
    margin-bottom: 10px;
    color: $black;
    font-family: $body;
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 14px;
      margin-bottom: 12px;
      line-height: 1.5;
      background: $white;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      color: $black;

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
        flex-direction: column;
        text-align: left;
        gap: 30px;
        margin-bottom: 30px;
      }

      &__image {
        width: 50%;
        max-width: 350px;
      }

      &__info {
        text-align: left;
      }

      &__meta {
        justify-content: flex-start;
      }
    }
  }
}
</style>
