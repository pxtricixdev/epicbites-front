<template>
  <div class="home-page">
    <Banner
      title="Cocina, comparte e inspira: una comunidad para los amantes de la buena comida"
      description="Guarda, organiza y planifica tus recetas para una cocina sin complicaciones."
      :features="features"
      note="¡Comienza a cocinar hoy mismo!"
    />

    <section class="home-page__recipes">
      <h2 class="home-page__section-title">Recetas mejor valoradas 🔥</h2>
      <div v-if="loadingMostRated && mostRatedRecipes.length === 0" class="home-page__loading-data">
        <p>Cargando...</p>
      </div>
      <div class="home-page__recipes__cards">
        <RecipeCarousel :recipes="mostRatedRecipes.slice(0, 11)" />
      </div>
    </section>

    <section class="home-page__feature">
      <div class="feature-container">
        <FeatureSection
          title="¡Inspírate y cocina!"
          subtitle="Desde platos rápidos hasta recetas gourmet, aquí tienes todo lo que necesitas."
          :link="`/receta/${randomRecipe}`"
          image="/images/coockingsection2.webp"
          backgroundColor="#000"
          textColor="#fff"
        />
      </div>
      <div class="feature-container">
        <FeatureSection
          title="¡Planifica tus comidas fácilmente!"
          subtitle="Diseña tu menú semanal y lleva el control de tus comidas de forma sencilla."
          :link="'/weekly-menu'"
          image="/images/mealpreping.webp"
          backgroundColor="#E7E34F"
          textColor="#000"
        />
      </div>
    </section>

    <section class="home-page__recipes">
      <h2 class="home-page__section-title">Recetas vegetarianas 🌱</h2>
      <div v-if="loadingAllRecipes" class="home-page__loading-data">
        <p>Cargando...</p>
      </div>
      <div class="home-page__recipes__cards">
        <RecipeCarousel :recipes="vegetarianRecipes" />
      </div>
    </section>

    <section class="home-page__recipes">
      <h2 class="home-page__section-title">Recetas rápidas < 20 mins</h2>
      <div v-if="loadingAllRecipes" class="home-page__loading-data">
        <p>Cargando...</p>
      </div>
      <div class="home-page__recipes__cards">
        <RecipeCarousel :recipes="fastRecipes" />
      </div>
    </section>

    <section class="home-page__reviews">
      <h2 class="home-page__section-title">Últimas reseñas ⭐</h2>
      <div v-if="loadingAllReviews" class="home-page__loading-data">
        <p>Cargando...</p>
      </div>
      <div v-else class="reviews-container">
        <div v-for="data in allReviews.slice(0, 6)" :key="data.id">
          <HomeReview
            :stars="data.score"
            :text="data.text"
            :author="data.username"
            :recipe="data.name"
            :recipeLink="`/receta/${data.recipeId}`"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Banner from '@/components/HomeBanner.vue'
import HomeReview from '@/components/HomeReview.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import HomeSection from '@/components/HomeSection.vue'
import { onMounted, ref } from 'vue'
import RecipeCarousel from '@/components/RecipeCarousel.vue'
import type { IGetAllRecipes } from '@/stores/interfaces/IGetAllRecipes'
import { useRecipeStore } from '@/stores/recipeStore'
import { useReviewStore } from '@/stores/reviewStore'
import { storeToRefs } from 'pinia'

const features = ['Rápido', 'Sencillo', 'Delicioso']
const vegetarianRecipes = ref<IGetAllRecipes[]>([])
const fastRecipes = ref<IGetAllRecipes[]>([])
const randomRecipe = ref(0)

const recipeStore = useRecipeStore()
const { allRecipes, loadingAllRecipes, mostRatedRecipes, loadingMostRated } =
  storeToRefs(recipeStore)
const { fetchAllRecipes, fetchMostRatedRecipes } = recipeStore

const reviewStore = useReviewStore()
const { allReviews, loadingAllReviews } = storeToRefs(reviewStore)
const { fetchAllReviews } = reviewStore

onMounted(async () => {
  await fetchAllRecipes()
  await fetchMostRatedRecipes()
  await fetchAllReviews()

  vegetarianRecipes.value = allRecipes.value.filter(
    (recipe) => recipe.diet.toLowerCase() === 'vegetariana',
  )

  fastRecipes.value = allRecipes.value.filter((recipe) => recipe.time <= 20)

  randomRecipe.value = allRecipes.value[Math.floor(Math.random() * allRecipes.value.length)].id
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.home-page {
  &__section-title {
    font-size: 24px;
    font-family: $body;
    color: $black;
    margin-left: 15px;
  }
  &__reviews {
    padding-top: 40px;
    max-width: 1200px;
    margin: 0 auto;
    margin-bottom: 60px;
  }

  &__feature {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 70px;
    margin-bottom: 20px;
    gap: 50px;
  }

  &__recipes {
    padding-top: 40px;
    max-width: 1200px;
    margin: 0 auto;

    &__cards {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
  }

  &__loading-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    color: black;
    font-family: $body;
  }
}

.feature-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.reviews-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
