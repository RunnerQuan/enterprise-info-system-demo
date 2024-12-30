import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupedEmployeeDepartment, EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'
import { http } from '@/utils/http'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])

  const loadEmployeeDepartments = async () => {
    const response = await http.get<GroupedEmployeeDepartment[]>('/api/employee-departments')
    groupedEmployeeDepartments.value = response.data.map(group => ({
      ...group,
      departments: group.departments.map(dept => ({
        ...dept,
        edEntryDate: dept.edEntryDate.split('T')[0],
        edLeaveDate: dept.edLeaveDate ? dept.edLeaveDate.split('T')[0] : null
      }))
    }))
  }

  const addEmployeeDepartment = async (data: EmployeeDepartmentRequest) => {
    await http.post('/api/employee-departments', data)
    await loadEmployeeDepartments()
  }

  const updateEmployeeDepartment = async (data: EmployeeDepartment) => {
    const { edID, ...updateData } = data
    await http.put(`/api/employee-departments/${edID}`, updateData)
    await loadEmployeeDepartments()
  }

  const deleteEmployeeDepartment = async (edID: number) => {
    await http.delete(`/api/employee-departments/${edID}`)
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