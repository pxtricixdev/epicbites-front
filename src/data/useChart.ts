import { ref, onMounted, nextTick, watch, computed } from 'vue'
import type { Ref } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStatsStore } from '@/stores/statsStore'

Chart.register(...registerables)

export default function useCharts(activeSection: Ref<string>) {
  const difficultyChartRef = ref<HTMLCanvasElement | null>(null)
  const ratingsChartRef = ref<HTMLCanvasElement | null>(null)
  
  const noDifficultyDataMessage = ref(false) 
  const noRatingDataMessage = ref(false)
  
  const statsStore = useStatsStore()
  
  let difficultyChart: Chart | null = null
  let ratingsChart: Chart | null = null

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
  
  // inicializar los gráficos
  const initializeCharts = async () => {
    if (activeSection.value !== 'stats') return
    
    noDifficultyDataMessage.value = false
    noRatingDataMessage.value = false
    
    if (!statsStore.statsReady) {
      await statsStore.generateStats()
    }
    
    await nextTick()
    initializeDifficultyChart()
    initializeRatingsChart()
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
    noDifficultyDataMessage,
    noRatingDataMessage,
    initializeCharts,
    setupWatchers,
    isLoading: computed(() => statsStore.loading),
    error: computed(() => statsStore.error)
  }
}