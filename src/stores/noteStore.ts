import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { IRecipeNote } from './interfaces/IRecipeNote'
import type { IPostRecipeNote } from './interfaces/IPostRecipeNote'

export const useRecipeNoteStore = defineStore('recipeNotes', () => {
  const allNotes = ref<IRecipeNote[]>([])
  const notesByUser = ref<IRecipeNote[]>([])
  const currentUserId = ref<number | null>(null)
  const loadingAllNotes = ref(false)
  const loadingNotesByUser = ref(false)
  const loadingDelete = ref(false)
  const loadingCreate = ref(false)
  const error = ref<string | null>(null)

  const clearNotesByUser = () => {
    notesByUser.value = []
    currentUserId.value = null
  }

  const fetchAllNotes = async () => {
    loadingAllNotes.value = true
    error.value = null
    try {
      const response = await fetch('https://epicbitesapi.retocsv.es/api/recipe-notes', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      allNotes.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingAllNotes.value = false
    }
  }

  const fetchNotesByUser = async (userId: number) => {
    if (userId === currentUserId.value && notesByUser.value.length > 0) {
      return
    }
    notesByUser.value = []
    currentUserId.value = userId
    loadingNotesByUser.value = true
    error.value = null
    try {
      const response = await fetch(`https://epicbitesapi.retocsv.es/api/recipe-notes/user/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      notesByUser.value = await response.json()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loadingNotesByUser.value = false
    }
  }

  const deleteNote = async (id: number) => {
    loadingDelete.value = true
    error.value = null
    try {
      const response = await fetch(`https://epicbitesapi.retocsv.es/api/recipe-notes/${id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`Error ${response.status}`)
      }
      allNotes.value = allNotes.value.filter((note) => note.id !== id)
      notesByUser.value = notesByUser.value.filter((note) => note.id !== id)
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingDelete.value = false
    }
  }

  const createNote = async (noteData: IPostRecipeNote) => {
    loadingCreate.value = true
    error.value = null
    try {
      const requestBody = {
        recipeId: noteData.recipeId,
        noteText: noteData.noteText,
        userId: noteData.userId
      }
      const response = await fetch('https://epicbitesapi.retocsv.es/api/recipe-notes', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}`)
      }
      const newNote = await response.json()
      if (allNotes.value.length > 0) {
        fetchAllNotes() 
      }
      if (currentUserId.value === noteData.userId) {
        await fetchNotesByUser(noteData.userId)
      }
      return newNote
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      loadingCreate.value = false
    }
  }

  const hasNotesForUser = (userId: number): boolean => {
    return currentUserId.value === userId && notesByUser.value.length > 0
  }

  return {
    allNotes,
    notesByUser,
    currentUserId,
    loadingAllNotes,
    loadingNotesByUser,
    loadingDelete,
    loadingCreate,
    error,
    fetchAllNotes,
    fetchNotesByUser,
    deleteNote,
    createNote,
    clearNotesByUser,
    hasNotesForUser
  }
})