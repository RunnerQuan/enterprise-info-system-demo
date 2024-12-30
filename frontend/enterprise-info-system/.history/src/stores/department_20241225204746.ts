import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Department } from '@/types'

// 模拟部门数据
const MOCK_DEPARTMENTS: Department[] = [
  {
    deptNo: 1,
    deptName: '研发部',
    deptPeopleCount: 15
  },
  {
    deptNo: 2,
    deptName: '市场部',
    deptPeopleCount: 8
  }
]

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([])
  const isLoading = ref(false)

  // 加载部门列表
  const loadDepartments = async () => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      departments.value = MOCK_DEPARTMENTS
    } finally {
      isLoading.value = false
    }
  }

  // 添加部门
  const addDepartment = async (department: Omit<Department, 'deptNo'>) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newDepartment: Department = {
        ...department,
        deptNo: Math.max(0, ...departments.value.map(d => d.deptNo)) + 1
      }
      departments.value.push(newDepartment)
      return newDepartment
    } finally {
      isLoading.value = false
    }
  }

  // 更新部门
  const updateDepartment = async (department: Department) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = departments.value.findIndex(d => d.deptNo === department.deptNo)
      if (index !== -1) {
        departments.value[index] = department
      }
    } finally {
      isLoading.value = false
    }
  }

  // 删除部门
  const deleteDepartment = async (deptNo: number) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      departments.value = departments.value.filter(d => d.deptNo !== deptNo)
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