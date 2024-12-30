import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupedEmployeeDepartment, EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'
import { employeeDepartmentApi } from '@/api/employeeDepartment'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployeeDepartments = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await employeeDepartmentApi.getAll()
      groupedEmployeeDepartments.value = data.map(group => ({
        ...group,
        departments: group.departments.map(dept => ({
          ...dept,
          edEntryDate: dept.edEntryDate.split('T')[0],
          edLeaveDate: dept.edLeaveDate ? dept.edLeaveDate.split('T')[0] : null
        }))
      }))
    } catch (err) {
      error.value = '加载员工部门关系失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addEmployeeDepartment = async (data: EmployeeDepartmentRequest) => {
    try {
      isLoading.value = true
      error.value = null
      await employeeDepartmentApi.create(data)
      await loadEmployeeDepartments()
    } catch (err) {
      error.value = '添加员工部门关系失败'
      throw err
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
    } catch (err) {
      error.value = '更新员工部门关系失败'
      throw err
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
    } catch (err) {
      error.value = '删除员工部门关系失败'
      throw err
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