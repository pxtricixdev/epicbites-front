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

  // tipos de recetas
  const recipeTypeStats = computed(() => {
    const result = {
      Vegetariana: 0,
      SinGluten: 0,
      Vegana: 0,
      SinLactosa: 0,
      Proteina: 0,
      Omnivoro: 0,
      Mediterranea: 0
    }

    if (!statsReady.value || recipeStore.allRecipes.length === 0) return result
    
    recipeStore.allRecipes.forEach(recipe => {
      // un string el enum
      const diet = recipe.diet;

      if (typeof diet === 'string') {
        const dietLower = diet.toLowerCase();
        
        if (dietLower.includes('vegetariana') || dietLower.includes('vegetarian')) {
          result.Vegetariana++;
        } else if (dietLower.includes('sin gluten') || dietLower.includes('gluten')) {
          result.SinGluten++;
        } else if (dietLower.includes('vegana') || dietLower.includes('vegan')) {
          result.Vegana++;
        } else if (dietLower.includes('sin lactosa') || dietLower.includes('lactosa')) {
          result.SinLactosa++;
        } else if (dietLower.includes('proteina') || dietLower.includes('protein')) {
          result.Proteina++;
        } else if (dietLower.includes('omnivoro') || dietLower.includes('omnivore')) {
          result.Omnivoro++;
        } else if (dietLower.includes('mediterranea') || dietLower.includes('mediterrana')) {
          result.Mediterranea++;
        }
      } 
    })

    return result
  })

  // review por mes
  const reviewsByMonth = computed(() => {
    const result = [
      { month: 'Enero', count: 0 },
      { month: 'Febrero', count: 0 },
      { month: 'Marzo', count: 0 },
      { month: 'Abril', count: 0 },
      { month: 'Mayo', count: 0 },
      { month: 'Junio', count: 0 },
      { month: 'Julio', count: 0 },
      { month: 'Agosto', count: 0 },
      { month: 'Septiembre', count: 0 },
      { month: 'Octubre', count: 0 },
      { month: 'Noviembre', count: 0 },
      { month: 'Diciembre', count: 0 }
    ]

    if (!statsReady.value || reviewStore.allReviews.length === 0) return result

    reviewStore.allReviews.forEach(review => {
      if (review.date) {
        try {
          const reviewDate = new Date(review.date)
          const month = reviewDate.getMonth() 
          if (month >= 0 && month < 12) {
            result[month].count++
          }
        } catch (e) {
          console.error('Error al parsear fecha de reseña:', e)
        }
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
    recipeTypeStats,
    reviewsByMonth,     
    generateStats
  }
})