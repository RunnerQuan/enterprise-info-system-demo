import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GroupedEmployeeDepartment, EmployeeDepartment, EmployeeDepartmentRequest } from '@/types'
import { employeeDepartmentApi } from '@/api/employeeDepartment'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const groupedEmployeeDepartments = ref<GroupedEmployeeDepartment[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 格式化员工姓名
  const formatEmployeeName = (lastName: string, firstName: string) => {
    return `${lastName}${firstName}`
  }

  const loadEmployeeDepartments = async () => {
    try {
      isLoading.value = true
      error.value = null
      const data = await employeeDepartmentApi.getAll()
      
      // 添加调试日志
      console.log('Backend response data:', data)

      groupedEmployeeDepartments.value = data.map(group => {
        // 调试每个组的数据
        console.log('Processing group:', group)
        
        // 检查数据完整性
        if (!group.firstName || !group.lastName) {
          console.error('Missing name data:', {
            empNo: group.empNo,
            firstName: group.firstName,
            lastName: group.lastName
          })
        }

        return {
          ...group,
          // 添加默认值防止 undefined
          firstName: group.firstName || '',
          lastName: group.lastName || '',
          // 只有当两个值都存在时才组合姓名
          employeeName: group.lastName && group.firstName 
            ? `${group.lastName}${group.firstName}`
            : '未知姓名',
          departments: group.departments.map(dept => ({
            ...dept,
            edEntryDate: dept.edEntryDate.split('T')[0],
            edLeaveDate: dept.edLeaveDate ? dept.edLeaveDate.split('T')[0] : null
          }))
        }
      })
    } catch (err: any) {
      error.value = err.response?.data?.error || '加载员工部门关系失败'
      throw error.value
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