import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupedEmployeeDepartment, EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'
import { employeeDepartmentApi } from '@/api/employeeDepartment'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployeeDepartments = async () => {
    isLoading.value = true
    try {
      const response = await employeeDepartmentApi.getAll()
      groupedEmployeeDepartments.value = response || []
    } catch (err: any) {
      console.log('获取员工部门关系数据:', err)
      groupedEmployeeDepartments.value = []
    } finally {
      isLoading.value = false
    }
  }

  const addEmployeeDepartment = async (data: EmployeeDepartmentRequest) => {
    try {
      isLoading.value = true
      error.value = null
      const response = await employeeDepartmentApi.create(data)
      await loadEmployeeDepartments()
      return response
    } catch (err: any) {
      console.error('添加员工部门关系错误:', err)
      error.value = err.response?.data?.error || '添加员工部门关系失败'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const updateEmployeeDepartment = async (data: EmployeeDepartment) => {
    try {
      isLoading.value = true
      error.value = null
      const { edID, ...updateData } = data
      await employeeDepartmentApi.update(edID, updateData)
      await loadEmployeeDepartments()
    } catch (err: any) {
      error.value = err.response?.data?.error || '更新员工部门关系失败'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const deleteEmployeeDepartment = async (edID: number) => {
    try {
      isLoading.value = true
      error.value = null
      await employeeDepartmentApi.delete(edID)
      await loadEmployeeDepartments()
    } catch (err: any) {
      error.value = err.response?.data?.error || '删除员工部门关系失败'
      throw error.value
    } finally {
      isLoading.value = false
    }
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