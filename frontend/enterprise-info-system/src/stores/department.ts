import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Department } from '@/types'
import { departmentApi } from '@/api/department'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadDepartments = async () => {
    isLoading.value = true
    try {
      const data = await departmentApi.getDepartments()
      departments.value = data
    } catch (err: any) {
      error.value = err.response?.data?.error || '加载部门列表失败'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  const addDepartment = async (departmentData: Omit<Department, 'deptNo'>) => {
    try {
      const newDepartment = await departmentApi.createDepartment(departmentData)
      departments.value.push(newDepartment)
      return newDepartment
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '添加部门失败'
      error.value = errorMessage
      throw errorMessage
    }
  }

  const updateDepartment = async (department: Department) => {
    try {
      const updatedDepartment = await departmentApi.updateDepartment(department)
      const index = departments.value.findIndex(d => d.deptNo === department.deptNo)
      if (index !== -1) {
        departments.value[index] = updatedDepartment
      }
      return updatedDepartment
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '更新部门失败'
      error.value = errorMessage
      throw errorMessage
    }
  }

  const deleteDepartment = async (deptNo: number) => {
    try {
      // 直接删除部门，让后端处理关联关系
      await departmentApi.deleteDepartment(deptNo)
      departments.value = departments.value.filter(d => d.deptNo !== deptNo)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || '删除部门失败'
      error.value = errorMessage
      throw errorMessage
    }
  }

  return {
    departments,
    isLoading,
    error,
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  }
})