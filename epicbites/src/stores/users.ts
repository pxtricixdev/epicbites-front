import { defineStore } from 'pinia'
import { ref } from 'vue'
import UserDto from './dtos/user.dto'

export const useUsersStore = defineStore('users', () => {
  const users = ref(new Array<UserDto>())

  function findAll() {
    const data = [
      { id: 0, name: 'test', surname: 'test2' },
      { id: 0, name: 'test', surname: 'test3' },
      { id: 0, name: 'test', surname: 'test4' },
      { id: 0, name: 'test', surname: 'test5' },
    ]
    users.value.splice(0, users.value.length, ...data)
  }

  function createUser() {}
  function deleteUser() {}
  function updateUser() {}

  return { users, findAll, createUser, deleteUser, updateUser }
})
