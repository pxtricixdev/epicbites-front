import { ref } from "vue"
import type { IGetAllUsers } from "./interfaces/IGetAllUsers"

export function useGetAllUsers() {
  const dataUsers = ref<IGetAllUsers[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchUsers = async () => {
    loading.value = true
    error.value = null;

    try {
      const response = await fetch('https://localhost:7129/api/users', {
        method: 'GET',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json'
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      dataUsers.value = await response.json();

    } catch (err: any) {
      error.value = err.message;

    } finally {
      loading.value = false
    }
  };
  return { dataUsers, loading, error, fetchUsers }
}
