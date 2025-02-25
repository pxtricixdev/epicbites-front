<template>
  <div class="home-page">
    <Banner
      title="Cocina, comparte e inspira: una comunidad para los amantes de la buena comida"
      description="Guarda, organiza y planifica tus recetas para una cocina sin complicaciones."
      :features="features"
      note="¡Comienza a cocinar hoy mismo!"
      image1="/images/pizza.jpg"
      image2="/images/mix.jpg"
      image3="/images/salad.jpg"
    />

    <section class="home-page__reviews">
      <h2 class="home-page__section-title">Últimas reseñas ⭐</h2>
      <div class="reviews-container">
        <div v-for="data in dataReviews" :key="data.id">
          <HomeReview
            :stars="data.score"
            :text="data.text"
            author="Alex"
            recipe="Pizza de pepperoni"
            :recipeLink="`/recetas/${data.recipeId}`"
          />
        </div>
      </div>
    </section>

    <section class="home-page__feature">
      <div class="feature-container">
        <FeatureSection
          title="¿Qué vas a cocinar hoy?"
          subtitle="Descubre nuevas recetas"
          link="/recetas"
          image="/images/pizza.jpg"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Banner from '@/components/HomeBanner.vue'
import HomeReview from '@/components/HomeReview.vue'
import FeatureSection from '@/components/FeatureSection.vue'
import { useGetReviews } from '@/stores/useGetReviews'
import { onMounted } from 'vue'

const features = ['Rápido', 'Sencillo', 'Delicioso']

const {
  dataReviews,
  fetchReviews,
  loading: dataReviewsLoading,
  error: dataReviewsError,
} = useGetReviews()

onMounted(async () => {
  await fetchReviews()
  console.log('Somos los comentarios', dataReviews.value)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.home-page {
  &__section-title {
    font-size: 24px;
    margin-bottom: 20px;
    font-family: $body;
    color: $black;
  }
  &__reviews {
    padding-top: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__feature {
    margin-top: 30px;
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
  gap: 20px;
  flex-wrap: wrap;
}
</style>
