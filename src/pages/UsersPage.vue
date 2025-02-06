<template>
  <h2>Contenido principal de Users</h2>
  <div v-for="user in store.users">{{ user.name }} - {{ user.surname }}</div>
  <button @click="insertUser">Insertar usuario</button>
</template>

<script lang="ts" setup>
import { useUsersStore } from '@/stores/users'
const store = useUsersStore()
store.findAll()

function insertUser() {
  store.createUser({
    id: -1,
    name: 'sample',
    surname: 'sample',
  })
}
</script>
