import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authStore } from '@/stores/authStore'

type RecipeData = {
  id: number
  name: string
  description: string
  meal: string
  diet: string
  flavour: string
  time: number
  calories: number
  difficulty: string
  image: string
  score: number
  ingredients: any[]
}

type MenuDetail = {
  day: string
  meal: string
  recipe: RecipeData
}

type MenusByWeek = {
  id: number
  userId: number
  name: string
  startingDate: Date
  createdAt: Date
  menuDetails: MenuDetail[]
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

type MenusByUser = Record<string, MenusByWeek>

export const useMenuStore = defineStore('menu', () => {
  const menusByWeek = ref<MenusByUser>({})
  const postMenuByUser = ref<PostMenu>()

  const loadingMenu = ref<boolean>(false)
  const loadingPostMenu = ref<boolean>(false)

  const error = ref<string | null>(null)
  const auth = authStore()
  const userId = auth.userId

  const fetchMenu = async (startingDate: string) => {
    loadingMenu.value = true
    error.value = null

    try {
      const response = await fetch(
        `https://epicbitesapi.retocsv.es/api/weekly-menu/user/${userId}/week?startingDate=${startingDate}`,
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

      menusByWeek.value[startingDate] = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingMenu.value = false
    }
  }

  const postMenu = async (weeklyMenu: WeeklyMenu, startingDate: string) => {
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
      const response = await fetch('https://epicbitesapi.retocsv.es/api/weekly-menu/', {
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
      throw err
    } finally {
      loadingPostMenu.value = false
    }
  }

  const putMenu = async (weeklyMenu: WeeklyMenu, startingDate: string, menuId: number) => {
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
      id: menuId,
      userId,
      name: 'Menú semanal',
      startingDate,
      menuDetails,
    }

    try {
      const response = await fetch(`https://epicbitesapi.retocsv.es/api/weekly-menu/${menuId}`, {
        method: 'PUT',
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
      throw err
    } finally {
      loadingPostMenu.value = false
    }
  }

  const deleteMenu = async (menuId: number) => {
    loadingPostMenu.value = true
    error.value = null

    try {
      const response = await fetch(`https://epicbitesapi.retocsv.es/api/weekly-menu/${menuId}`, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }

      for (const startDate in menusByWeek.value) {
        if (menusByWeek.value[startDate].id === menuId) {
          delete menusByWeek.value[startDate]
          break
        }
      }

      return true
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingPostMenu.value = false
    }
  }

  return {
    menusByWeek,
    postMenuByUser,
    loadingMenu,
    loadingPostMenu,
    error,

    fetchMenu,
    postMenu,
    putMenu,
    deleteMenu,
  }
})
