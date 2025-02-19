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
        <HomeReview
          :stars="5"
          text="¡La pizza de pepperoni es increíble! La hice para mi familia y a todos les encantó."
          author="Alex"
          recipe="Pizza de pepperoni"
        />
        <HomeReview
          :stars="4"
          text="La ensalada de pollo es mi receta favorita. La hago cada semana y nunca me canso de ella."
          author="Patricia"
          recipe="Ensalada de pollo"
        />
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

const features = ['Rápido', 'Sencillo', 'Delicioso']
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
    margin: 40px 15px;
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
