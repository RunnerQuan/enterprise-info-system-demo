import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { EmployeeDepartment, GroupedEmployeeDepartment } from '@/types'
import { employeeDepartmentApi } from '@/api/employeeDepartment'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const employeeDepartments = ref<GroupedEmployeeDepartment[]>([])
  const isLoading = ref(false)

  // 加载员工部门关系列表
  const loadEmployeeDepartments = async () => {
    try {
      isLoading.value = true
      employeeDepartments.value = await employeeDepartmentApi.getEmployeeDepartments()
    } finally {
      isLoading.value = false
    }
  }

  // 添加员工部门关系
  const addEmployeeDepartment = async (data: Omit<EmployeeDepartment, 'edID'>) => {
    try {
      isLoading.value = true
      await employeeDepartmentApi.addEmployeeDepartment(data)
      await loadEmployeeDepartments() // 重新加载数据
    } finally {
      isLoading.value = false
    }
  }

  // 更新员工部门关系
  const updateEmployeeDepartment = async (employeeDepartment: EmployeeDepartment) => {
    try {
      isLoading.value = true
      const { edID, ...data } = employeeDepartment
      await employeeDepartmentApi.updateEmployeeDepartment(edID, data)
      await loadEmployeeDepartments() // 重新加载数据
    } finally {
      isLoading.value = false
    }
  }

  // 删除员工部门关系
  const deleteEmployeeDepartment = async (edID: number) => {
    try {
      isLoading.value = true
      await employeeDepartmentApi.deleteEmployeeDepartment(edID)
      await loadEmployeeDepartments() // 重新加载数据
    } finally {
      isLoading.value = false
    }
  }

  return {
    employeeDepartments,
    isLoading,
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment
  }
}) 