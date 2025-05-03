import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'

type MenuByUser = {
  id: number
  userId: number
  name: string
  startingDate: Date
  createdAt: Date
  menuDetails: { id: number; day: string; meal: string; weeklyMenuId: number; recipeId: number }[]
}

type PostMenu = {
  userId: number
  name: string
  startingDate: Date
  menuDetails: { day: string; meal: string; recipeId: number }[]
}

type WeeklyMenu = {
  [day: string]: {
    [meal: string]: {
      id: number
      title: string
    }
  }
}

export const useMenuStore = defineStore('menu', () => {
  const menuByUser = ref<MenuByUser>()
  const postMenuByUser = ref<PostMenu>()

  const loadingMenu = ref<boolean>(false)
  const loadingPostMenu = ref<boolean>(false)

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

  const postMenu = async (weeklyMenu: WeeklyMenu) => {
    loadingPostMenu.value = true
    error.value = null

    const menuDetails = []

    for (const day in weeklyMenu) {
      for (const meal in weeklyMenu[day]) {
        const recipe = weeklyMenu[day][meal]
        menuDetails.push({
          day: day.charAt(0).toUpperCase() + day.slice(1),
          meal: meal.charAt(0).toUpperCase() + meal.slice(1),
          recipeId: recipe.id,
        })
      }
    }

    const payload = {
      userId,
      name: 'Menú semanal',
      startingDate,
      menuDetails,
    }

    try {
      const response = await fetch('https://localhost:7129/api/weekly-menu/', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      postMenuByUser.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingPostMenu.value = false
    }
  }

  return {
    menuByUser,
    postMenuByUser,
    loadingMenu,
    loadingPostMenu,
    error,

    fetchMenu,
    postMenu,
  }
})
