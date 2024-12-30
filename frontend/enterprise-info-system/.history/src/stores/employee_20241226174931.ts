import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '@/types'
import { http } from '@/utils/http'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])

  const loadEmployees = async () => {
    const { data } = await http.get<Employee[]>('/employees')
    employees.value = data
  }

  // ... 其他方法
}) 