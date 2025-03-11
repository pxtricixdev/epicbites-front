<template>
  <button @click="printRecipe" class="print-button">
    <span>Descargar Receta</span>
    <span> <Download :size="16" /> </span>
  </button>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next'

const printRecipe = (): void => {
  window.print()
}
</script>

<style lang="scss">
.print-button {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border: 1px solid grey;
  border-radius: 5px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: 0.1s ease-in-out;
  background-color: transparent;
  color: #333;

  &:hover {
    background-color: #d4d4d4;
  }
}

@media print {
  body * {
    visibility: hidden;
  }

  .reviews,
  nav,
  header,
  footer,
  .print-button,
  .recipe-page__favorite,
  .recipe-page__meta {
    display: none !important;
  }

  .recipe-page__container,
  .recipe-page__container * {
    visibility: visible;
  }

  .recipe-page__container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 20px;
    margin: 0;
  }

  @page {
    size: A4;
    margin: 1.5cm;
  }

  .recipe-page {
    &__container {
      font-family: Arial, Helvetica, sans-serif;
      color: #000;
      background: #fff;
      box-shadow: none;
    }

    &__top-content {
      display: flex;
      flex-direction: column;
      gap: 20px !important;
      margin-bottom: 30px;
    }

    &__image {
      max-width: 180px !important;
      margin: 0 auto;
    }

    &__info {
      width: 100%;
      text-align: center;
    }

    &__title {
      font-size: 20px !important;
      font-weight: bold;
      text-align: center;
    }

    &__description {
      font-size: 14px !important;
      margin: 0;
    }

    &__author {
      font-size: 14px !important;
      font-style: italic;
    }

    &__ingredients {
      margin-bottom: 30px;
      page-break-inside: avoid;

      h2 {
        font-size: 16px !important;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          padding: 8px !important;
          border: 1px dashed #e0e0e0;
          box-shadow: none !important;
          font-size: 14px !important;
        }
      }
    }

    &__steps {
      page-break-inside: avoid;
      max-width: 500px;
      margin: 0 auto;

      h2 {
        font-size: 16px !important;
        font-weight: bold;
        margin-bottom: 15px;
        padding-bottom: 5px;
        text-align: left;
      }

      &__list {
        box-shadow: none !important;
        border: 1px dashed #e0e0e0;
      }

      &__content {
        font-size: 14px;
        line-height: 1.7;

        p {
          margin-bottom: 12px;
        }

        ul,
        ol {
          margin-bottom: 15px;
          padding-left: 20px;

          li {
            margin-bottom: 8px;
          }
        }
      }
    }
  }

  h1,
  h2,
  h3 {
    page-break-after: avoid;
  }

  img {
    page-break-inside: avoid;
  }

  .reviews {
    display: none !important;
  }
}
</style>
