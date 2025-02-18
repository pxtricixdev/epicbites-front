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
      <ImageCard image="/public/img/pareja.jpg" altText="Persona cocinando en la cocina" />
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
      <ImageCard image="/public/img/nenes.jpg" altText="Personas cocinando juntas" />
    </div>
  </section>

  <section class="nuestro-equipo">
    <h2 class="nuestro-equipo__title">Nuestro Equipo</h2>
    <div class="nuestro-equipo__container">
      <TeamMember
        image="/public/img/front.jpg"
        name="Sofía Martínez"
        role="Programadora Frontend"
        description="Sofía es la mente creativa detrás del diseño y la experiencia de usuario de nuestra web. Se asegura de que todo luzca increíble y sea fácil de navegar."
      />
      <TeamMember
        image="/public/img/programador.jpg"
        name="Diego Ramírez"
        role="Programador Backend"
        description="Diego construye la infraestructura que hace posible Epic Bites, asegurando que la plataforma sea rápida, segura y eficiente."
      />
      <TeamMember
        image="/public/img/cliente.jpg"
        name="Pablo Torres"
        role="Atención al Cliente"
        description="Pablo es quien responde a todas tus dudas y sugerencias, garantizando que tu experiencia con Epic Bites sea excelente."
      />
      <TeamMember
        image="/public/img/ceo.jpg"
        name="Valeria Gómez"
        role="CEO & Fundadora"
        description="Valeria es la visión y el liderazgo detrás de Epic Bites, impulsando la misión de hacer la cocina accesible y divertida para todos."
      />
    </div>
  </section>
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
</template>

<script setup lang="ts">
import ImageCard from '@/components/ImageCard.vue'
import TeamMember from '@/components/TeamMember.vue'
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

    img {
      width: 100%;
      max-width: 500px;
      height: auto;
      border-radius: 12px;
    }
  }
}

.nuestro-equipo {
  text-align: center;
  padding: 40px 20px;
  max-width: 1100px;
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
</style>
