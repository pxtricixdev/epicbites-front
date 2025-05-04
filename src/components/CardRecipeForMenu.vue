<template>
  <div class="container">
    <div class="container__image" :style="{ backgroundImage: `url(${src})` }"></div>
    <div class="container__info">
      <RouterLink :to="link" class="container__info__title">
        {{ title }}
      </RouterLink>

      <div class="container__info__tags">
        <p>{{ meal }}</p>
        <p>{{ time }}'</p>
        <p>{{ difficulty }}</p>
      </div>
      <button label="Show" @click="isVisible = true">
        <CirclePlus :size="14" />{{ buttonText }}
      </button>
    </div>

    <Dialog
      v-model:visible="isVisible"
      modal
      header="Añadir a día de la semana"
      :style="{ width: '500px' }"
    >
      <span>Selecciona el día y el tipo de comida</span>
      <div class="modal__days">
        <p>Día de la semana</p>
        <div class="modal__days__buttons">
          <button
            :class="{ clicked: selectedDay === day }"
            @click="selectedDay = day"
            v-for="day in daysOfWeek"
            :key="day"
          >
            {{ day }}
          </button>
        </div>
      </div>
      <div class="modal__meals">
        <p>Tipo de comida</p>
        <div class="modal__meals__buttons">
          <button
            :class="{ clicked: selectedMeal === meal }"
            @click="selectedMeal = meal"
            v-for="meal in meals"
            :key="meal"
          >
            {{ meal }}
          </button>
        </div>
      </div>
      <button @click="addRecipe" class="modal__button">Añadir al menú</button>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { CirclePlus } from 'lucide-vue-next'
import Dialog from 'primevue/dialog'
import { ref } from 'vue'
import { daysOfWeek } from '@/data/menuData'
import { meals } from '@/data/menuData'

const props = defineProps<{
  id: number
  title: string
  src: string
  buttonText: string
  difficulty: string
  time: number
  meal: string
  link: string
}>()

const isVisible = ref(false)

const emit = defineEmits<{
  (e: 'add', day: string, meal: string, title: string, id: number): void
}>()

const addRecipe = () => {
  if (selectedDay.value && selectedMeal.value) {
    emit('add', selectedDay.value, selectedMeal.value, props.title, props.id)
    isVisible.value = false
  }
}

const selectedDay = ref<string | null>(null)
const selectedMeal = ref<string | null>(null)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.container {
  width: 310px;
  height: 160px;
  border-radius: 5px;
  border: 1px solid $light-grey;
  background-color: white;
  display: flex;
  flex-direction: row;
  margin: 20px 0;
  position: relative;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  padding: 10px;
  gap: 10px;
  align-items: center;

  &__image {
    width: 100px;
    height: 100px;
    border-radius: 10px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &__info {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    max-width: 180px;
    height: 100%;

    &__title {
      @include semibold-text(14px);
      color: rgb(45, 45, 45);
    }

    &__tags {
      @include regular-text(12px);
      display: flex;
      flex-wrap: wrap;
      gap: 4px;

      p {
        padding: 2px 6px;
        background-color: #e5730930;
        border-radius: 2px;
      }
    }

    button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      width: 100px;
      gap: 4px;
      background-color: $secondary-orange;
      border-radius: 5px;
      border: 1px solid $secondary-orange;
      padding: 6px 10px;
      color: white;
      @include regular-text(14px);
      cursor: pointer;

      &:hover {
        opacity: 0.9;
        transition: ease-in 0.15s;
      }
    }
  }
}

.modal {
  &__days,
  &__meals {
    margin-top: 10px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;

    &__buttons {
      margin-top: 5px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;

      button {
        background-color: white;
        border-radius: 5px;
        border: 1px solid $light-grey;
        padding: 6px 10px;
        color: black;
        @include regular-text(14px);
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: $light-grey;
        }

        &.clicked {
          background-color: $light-grey;
        }
      }
    }
  }
  &__button {
    background-color: black;
    border-radius: 5px;
    border: none;
    padding: 10px 15px;
    color: white;
    @include regular-text(14px);
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
