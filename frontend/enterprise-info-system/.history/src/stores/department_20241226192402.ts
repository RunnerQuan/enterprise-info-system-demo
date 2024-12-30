import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Department } from '@/types'
import { api } from '@/api'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadDepartments = async () => {
    try {
      isLoading.value = true
      const { data } = await api.get<Department[]>('/api/departments')
      departments.value = data
      console.log('Loaded departments:', data)
    } catch (err) {
      console.error('Failed to load departments:', err)
      error.value = '加载部门数据失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    departments,
    isLoading,
    error,
    loadDepartments
  }
})