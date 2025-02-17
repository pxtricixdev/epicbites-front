<template>
  <canvas ref="myCanvas" class="logo-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const myCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = myCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Tamaño del canvas
  const displayWidth = 170
  const displayHeight = 50

  // Escalar contenido para evitar pixelado
  const scaleFactor = 4
  const canvasWidth = displayWidth * scaleFactor
  const canvasHeight = displayHeight * scaleFactor
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.scale(scaleFactor, scaleFactor)

  // Fondo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Ojos
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(28, 15, 4, Math.PI, 2 * Math.PI, false)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(45, 15, 4, Math.PI, 2 * Math.PI, false)
  ctx.stroke()

  // Texto
  ctx.font = "24px 'Lilita One'"
  ctx.fillStyle = 'black'
  ctx.fillText('epic bites', 60, 30)

  // Imagen del tenedor
  const img = new Image()
  img.src = '/img/fork.png'
  img.onload = () => {
    ctx.drawImage(img, 19, 22, 35, 10)
  }
})
</script>

<style scoped>
.logo-canvas {
  width: 170px;
  height: 50px;
  display: block;
}
</style>
