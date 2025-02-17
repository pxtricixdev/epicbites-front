<template>
  <div class="register">
    <div class="register__welcome">
      <p class="register__welcome__title">
        Por favor, rellena los datos para completar el registro
      </p>
    </div>
    <form @submit.prevent="handleRegister" class="register__form">
      <div class="register__content">
        <div class="register__inputs">
          <FloatLabel class="register__card">
            <InputText class="register__card__inputext" id="username" v-model="username" />
            <label class="register__card__label" for="username">Nombre de usuario</label>
          </FloatLabel>
          <FloatLabel class="register__card">
            <InputText class="register__card__inputext" id="email" v-model="email" />
            <label class="register__card__label" for="email">Email</label>
          </FloatLabel>
          <FloatLabel class="register__card">
            <InputText
              type="password"
              class="register__card__inputext"
              id="password"
              v-model="password"
            />
            <label class="register__card__label" for="password">Contraseña</label>
          </FloatLabel>
        </div>
        <p class="register__register">
          ¿Aún no tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink>
        </p>
        <button class="register__button">Enviar</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'

const username = ref('')
const email = ref('')
const password = ref('')

const handleRegister = () => {
  // POST /register
  console.log('Username', username.value)
  console.log('Email', email.value)
  console.log('Password', password.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.register {
  font-family: $body;

  &__welcome {
    color: $black;
    max-width: 280px;
    margin: 10px auto;
    text-align: center;

    &__title {
      font-weight: 600;
      font-size: 15px;
      width: 90%;
      margin: 0 auto;
    }

    &__subtitle {
      font-size: 11px;
      width: 80%;
      margin: 0 auto;
      padding-top: 5px;
    }
  }

  &__form {
    border: 1px solid $secondary-orange;
    border-radius: 10px;
    padding: 30px 20px 20px 20px;
    color: $black;
    max-width: 280px;
    box-shadow: -2px 3px 51px -18px rgba(0, 0, 0, 0.1);
    width: 90%;
    margin: 20px auto 100px auto;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__inputs {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  &__form {
    display: flex;
    flex-direction: column;
  }

  &__card {
    &__inputext {
      background-color: $white;
      font-size: 12px;
      font-weight: 400;
      color: $black;
      width: 100%;
      border: 1px solid rgb(153, 153, 153);
    }

    &__label {
      font-size: 12px;
      font-weight: 400;
    }
  }

  &__register {
    font-size: 10px;
    margin-top: 5px;

    a {
      color: $secondary-orange;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__button {
    background-color: $black;
    color: $white;
    border-radius: 5px;
    border: 0;
    padding: 5px 20px;
    width: 50%;
    margin: 0 auto;
    margin-top: 10px;
    font-size: 14px;
    text-transform: uppercase;
    font-family: 600;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
      transition: ease-in-out 0.2s;
    }
  }
}
</style>
