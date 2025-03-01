import { ref } from 'vue'
import type { IRegister } from '@/stores/interfaces/IRegister'

export function usePostUserRegister() {
  const dataRegister = ref<IRegister>({ username: '', email: '', password: '' })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/auth/registro-user', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataRegister.value),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }

      dataRegister.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return { dataRegister, loading, error, register }
}
