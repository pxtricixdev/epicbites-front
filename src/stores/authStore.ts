import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ILogin } from '@/stores/interfaces/ILogin'
import type { IAuthResponse } from '@/stores/interfaces/IAuthResponse'
import type { IRegister } from './interfaces/IRegister'

export const authStore = defineStore('auth', () => {
  const dataLogin = ref<ILogin>({ email: '', password: '' })
  const token = ref<string | null>(localStorage.getItem('authToken'))
  const userRole = ref<string | null>(localStorage.getItem('userRole'))
  const userId = ref<number | null>(
    localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : null,
  )
  const username = ref<string | null>(localStorage.getItem('username'))

  const loading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = computed(() => !!token.value)

  const dataRegister = ref<IRegister>({ username: '', email: '', password: '' })
  const loadingRegister = ref(false)
  const errorRegister = ref<string | null>(null)

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

      const responseData: IAuthResponse = await response.json()

      if (responseData && responseData.token) {
        token.value = responseData.token
        userRole.value = responseData.role
        userId.value = responseData.userId
        username.value = responseData.username

        localStorage.setItem('authToken', responseData.token)
        localStorage.setItem('userRole', responseData.role)
        localStorage.setItem('userId', responseData.userId.toString())
        localStorage.setItem('username', responseData.username)
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
    localStorage.removeItem('authToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('username')
    token.value = null
    userId.value = null
    userRole.value = null
    username.value = null
  }

  const register = async (registerData: IRegister) => {
    loadingRegister.value = true
    errorRegister.value = null

    try {
      const response = await fetch('https://localhost:7129/api/auth/registro-user', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      const data = await response.json()

      return data
    } catch (err: any) {
      errorRegister.value = err.message
      throw err
    } finally {
      loadingRegister.value = false
    }
  }

  const registerAdmin = async (registerData: IRegister) => {
    loadingRegister.value = true
    errorRegister.value = null

    try {
      const response = await fetch('https://localhost:7129/api/auth/registro-admin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      const data = await response.json()

      return data
    } catch (err: any) {
      errorRegister.value = err.message
      throw err
    } finally {
      loadingRegister.value = false
    }
  }

  const clearRegisterData = () => {
    dataRegister.value = { username: '', email: '', password: '' }
    errorRegister.value = null
  }

  return {
    dataLogin,
    isAuthenticated,
    token,
    userRole,
    userId,
    username,
    loading,
    error,
    login,
    logout,
    register,
    clearRegisterData,
    registerAdmin,
  }
})
