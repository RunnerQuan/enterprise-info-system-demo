import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee, EmployeeRequest } from '@/types'
import { api } from '@/api'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployees = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/employees')
      employees.value = response.data
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addEmployee = async (employeeData: Omit<Employee, 'empNo'>) => {
    try {
      const response = await api.post('/employees', employeeData)
      employees.value.push(response.data)
      return response.data
    } catch (err) {
      throw err
    }
  }

  const updateEmployee = async (employee: Employee) => {
    try {
      const response = await api.put(`/employees/${employee.empNo}`, employee)
      const index = employees.value.findIndex(e => e.empNo === employee.empNo)
      if (index !== -1) {
        employees.value[index] = response.data
      }
      return response.data
    } catch (err) {
      throw err
    }
  }

  const deleteEmployee = async (empNo: number) => {
    try {
      await api.delete(`/employees/${empNo}`)
      employees.value = employees.value.filter(e => e.empNo !== empNo)
    } catch (err) {
      throw err
    }
  }

  return {
    employees,
    isLoading,
    error,
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }
}) 