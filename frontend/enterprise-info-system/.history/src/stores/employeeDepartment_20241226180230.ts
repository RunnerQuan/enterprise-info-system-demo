import { defineStore } from 'pinia'
import type { EmployeeDepartment, GroupedEmployeeDepartment } from '@/types'
import { ref } from 'vue'
import axios from '@/plugins/axios'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployeeDepartments = async () => {
    try {
      isLoading.value = true
      error.value = null
      const response = await axios.get('/api/employee-departments')
      groupedEmployeeDepartments.value = response.data
    } catch (err) {
      console.error('Failed to load employee departments:', err)
      error.value = '加载员工部门关系失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addEmployeeDepartment = async (data: Omit<EmployeeDepartment, 'edID'>) => {
    const response = await fetch('/api/employee-departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to add employee department')
    await loadEmployeeDepartments()
  }

  const updateEmployeeDepartment = async (data: EmployeeDepartment) => {
    const response = await fetch(`/api/employee-departments/${data.edID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update employee department')
    await loadEmployeeDepartments()
  }

  const deleteEmployeeDepartment = async (edID: number) => {
    const response = await fetch(`/api/employee-departments/${edID}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete employee department')
    await loadEmployeeDepartments()
  }

  return {
    groupedEmployeeDepartments,
    isLoading,
    error,
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment
  }
}) 