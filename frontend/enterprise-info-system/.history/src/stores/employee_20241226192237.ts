import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '@/types'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployees = async () => {
    try {
      isLoading.value = true
      const { data } = await api.get<Employee[]>('/employees')
      employees.value = data
    } catch (err) {
      error.value = '加载员工数据失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    employees,
    isLoading,
    error,
    loadEmployees
  }
}) 