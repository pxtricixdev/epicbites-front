import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'

export const useMenuStore = defineStore('menu', () => {
  const menuByUser = ref()
  const postMenuByUser = ref()

  const loadingMenu = ref(false)
  const loadingPostMenu = ref(false)

  const error = ref<string | null>(null)
  const auth = authStore()
  const userId = auth.userId

  function getMondayDate(date = new Date()) {
    const day = date.getDay()
    const diff = day === 0 ? -6 : 1 - day
    const monday = new Date(date)
    monday.setDate(date.getDate() + diff)
    monday.setHours(0, 0, 0, 0)
    return monday.toISOString().split('T')[0]
  }

  const startingDate = getMondayDate()

  const fetchMenu = async () => {
    loadingMenu.value = true
    error.value = null

    try {
      const response = await fetch(
        `https://localhost:7129/api/weekly-menu/user/${userId}/week?startingDate=${startingDate}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      menuByUser.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingMenu.value = false
    }
  }

  return {
    menuByUser,
    postMenuByUser,
    loadingMenu,
    loadingPostMenu,

    fetchMenu,
  }
})
