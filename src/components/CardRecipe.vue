<template>
  <Card>
    <template #header>
        <img {{img}}/>
    </template>
    <template #title>
        <p>
            {{score}}
        </p>
    </template>
    <template #subtitle>
      <p>
            {{user}}
      </p>
    </template>
    <template #content>
        <p >
            {{ title }}
        </p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card'

defineProps<{
  score: string,
  title: string,
  user: string,
  img: string
}>()
</script>

<style lang="scss" scoped>
</style>
