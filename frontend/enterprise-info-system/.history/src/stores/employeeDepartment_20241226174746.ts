import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupedEmployeeDepartment, EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'
import { http } from '@/utils/http'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])

  const loadEmployeeDepartments = async () => {
    const response = await http.get<GroupedEmployeeDepartment[]>('/api/employee-departments')
    groupedEmployeeDepartments.value = response.data
  }

  const addEmployeeDepartment = async (data: EmployeeDepartmentRequest) => {
    await http.post('/api/employee-departments', data)
    await loadEmployeeDepartments()
  }

  const updateEmployeeDepartment = async (data: EmployeeDepartment) => {
    await http.put(`/api/employee-departments/${data.edID}`, data)
    await loadEmployeeDepartments()
  }

  const deleteEmployeeDepartment = async (id: number) => {
    await http.delete(`/api/employee-departments/${id}`)
    await loadEmployeeDepartments()
  }

  return {
    groupedEmployeeDepartments,
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment
  }
}) 