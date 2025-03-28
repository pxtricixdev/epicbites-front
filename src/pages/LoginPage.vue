<template>
  <div v-if="isAuthenticated">
    {{ router.push('/') }}
  </div>
  <div v-else class="login">
    <div class="login__welcome">
      <p class="login__welcome__title">¡Es hora de cocinar algo increíble!</p>
      <p class="login__welcome__subtitle">
        Accede a tu cuenta y encuentra la inspiración culinaria perfecta.
      </p>
    </div>
    <Form :validation-schema="validationSchema" @submit="handleLogin" class="login__form">
      <div class="login__content">
        <div class="login__inputs">
          <FloatLabel class="login__card">
            <Field name="email" v-slot="{ field }">
              <InputText
                v-bind="field"
                class="login__card__inputext"
                id="email"
                v-model="dataLogin.email"
              />
            </Field>
            <label class="login__card__label" for="email">Email</label>
          </FloatLabel>
          <ErrorMessage name="email" class="login__card__error" />

          <FloatLabel class="login__card">
            <Field name="password" v-slot="{ field }">
              <InputText
                v-bind="field"
                type="password"
                class="login__card__inputext"
                id="password"
                v-model="dataLogin.password"
              />
            </Field>
            <label class="login__card__label" for="password">Contraseña</label>
          </FloatLabel>
          <ErrorMessage name="password" class="login__card__error" />
        </div>

        <p class="login__register">
          ¿Aún no tienes cuenta? <RouterLink to="/registro">Regístrate</RouterLink>
        </p>
        <button class="login__button">Enviar</button>
      </div>
    </Form>
    <div class="login__error" v-if="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import { authStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const validationSchema = toTypedSchema(
  z.object({
    email: z.string().email('El email no es válido'),
    password: z.string(),
  }),
)

const auth = authStore()
const { dataLogin, token, error, isAuthenticated } = storeToRefs(auth)
const { login } = auth

const router = useRouter()

const handleLogin = async () => {
  await login()

  if (token.value) {
    router.push('/recetas')
  } else {
    console.error('No se recibió un token válido')
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.login {
  font-family: $body;

  &__welcome {
    color: $black;
    max-width: 280px;
    margin: 10px auto;
    text-align: center;
    margin-top: 30px;

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
    margin: 20px auto 30px auto;
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
    gap: 20px;
  }

  &__card {
    &__inputext {
      background-color: $white !important;
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

    &__error {
      font-size: 12px;
      color: red;
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

  &__error {
    text-align: center;
    color: red;
    font-size: 11px;
  }
}
</style>
