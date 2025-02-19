<template>
  <section class="about-us">
    <div class="about-us__content">
      <h1 class="about-us__title">Sobre Nosotros</h1>
      <p class="about-us__description">
        En <strong>Epic Bites</strong>, creemos que la cocina debe ser accesible, divertida y
        deliciosa para todos. No importa si eres un experto en la cocina o si apenas estás
        comenzando, aquí encontrarás inspiración para preparar recetas sencillas, saludables y
        llenas de sabor.
      </p>
      <p class="about-us__description">
        Nuestro objetivo es crear una comunidad global donde las personas compartan sus recetas
        favoritas, descubran nuevas culturas gastronómicas y disfruten del placer de cocinar en
        casa. Creemos en el poder de la comida para unir a las personas y transformar momentos
        cotidianos en experiencias memorables.
      </p>
    </div>

    <div class="about-us__image">
      <Image src="/images/pareja.jpg" alt="Persona cocinando en la cocina" width="400" />
    </div>
  </section>

  <section class="nuestra-mision">
    <div class="nuestra-mision__content">
      <h2 class="nuestra-mision__title">Nuestra Misión y Propósito</h2>
      <p class="nuestra-mision__description">
        En <strong>Epic Bites</strong>, queremos inspirar a las personas a descubrir nuevas recetas,
        mejorar sus habilidades culinarias y compartir su amor por la cocina. Nos esforzamos por
        ofrecer una plataforma accesible, repleta de contenido útil y de calidad, que permita a
        todos, desde principiantes hasta chefs experimentados, explorar la gastronomía de forma
        sencilla.
      </p>
      <p class="nuestra-mision__description">
        Creemos que cocinar no es solo una necesidad, sino un arte, una forma de expresión y una
        oportunidad para compartir con los demás. En un mundo donde el tiempo es un recurso valioso,
        queremos simplificar la cocina sin sacrificar la calidad ni el sabor.
      </p>
    </div>

    <div class="nuestra-mision__image">
      <Image src="/images/nenes.jpg" alt="Niños cocinando" width="400" />
    </div>
  </section>

  <section class="nuestro-equipo">
    <h2 class="nuestro-equipo__title">Nuestro Equipo</h2>
    <div class="nuestro-equipo__container">
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

  <!--
  <section class="contact-form">
    <h2 class="contact-form__title">¿Quieres compartir algo con nosotros?</h2>
    <p class="contact-form__description">
      Déjanos tu correo y número de teléfono junto con un mensaje. Nos pondremos en contacto contigo
      lo antes posible.
    </p>
   <form class="contact-form__form">
      <div class="contact-form__group">
        <label for="email">Correo Electrónico</label>
        <input type="email" id="email" name="email" placeholder="ejemplo@email.com" required />
      </div>

      <div class="contact-form__group">
        <label for="phone">Teléfono</label>
        <input type="tel" id="phone" name="phone" placeholder="+34 600 123 456" required />
      </div>

      <div class="contact-form__group">
        <label for="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows="4"
          placeholder="Escribe tu mensaje aquí..."
          required
        ></textarea>
      </div>

      <button type="submit" class="contact-form__button">Enviar</button>
    </form>
  </section>
  -->
</template>

<script setup lang="ts">
import TeamMember from '@/components/TeamMember.vue'
import { teamMembers } from '@/data/teamMembers'
import { Image } from 'primevue'
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
  max-width: 1400px;
  margin: 0 auto;

  &__title {
    font-size: 28px;
    font-weight: bold;
    color: $secondary-orange;
    font-family: $heading;
    margin-bottom: 20px;
  }

  &__container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
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
