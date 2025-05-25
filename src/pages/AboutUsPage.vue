<template>
  <Head>
    <title>{{ seoTitle }}</title>
    <meta name="description" :content="seoDescription" />
    <meta name="keywords" content="Epic Bites, sobre nosotros, equipo culinario, recetas caseras, comunidad gastronómica, cocina accesible, chef expertos" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Epic Bites Team" />
  </Head>

  <section class="about-us" >
    <div class="about-us__content">
      <h1 class="about-us__title" itemprop="headline">Sobre Nosotros</h1>
      <p class="about-us__description" itemprop="description">
        En <strong itemprop="name">Epic Bites</strong>, creemos que la cocina debe ser accesible, divertida y
        deliciosa para todos. No importa si eres un experto en la cocina o si apenas estás
        comenzando, aquí encontrarás inspiración para preparar recetas sencillas, saludables y
        llenas de sabor.
      </p>
      <p class="about-us__description" itemprop="description">
        Nuestro objetivo es crear una comunidad global donde las personas compartan sus recetas
        favoritas, descubran nuevas culturas gastronómicas y disfruten del placer de cocinar en
        casa. Creemos en el poder de la comida para unir a las personas y transformar momentos
        cotidianos en experiencias memorables.
      </p>
    </div>

    <div class="about-us__image">
      <Image 
        src="/images/pareja.webp" 
        alt="Pareja cocinando juntos en una cocina moderna, preparando recetas caseras con alegría" 
        width="400"
        itemprop="image"
      />
    </div>
  </section>

  <section class="nuestra-mision" >
    <div class="nuestra-mision__content">
      <h2 class="nuestra-mision__title" itemprop="name">Nuestra Misión y Propósito</h2>
      <p class="nuestra-mision__description" itemprop="mission">
        En <strong>Epic Bites</strong>, queremos inspirar a las personas a descubrir nuevas recetas,
        mejorar sus habilidades culinarias y compartir su amor por la cocina. Nos esforzamos por
        ofrecer una plataforma accesible, repleta de contenido útil y de calidad, que permita a
        todos, desde principiantes hasta chefs experimentados, explorar la gastronomía de forma
        sencilla.
      </p>
      <p class="nuestra-mision__description" itemprop="description">
        Creemos que cocinar no es solo una necesidad, sino un arte, una forma de expresión y una
        oportunidad para compartir con los demás. En un mundo donde el tiempo es un recurso valioso,
        queremos simplificar la cocina sin sacrificar la calidad ni el sabor.
      </p>
    </div>

    <div class="nuestra-mision__image">
      <Image 
        src="/images/nenes.webp" 
        alt="Niños felices aprendiendo a cocinar recetas fáciles en la cocina familiar" 
        width="400"
        itemprop="image"
      />
    </div>
  </section>

  <section class="nuestro-equipo" >
    <h2 class="nuestro-equipo__title" itemprop="name">Nuestro Equipo</h2>
    <div class="nuestro-equipo__container" itemprop="member">
      <div v-for="member in teamMembers" :key="member.image">
        <TeamMember
          :image="member.image"
          :name="member.name"
          :role="member.role"
          :description="member.description"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TeamMember from '@/components/TeamMember.vue'
import { teamMembers } from '@/data/teamMembers'
import { Image } from 'primevue'

// meta tags dinámicos
const seoTitle = computed(() => {
  const teamCount = teamMembers?.length || 0
  if (teamCount > 0) {
    return `Sobre Epic Bites - Equipo de ${teamCount} Expertos Culinarios | Nuestra Historia`
  }
  return 'Sobre Epic Bites - Nuestra Misión y Equipo Culinario | Comunidad Gastronómica'
})

const seoDescription = computed(() => {
  const teamCount = teamMembers?.length || 0
  if (teamCount > 0) {
    return `Conoce la historia de Epic Bites y nuestro equipo de ${teamCount} expertos culinarios. Creamos una comunidad global para compartir recetas caseras, saludables y deliciosas para todos.`
  }
  return 'Descubre la historia de Epic Bites, nuestra misión de hacer la cocina accesible y divertida para todos. Conoce a nuestro equipo de expertos culinarios y únete a nuestra comunidad gastronómica.'
})

</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.about-us,
.nuestra-mision {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;

  &__content {
    margin-bottom: 20px;
  }

  &__title {
    font-size: 32px;
    font-weight: bold;
    color: $secondary-orange;
    font-family: $heading;
    margin-bottom: 20px;
  }

  &__description {
    font-size: 16px;
    line-height: 1.6;
    color: $black;
    font-family: $body;
    margin-bottom: 15px;
  }

  &__image {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

.nuestro-equipo {
  text-align: center;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 50px;

  &__title {
    font-size: 28px;
    font-weight: bold;
    color: $secondary-orange;
    font-family: $heading;
    margin-bottom: 40px;
  }

  &__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 40px;
  }
}

.contact-form {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;

  &__title {
    font-size: 28px;
    font-weight: bold;
    color: $secondary-orange;
    font-family: $heading;
    margin-bottom: 10px;
  }

  &__description {
    font-size: 16px;
    color: $black;
    margin-bottom: 20px;
    font-family: $body;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  &__group {
    display: flex;
    flex-direction: column;
    text-align: left;

    label {
      font-size: 14px;
      font-weight: 600;
      color: $black;
      margin-bottom: 5px;
    }

    input,
    textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid $light-grey;
      border-radius: 8px;
      font-size: 16px;
      font-family: $body;
    }
  }

  &__button {
    background-color: $secondary-orange;
    color: $white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 8px;
  }
}

:deep(.p-image img) {
  border-radius: 15px;
  transition: transform ease-in-out 0.4s;

  &:hover {
    transform: scale(1.02);
  }
}
</style>
