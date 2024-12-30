import axios from 'axios'
import type { Department } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const departmentApi = {
  // 获取所有部门
  getDepartments: async () => {
    const response = await api.get<Department[]>('/departments')
    return response.data
  },

  // 创建部门
  createDepartment: async (department: Omit<Department, 'deptNo'>) => {
    const response = await api.post<Department>('/departments', department)
    return response.data
  },

  // 更新部门
  updateDepartment: async (department: Department) => {
    const response = await api.put<Department>('/departments', department)
    return response.data
  },

  // 删除部门
  deleteDepartment: async (deptNo: number) => {
    const response = await api.delete(`/departments/${deptNo}`)
    return response.data
  }
} 