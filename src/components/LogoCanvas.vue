<template>
  <canvas
    ref="myCanvas"
    class="logo-canvas"
    @mouseenter="startAnimation"
    @mouseleave="stopAnimation"
  ></canvas>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const myCanvas = ref<HTMLCanvasElement | null>(null)
let isBlinking = false
let globalOpacity = 0
let eyeScale = 1
let zoomFactor = 1

onMounted(() => {
  const canvas = myCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Tamaño del canvas
  const displayWidth = 160
  const displayHeight = 50

  // Escalar contenido para evitar pixelado
  const scaleFactor = 4
  const canvasWidth = displayWidth * scaleFactor
  const canvasHeight = displayHeight * scaleFactor
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.scale(scaleFactor, scaleFactor)

  const img = new Image()
  img.src = '/images/fork.png'

  function animate() {
    ctx.clearRect(0, 0, canvas.width / scaleFactor, canvas.height / scaleFactor)

    if (globalOpacity < 1) {
      globalOpacity += 0.04
    }
    ctx.globalAlpha = globalOpacity

    if (isBlinking) {
      zoomFactor += (1.05 - zoomFactor) * 0.1
      eyeScale = 1 + 0.1 * Math.sin(Date.now() * 0.005)
    } else {
      zoomFactor += (1 - zoomFactor) * 0.1
      eyeScale = 1
    }

    // Zoom
    ctx.save()
    ctx.translate(displayWidth / 2, displayHeight / 2)
    ctx.scale(zoomFactor, zoomFactor)
    ctx.translate(-displayWidth / 2, -displayHeight / 2)

    // Ojos
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.ellipse(28, 15, 4, 4 * eyeScale, 0, Math.PI, 2 * Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.ellipse(45, 15, 4, 4 * eyeScale, 0, Math.PI, 2 * Math.PI)
    ctx.stroke()

    // Texto
    ctx.font = "24px 'Lilita One'"
    ctx.fillStyle = 'black'
    ctx.fillText('epic bites', 60, 30)

    // Imagen
    ctx.drawImage(img, 19, 22, 35, 10)

    ctx.restore()

    ctx.globalAlpha = 1
    requestAnimationFrame(animate)
  }

  img.onload = () => {
    animate()
  }
})

const startAnimation = () => {
  isBlinking = true
}

const stopAnimation = () => {
  isBlinking = false
}
</script>

<style scoped>
.logo-canvas {
  width: 160px;
  height: 50px;
  display: block;
  cursor: pointer;
}
</style>
