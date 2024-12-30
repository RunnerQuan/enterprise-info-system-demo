import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Department } from '@/types'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadDepartments = async () => {
    try {
      isLoading.value = true
      const { data } = await api.get<Department[]>('/departments')
      departments.value = data
    } catch (err) {
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