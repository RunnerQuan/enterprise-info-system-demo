import { defineStore } from 'pinia'
import type { EmployeeDepartment, GroupedEmployeeDepartment } from '@/types'
import { ref } from 'vue'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])

  const loadEmployeeDepartments = async () => {
    try {
      console.log('开始加载员工部门数据')
      const response = await fetch('/api/employee-departments')
      console.log('API响应:', response)
      if (!response.ok) throw new Error('Failed to load employee departments')
      const data = await response.json()
      console.log('获取到的数据:', data)
      groupedEmployeeDepartments.value = data
    } catch (error) {
      console.error('加载失败:', error)
      throw error
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
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment
  }
}) 