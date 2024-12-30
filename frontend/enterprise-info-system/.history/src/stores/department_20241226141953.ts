import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Department } from '@/types'
import { departmentApi } from '@/api/department'

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      isLoading.value = true
      const data = await departmentApi.getDepartments()
      departments.value = data
    } catch (error) {
      console.error('加载部门列表失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 添加部门
  const addDepartment = async (department: Omit<Department, 'deptNo'>) => {
    try {
      isLoading.value = true
      const newDepartment = await departmentApi.createDepartment(department)
      departments.value.push(newDepartment)
      return newDepartment
    } catch (error) {
      console.error('添加部门失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 更新部门
  const updateDepartment = async (department: Department) => {
    try {
      isLoading.value = true
      await departmentApi.updateDepartment(department)
      const index = departments.value.findIndex(d => d.deptNo === department.deptNo)
      if (index !== -1) {
        departments.value[index] = department
      }
    } catch (error) {
      console.error('更新部门失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 删除部门
  const deleteDepartment = async (deptNo: number) => {
    try {
      isLoading.value = true
      await departmentApi.deleteDepartment(deptNo)
      departments.value = departments.value.filter(d => d.deptNo !== deptNo)
    } catch (error) {
      console.error('删除部门失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    departments,
    isLoading,
    loadDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment
  }
})