<template>
  <canvas ref="myCanvas" width="150" height="70"></canvas>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const myCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  const canvas = myCanvas.value
  const ctx = canvas.getContext('2d')

  function dibujaLogo(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Ojos
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.arc(125, 80, 10, Math.PI, 2 * Math.PI, false)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(180, 80, 10, Math.PI, 2 * Math.PI, false)
    ctx.stroke()

    // Texto
    ctx.font = "bold 24px 'Lilita One'"
    ctx.fillStyle = 'black'
    ctx.fillText('epic bites', 225, 110)

    // Cargar y dibujar imagen del tenedor
    const img = new Image()
    img.src = '/img/fork.png'
    img.onload = () => {
      ctx.drawImage(img, 100, 100, 100, 50) // Ajustar tamaño y posición
    }
  }

  dibujaLogo(ctx)
})
</script>

<style lang="scss" scoped></style>
