<template>
    <section class="terms">
        <header class="terms__header">
            <h1 class="terms__title">TÉRMINOS Y CONDICIONES</h1>
        </header>

        <article class="terms__section" v-for="section in termsSections" :key="section.id">
            <h2 class="terms__subtitle">{{ section.title }}</h2>
            <p v-if="section.content" class="terms__text" v-html="section.content"></p>
            <ul v-if="section.list" class="terms__list">
                <li v-for="(item, index) in section.list" :key="index" class="terms__list__item">{{ item }}</li>
            </ul>
        </article>
    </section>
</template>

<script lang="ts" setup>
const termsSections = [
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
        El uso del sitio web y de los servicios de Epic Bites está condicionado a la aceptación de estos Términos y Condiciones.
        Esto incluye, entre otros, el acceso a recetas, participación en promociones, registro de usuarios y cualquier interacción con la comunidad de Epic Bites.
        Recomendamos al Usuario leer cuidadosamente estos términos antes de utilizar nuestro Sitio Web y los servicios asociados.
      `,
    },
    {
        id: 3,
        title: '3. Obligaciones del Usuario',
        list: [
            'Proveer información veraz y actualizada en los formularios de registro.',
            'Hacer un uso adecuado del Sitio Web, sin incurrir en actividades ilegales o que puedan dañar la imagen de Epic Bites.',
            'Respetar las normas de la comunidad, así como las políticas de privacidad y protección de datos.',
        ],
    },
    {
        id: 4,
        title: '4. Servicios Ofrecidos',
        list: [
            'Publicación y consulta de recetas originales.',
            'Participación en concursos y retos gastronómicos.',
            'Acceso a contenido exclusivo para usuarios registrados.',
            'Asesoramiento culinario y atención al cliente.',
        ],
    },
    {
        id: 5,
        title: '5. Limitaciones de Responsabilidad',
        list: [
            'Problemas técnicos, errores o interrupciones en el Sitio Web fuera de su control.',
            'Contenidos generados por terceros, como comentarios o enlaces externos.',
            'Uso indebido de las recetas o contenidos por parte de los usuarios.',
        ],
    },
    {
        id: 6,
        title: '6. Modificaciones de los Términos',
        content: `
        Epic Bites se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.
        Los cambios serán notificados en el Sitio Web y entrarán en vigor inmediatamente, salvo que se especifique lo contrario.
      `,
    },
    {
        id: 7,
        title: '7. Ley Aplicable y Jurisdicción',
        content: `
        Estos Términos y Condiciones se rigen por la legislación española.
        Cualquier conflicto derivado de su aplicación será resuelto en los tribunales de la ciudad de Madrid, salvo que la normativa aplicable disponga lo contrario.
      `,
    },
];
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.terms {
    padding: 20px;
    color: $secondary-orange;
    font-family: $body;

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