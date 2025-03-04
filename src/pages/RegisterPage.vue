<template>
  <div class="register">
    <div class="register__welcome">
      <p class="register__welcome__title">¡Bienvenido/a!</p>
      <p class="register__welcome__subtitle">
        Únete a nuestra comunidad culinaria completando el siguiente formulario
      </p>
    </div>

    <Form :validation-schema="validationSchema" @submit="handleRegister" class="register__form">
      <div class="register__content">
        <div class="register__inputs">
          <FloatLabel class="register__card">
            <Field name="username" v-slot="{ field }">
              <InputText
                v-bind="field"
                class="register__card__inputext"
                id="username"
                v-model="registerForm.username"
              />
            </Field>
            <label class="register__card__label" for="username">Nombre de usuario</label>
          </FloatLabel>
          <ErrorMessage name="username" class="register__card__error" />

          <FloatLabel class="register__card">
            <Field v-slot="{ field }" name="email">
              <InputText
                v-bind="field"
                class="register__card__inputext"
                id="email"
                v-model="registerForm.email"
              />
            </Field>
            <label class="register__card__label" for="email">Email</label>
          </FloatLabel>
          <ErrorMessage name="email" class="register__card__error" />

          <FloatLabel class="register__card">
            <Field v-slot="{ field }" name="password">
              <InputText
                v-bind="field"
                class="register__card__inputext"
                id="password"
                type="password"
                v-model="registerForm.password"
              />
            </Field>
            <label class="register__card__label" for="password">Contraseña</label>
          </FloatLabel>
          <ErrorMessage name="password" class="register__card__error" />
        </div>
        <button class="register__button" type="submit">Enviar</button>
      </div>
    </Form>
  </div>
</template>

<script lang="ts" setup>
import { Form, Field, ErrorMessage } from 'vee-validate'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import { authStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const router = useRouter()

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
    email: z.string().email('El email no es válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),
)
const auth = authStore()
const { register, clearRegisterData } = auth

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
})

const handleRegister = async () => {
  await register(registerForm)
  router.push('/login')
  clearRegisterData()
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.register {
  font-family: $body;
  margin-top: 30px;

  &__welcome {
    color: $black;
    max-width: 280px;
    margin: 10px auto;
    text-align: center;

    &__title {
      font-weight: 600;
      font-size: 18px;
      width: 90%;
      margin: 0 auto;
    }

    &__subtitle {
      font-size: 12px;
      width: 90%;
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
    margin: 10px auto 100px auto;
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

    &__error {
      color: red;
      font-size: 12px;
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
