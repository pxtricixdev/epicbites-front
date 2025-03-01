import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ILogin } from '@/stores/interfaces/ILogin'

export const useAuthStore = defineStore('auth', () => {
  const dataLogin = ref<ILogin>({ email: '', password: '' })
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  const login = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/auth/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataLogin.value),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      const responseData = await response.text()

      if (responseData) {
        token.value = responseData
        localStorage.setItem('authToken', responseData)
      } else {
        throw new Error('No se recibió un token válido')
      }
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('authToken')
  }

  return { dataLogin, isAuthenticated, token, loading, error, login, logout }
})
