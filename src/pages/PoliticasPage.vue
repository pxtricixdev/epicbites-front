<template>
  <section class="policy">
    <header class="policy__header">
      <h1 class="policy__title">POLÍTICA DE PRIVACIDAD</h1>
    </header>

    <article class="policy__section" v-for="section in policySections" :key="section.id">
      <h2 class="policy__subtitle">{{ section.title }}</h2>
      <p v-if="section.content" class="policy__text" v-html="section.content"></p>
      <ul v-if="section.list" class="policy__list">
        <li v-for="(item, index) in section.list" :key="index" class="policy__list__item">
          {{ item }}
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
const policySections = [
  {
    id: 1,
    title: '1. Identificación',
    content: `
      Responsable del Tratamiento: <strong>EPIC BITES</strong> (en adelante, “Epic Bites”).<br>
      CIF: B-12345678<br>
      Domicilio Social: C/ Sabores del Mundo, 10, 3º, 28004 Madrid, España.<br>
      Registro Mercantil: Registro Mercantil de Madrid, Tomo: 50000, Folio: 120, Hoja M-123456.
    `,
  },
  {
    id: 2,
    title: '2. Información',
    content: `
      Al aceptar esta Política de Protección de Datos, el Usuario queda informado de que los datos personales proporcionados a través del sitio web
      serán tratados por Epic Bites como responsable del tratamiento para los fines indicados en esta Política de Protección de Datos.
    `,
  },
  {
    id: 3,
    title: '3. Obligación de proporcionar datos',
    list: [
      'Datos proporcionados por el Usuario al registrarse o adquirir servicios.',
      'Datos de fuentes de terceros, como redes sociales o plataformas de venta.',
      'Datos de navegación obtenidos mediante cookies.',
    ],
  },
  {
    id: 4,
    title: '4. Origen de los datos',
    list: [
      'Del Usuario: al registrarse, comprar entradas o suscribirse a boletines.',
      'De terceros: colaboradores como redes sociales o plataformas de venta.',
      'De la navegación en el Sitio Web: datos obtenidos mediante cookies.',
    ],
  },
  {
    id: 5,
    title: '5. Datos tratados',
    list: [
      'Datos identificativos: nombre, apellidos, DNI/NIE.',
      'Datos de contacto: email, teléfono, dirección postal.',
      'Datos de uso y preferencias: películas vistas, frecuencia de visitas.',
      'Datos de salud: proporcionados por el Usuario para necesidades específicas.',
    ],
  },
  {
    id: 6,
    title: '6. Base legal del tratamiento',
    list: [
      'Ejecución de un contrato: gestionar compras y servicios contratados.',
      'Cumplimiento de obligaciones legales: protección de datos y normativa fiscal.',
      'Consentimiento: para comunicaciones promocionales o sorteos.',
    ],
  },
  {
    id: 7,
    title: '7. Conservación de datos',
    list: [
      'Datos de compras: durante la relación contractual y el plazo de prescripción.',
      'Datos de comunicaciones comerciales: hasta que el Usuario revoque su consentimiento.',
    ],
  },
  {
    id: 8,
    title: '8. Derechos del Usuario',
    list: [
      'Acceso: conocer qué datos personales se están tratando.',
      'Rectificación: corregir datos incorrectos.',
      'Supresión: solicitar la eliminación de datos.',
      'Oposición: oponerse al tratamiento basado en el interés legítimo.',
    ],
  },
  {
    id: 9,
    title: '9. Medidas de seguridad',
    content: `
      Epic Bites implementará medidas técnicas y organizativas para proteger los datos personales frente a accesos no autorizados, pérdida o divulgación indebida.
    `,
  },
  {
    id: 10,
    title: '10. Modificaciones de la política',
    content: `
      Epic Bites se reserva el derecho de actualizar esta Política de Privacidad. Se recomienda revisarla periódicamente.
    `,
  },
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.policy {
  padding: 20px;
  font-family: $body;
  max-width: 1200px;
  margin: 0 auto;

  &__header {
    text-align: center;
    margin-bottom: 20px;
    color: $black;
  }

  &__title {
    font-size: 32px;
    font-weight: bold;
    font-family: $heading;
  }

  &__section {
    margin-bottom: 20px;
  }

  &__subtitle {
    font-size: 24px;
    color: $secondary-orange;
    margin-bottom: 10px;
    font-family: $heading;
  }

  &__text {
    line-height: 1.6;
    margin-bottom: 10px;
    text-align: justify;
    color: $black;
  }

  &__list {
    padding-left: 20px;
    color: $black;

    &__item {
      list-style-type: disc;
      margin-bottom: 5px;
    }
  }
}
</style>
