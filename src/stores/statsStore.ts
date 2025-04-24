import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRecipeStore } from './recipeStore'
import { useReviewStore } from './reviewStore'

export const useStatsStore = defineStore('stats', () => {
  const recipeStore = useRecipeStore()
  const reviewStore = useReviewStore()

  const loading = ref(false)
  const error = ref<string | null>(null)
  const statsReady = ref(false)

  //generar estadísticas
  const generateStats = async () => {
    loading.value = true
    error.value = null

    try {
      const promises = []
      
      if (recipeStore.allRecipes.length === 0) {
        promises.push(recipeStore.fetchAllRecipes())
      }

      if (reviewStore.allReviews.length === 0) {
        promises.push(reviewStore.fetchAllReviews())
      }
      
      await Promise.all(promises)
      statsReady.value = true
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const currentTotals = computed(() => ({
    recipes: recipeStore.allRecipes.length,
    reviews: reviewStore.allReviews.length
  }))

  // Estadísticas de dificultad
  const difficultyStats = computed(() => {
    const result = { easy: 0, medium: 0, hard: 0 }

    if (!statsReady.value || recipeStore.allRecipes.length === 0) return result
    
    recipeStore.allRecipes.forEach(recipe => {
      const difficulty = recipe.difficulty?.toLowerCase() || ''
      
      if (difficulty === 'fácil' || difficulty === 'facil' || difficulty === 'easy') {
        result.easy++
      } else if (difficulty === 'media' || difficulty === 'medium') {
        result.medium++
      } else if (difficulty === 'difícil' || difficulty === 'dificil' || difficulty === 'hard') {
        result.hard++
      }
    })

    return result
  })

  // Estadísticas de valoraciones
  const ratingStats = computed(() => {
    const result = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    if (!statsReady.value || reviewStore.allReviews.length === 0) return result

    reviewStore.allReviews.forEach(review => {
      const score = review.score
      if (score >= 1 && score <= 5) {
        result[score as keyof typeof result]++
      }
    })

    return result
  })

  return {
    loading,
    error,
    statsReady,
    currentTotals,
    difficultyStats,
    ratingStats,
    generateStats
  }
})