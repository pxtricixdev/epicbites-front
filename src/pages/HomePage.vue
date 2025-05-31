<template>
  <div class="home-page">
    <HomeBanner />
    <InspireSection />

    <section class="home-page__recipes">
      <h2 class="home-page__section-title">Recetas mejor valoradas 🔥</h2>
      <div class="home-page__recipes__cards">
        <RecipeCarousel
          :isLoading="loadingMostRated && mostRatedRecipes.length === 0"
          :recipes="mostRatedRecipes.slice(0, 11)"
        />
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
      <div class="home-page__recipes__cards">
        <RecipeCarousel :isLoading="loadingAllRecipes" :recipes="vegetarianRecipes" />
      </div>
    </section>

    <section class="home-page__recipes">
      <h2 class="home-page__section-title">Recetas rápidas &lt; 20 mins</h2>
      <div class="home-page__recipes__cards">
        <RecipeCarousel :isLoading="loadingAllRecipes" :recipes="fastRecipes" />
      </div>
    </section>

    <section class="home-page__reviews">
      <h2 class="home-page__section-title">Últimas reseñas ⭐</h2>
      <div class="reviews-container">
        <div
          v-for="(data, index) in loadingAllReviews
            ? Array.from({ length: 6 })
            : allReviews.slice(0, 6)"
          :key="loadingAllReviews ? index : (data as any).id"
        >
          <HomeReview
            :stars="!loadingAllReviews ? (data as any).score : 0"
            :text="!loadingAllReviews ? (data as any).text : ''"
            :author="!loadingAllReviews ? (data as any).username : ''"
            :recipe="!loadingAllReviews ? (data as any).name : ''"
            :recipeLink="!loadingAllReviews ? `/receta/${(data as any).recipeId}` : '#'"
            :isLoading="loadingAllReviews"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import HomeBanner from '@/components/HomeBanner.vue'
import HomeReview from '@/components/HomeReview.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import { onMounted, ref } from 'vue'
import RecipeCarousel from '@/components/RecipeCarousel.vue'
import type { IGetAllRecipes } from '@/stores/interfaces/IGetAllRecipes'
import { useRecipeStore } from '@/stores/recipeStore'
import { useReviewStore } from '@/stores/reviewStore'
import { storeToRefs } from 'pinia'
import InspireSection from '@/components/InspireSection.vue'

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
    margin-top: 20px;

    @media (min-width: 768px) {
      margin-top: 50px;
      gap: 50px;
    }
  }

  &__recipes {
    padding-top: 30px;
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
