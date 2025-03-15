import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'
import type { IGetAllUsers } from './interfaces/IGetAllUsers'
import type { IPutUser } from './interfaces/IPutUser'

export const useUserStore = defineStore('users', () => {
  const allUsers = ref<IGetAllUsers[]>([])
  const putUser = ref<IPutUser[]>([])

  const loadingAllUsers = ref(false)
  const loadingPatchUser = ref(false)

  const auth = authStore()

  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loadingAllUsers.value = true
    error.value = null

    try {
      const response = await fetch('https://localhost:7129/api/users', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      allUsers.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingAllUsers.value = false
    }
  }

  const updateUser = async (userData: Partial<IPutUser>, userId?: number) => {
    if (!auth.isAuthenticated) {
      error.value = 'Usuario no autenticado'
      return
    }

    // si no se proporciona un ID específico, usar el del usuario autenticado
    const targetUserId = userId || auth.userId
    loadingPatchUser.value = true
    error.value = null

    try {
      // crear un array para el Patch
      const patchOperations = Object.entries(userData).map(([key, value]) => ({
        op: "replace",
        path: `/${key}`,
        value: value
      }))

      // ver que haya operaciones hay algoo que actualizar
      if (patchOperations.length === 0) {
        throw new Error('No hay campos para actualizar')
      }

      const response = await fetch(`https://localhost:7129/api/users/${targetUserId}`, {
        method: 'PATCH',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(patchOperations),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(errorData || `Error ${response.status}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const contentLength = response.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > 0) {
          return await response.json()
        }
      }

      return {}
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingPatchUser.value = false
    }
  }

  return {
    allUsers,
    putUser,

    fetchUsers,
    updateUser,
  }
})
