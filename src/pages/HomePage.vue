<script setup lang="ts">
import Banner from '@/components/Banner.vue'
import Review from '@/components/Review.vue'
import FeatureSection from '@/components/FeatureSection.vue'

const features = ['Rápido', 'Sencillo', 'Delicioso']
</script>

<template>
  <div class="home-page">
    <Banner
      title="Tu espacio para descubrir, organizar y cocinar recetas deliciosas"
      description="Accede a cientos de recetas, guárdalas y comparte las tuyas con el mundo"
      :features="features"
      note="¡Comienza a cocinar hoy mismo!"
      image1="/public/Img/pizza.jpg"
      image2="/public/Img/mix.jpg"
      image3="/public/Img/salad.jpg"
    />

    <section class="home-page__reviews">
      <h2 class="home-page__section-title">Reseñas de nuestros usuarios</h2>
      <div class="reviews-container">
        <Review
          :stars="5"
          text="El sitio de recetas más útil que he encontrado. Uso las recetas para cocinar para mis amigos y siempre les encanta."
          author="Alex"
        />
        <Review
          :stars="4"
          text="Las recetas son súper sencillas de seguir, y me han ayudado a mejorar en la cocina."
          author="Patricia"
        />
      </div>
    </section>

    <section class="home-page__feature">
      <div class="feature-container">
        <FeatureSection
          title="¿Estás sin ideas para cocinar?"
          subtitle="Descubre nuevas recetas"
          image="/public/Img/pizza.jpg"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.home-page {
  &__section-title {
    font-size: 28px;
    margin-bottom: 20px;
    text-align: center;
    font-family: $heading;
  }

  &__reviews {
    margin: 40px 0;
  }

  &__feature {
    margin-top: 60px;
  }
}

.feature-container {
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
}

.reviews-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
