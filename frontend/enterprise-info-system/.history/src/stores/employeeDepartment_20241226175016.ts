import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupedEmployeeDepartment, EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'
import { employeeDepartmentApi } from '@/api/employeeDepartment'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])
  const isLoading = ref(false)

  const loadEmployeeDepartments = async () => {
    try {
      isLoading.value = true
      const data = await employeeDepartmentApi.getEmployeeDepartments()
      groupedEmployeeDepartments.value = data
    } catch (error) {
      console.error('加载员工部门关系失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addEmployeeDepartment = async (data: EmployeeDepartmentRequest) => {
    try {
      isLoading.value = true
      await employeeDepartmentApi.createEmployeeDepartment(data)
      await loadEmployeeDepartments()
    } catch (error) {
      console.error('添加员工部门关系失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateEmployeeDepartment = async (data: EmployeeDepartment) => {
    try {
      isLoading.value = true
      await employeeDepartmentApi.updateEmployeeDepartment(data.edID, data)
      await loadEmployeeDepartments()
    } catch (error) {
      console.error('更新员工部门关系失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const deleteEmployeeDepartment = async (id: number) => {
    try {
      isLoading.value = true
      await employeeDepartmentApi.deleteEmployeeDepartment(id)
      await loadEmployeeDepartments()
    } catch (error) {
      console.error('删除员工部门关系失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    groupedEmployeeDepartments,
    isLoading,
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment
  }
}) 