import { ref, onMounted, nextTick, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStatsStore } from '@/stores/statsStore'

Chart.register(...registerables)

export default function useCharts(activeSection: Ref<string>) {
  const difficultyChartRef = ref<HTMLCanvasElement | null>(null)
  const ratingsChartRef = ref<HTMLCanvasElement | null>(null)
  const recipeTypesChartRef = ref<HTMLCanvasElement | null>(null) 
  const monthlyReviewsChartRef = ref<HTMLCanvasElement | null>(null) 
  
  const noDifficultyDataMessage = ref(false) 
  const noRatingDataMessage = ref(false)
  const noRecipeTypesDataMessage = ref(false) 
  const noMonthlyReviewsDataMessage = ref(false) 
  
  const statsStore = useStatsStore()
  
  let difficultyChart: Chart | null = null
  let ratingsChart: Chart | null = null
  let recipeTypesChart: Chart | null = null 
  let monthlyReviewsChart: Chart | null = null 

  //verificar si hay datos
  const hasDifficultyData = computed(() => {
    if (!statsStore.statsReady) return false
    const { easy, medium, hard } = statsStore.difficultyStats
    return easy > 0 || medium > 0 || hard > 0
  })
  
  const hasRatingData = computed(() => {
    if (!statsStore.statsReady) return false
    return Object.values(statsStore.ratingStats).some(count => count > 0)
  })

  const hasRecipeTypesData = computed(() => {
    if (!statsStore.statsReady) return false
    return Object.values(statsStore.recipeTypeStats).some(count => count > 0)
  })

  const hasMonthlyReviewsData = computed(() => {
    if (!statsStore.statsReady) return false
    return statsStore.reviewsByMonth.some(item => item.count > 0)
  })

  // gráfico de dificultad
  const initializeDifficultyChart = () => {
    if (!difficultyChartRef.value) return
    
    if (!hasDifficultyData.value) {
      if (difficultyChart) difficultyChart.destroy()
      noDifficultyDataMessage.value = true
      return
    }
    
    noDifficultyDataMessage.value = false
    if (difficultyChart) difficultyChart.destroy()
    
    const data = [
      statsStore.difficultyStats.easy,
      statsStore.difficultyStats.medium,
      statsStore.difficultyStats.hard
    ]
    
    difficultyChart = new Chart(difficultyChartRef.value, {
      type: 'pie',
      data: {
        labels: ['Fácil', 'Media', 'Difícil'],
        datasets: [{
          data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(255, 206, 86)',
            'rgb(255, 99, 132)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    })
  }

  // gráfico de valoraciones
  const initializeRatingsChart = () => {
    if (!ratingsChartRef.value) return
    
    if (!hasRatingData.value) {
      if (ratingsChart) ratingsChart.destroy()
      noRatingDataMessage.value = true
      return
    }
    
    noRatingDataMessage.value = false
    if (ratingsChart) ratingsChart.destroy()
    
    const data = [
      statsStore.ratingStats[1],
      statsStore.ratingStats[2],
      statsStore.ratingStats[3],
      statsStore.ratingStats[4],
      statsStore.ratingStats[5]
    ]
    
    ratingsChart = new Chart(ratingsChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
        datasets: [{
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(255, 159, 64, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(54, 162, 235, 0.7)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    })
  }

  // tipos de recetas
  const initializeRecipeTypesChart = () => {
    if (!recipeTypesChartRef.value) return
    
    if (!hasRecipeTypesData.value) {
      if (recipeTypesChart) recipeTypesChart.destroy()
      noRecipeTypesDataMessage.value = true
      return
    }
    
    noRecipeTypesDataMessage.value = false
    if (recipeTypesChart) recipeTypesChart.destroy()
    
    const typeStats = statsStore.recipeTypeStats
    const data = [
      typeStats.Vegetariana,
      typeStats.SinGluten,
      typeStats.Vegana,
      typeStats.SinLactosa,
      typeStats.Proteina,
      typeStats.Omnivoro,
      typeStats.Mediterranea
    ]
    
    recipeTypesChart = new Chart(recipeTypesChartRef.value, {
      type: 'pie',
      data: {
        labels: ['Vegetariana', 'Sin Gluten', 'Vegana', 'Sin Lactosa', 'Proteína', 'Omnívoro', 'Mediterránea'],
        datasets: [{
          data,
          backgroundColor: [
            'rgba(155, 89, 182, 0.7)',   // Morado para vegetariana
            'rgba(231, 76, 60, 0.7)',    // Rojo para Sin Gluten
            'rgba(46, 204, 113, 0.7)',   // Verde para vegana
            'rgba(52, 152, 219, 0.7)',   // Azul para Sin Lactosa 
            'rgba(241, 196, 15, 0.7)',   // Amarillo para Proteina
            'rgb(241, 245, 0)',   // Verde oscuro para Omnivoro 
            'rgba(241, 67, 212, 0.79)'   // Rosa para Mediterranea 
          ],
          borderColor: [
            'rgb(155, 89, 182)',
            'rgb(231, 76, 60)',
            'rgb(46, 204, 113)',
            'rgb(52, 152, 219)',
            'rgb(241, 196, 15)',
            'rgb(241, 245, 0)',
            'rgba(241, 67, 212, 0.79)'
          ],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? Math.round((Number(value) / Number(total)) * 100) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    })
  }

  // reseñas mensuales
  const initializeMonthlyReviewsChart = () => {
    if (!monthlyReviewsChartRef.value) return
    
    if (!hasMonthlyReviewsData.value) {
      if (monthlyReviewsChart) monthlyReviewsChart.destroy()
      noMonthlyReviewsDataMessage.value = true
      return
    }
    
    noMonthlyReviewsDataMessage.value = false
    if (monthlyReviewsChart) monthlyReviewsChart.destroy()
    
    const monthlyData = statsStore.reviewsByMonth
    
    monthlyReviewsChart = new Chart(monthlyReviewsChartRef.value, {
      type: 'bar',
      data: {
        labels: monthlyData.map(item => item.month),
        datasets: [{
          label: 'Reseñas por mes',
          data: monthlyData.map(item => item.count),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `Reseñas: ${context.raw}`;
              }
            }
          }
        }
      }
    })
  }
  
  // Inicializar los gráficos
  const initializeCharts = async () => {
    if (activeSection.value !== 'stats') return
    
    noDifficultyDataMessage.value = false
    noRatingDataMessage.value = false
    noRecipeTypesDataMessage.value = false
    noMonthlyReviewsDataMessage.value = false 
    
    if (!statsStore.statsReady) {
      await statsStore.generateStats()
    }
    
    await nextTick()
    initializeDifficultyChart()
    initializeRatingsChart()
    initializeRecipeTypesChart() 
    initializeMonthlyReviewsChart()
  }

  const setupWatchers = () => {
    watch(activeSection, (newSection) => {
      if (newSection === 'stats') {
        nextTick(() => initializeCharts())
      }
    })
  }

  onMounted(() => {
    if (activeSection.value === 'stats') {
      initializeCharts()
    }
  })

  return {
    difficultyChartRef,
    ratingsChartRef,
    recipeTypesChartRef,      
    monthlyReviewsChartRef,    
    noDifficultyDataMessage,
    noRatingDataMessage,
    noRecipeTypesDataMessage,  
    noMonthlyReviewsDataMessage, 
    initializeCharts,
    setupWatchers,
    isLoading: computed(() => statsStore.loading),
    error: computed(() => statsStore.error)
  }
}