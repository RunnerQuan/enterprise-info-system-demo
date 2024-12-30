import { api } from '@/api'
import type { Department } from '@/types'

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
    const response = await api.put<Department>(`/departments/${department.deptNo}`, department)
    return response.data
  },

  // 删除部门
  deleteDepartment: async (deptNo: number) => {
    await api.delete(`/departments/${deptNo}`)
  },

  // 获取部门统计信息
  getDepartmentStats: async () => {
    const response = await api.get('/departments/stats')
    return response.data
  },

  // 获取部门员工列表
  getDepartmentEmployees: async (deptNo: number) => {
    const response = await api.get<EmployeeDepartment[]>(`/departments/${deptNo}/employees`)
    return response.data
  }
} 