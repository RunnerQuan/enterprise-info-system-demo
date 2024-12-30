import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Department } from '@/types'
import { api } from '@/api'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadDepartments = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/departments')
      departments.value = response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addDepartment = async (departmentData: Omit<Department, 'deptNo'>) => {
    try {
      const response = await api.post('/departments', departmentData)
      departments.value.push(response.data)
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateDepartment = async (department: Department) => {
    try {
      const response = await api.put(`/departments/${department.deptNo}`, department)
      const index = departments.value.findIndex(d => d.deptNo === department.deptNo)
      if (index !== -1) {
        departments.value[index] = response.data
      }
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteDepartment = async (deptNo: number) => {
    try {
      await api.delete(`/departments/${deptNo}`)
      departments.value = departments.value.filter(d => d.deptNo !== deptNo)
    } catch (err) {
      throw err
    }
  }

  return {
    departments,
    isLoading,
    error,
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  }
})