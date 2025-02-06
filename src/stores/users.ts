import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IUser } from './interfaces/IUser'

export const useUsersStore = defineStore('users', () => {
  const users = ref(new Array<IUser>())

  function findAll() {
    const data = [
      { name: 'test', surname: 'test2' },
      { name: 'test', surname: 'test3' },
      { name: 'test', surname: 'test4' },
      { name: 'test', surname: 'test5' },
    ]
    users.value.splice(0, users.value.length, ...data)
  }

  function createUser(user: IUser) {
    users.value.push(user)
  }
  function deleteUser() {}
  function updateUser() {}

  return { users, findAll, createUser, deleteUser, updateUser }
})
