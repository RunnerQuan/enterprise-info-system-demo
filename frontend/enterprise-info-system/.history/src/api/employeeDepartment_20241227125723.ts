import { api } from '@/api'
import type { EmployeeDepartment, EmployeeDepartmentRequest, GroupedEmployeeDepartment } from '@/types'

export const employeeDepartmentApi = {
  // 获取所有员工部门关系（分组后的）
  getAll: async () => {
    const response = await api.get<GroupedEmployeeDepartment[]>('/employee-departments')
    return response.data
  },

  // 添加员工部门关系
  create: async (employeeDepartment: EmployeeDepartmentRequest) => {
    try {
      const response = await api.post<{ message: string }>('/employee-departments', employeeDepartment)
      return response.data
    } catch (error: any) {
      console.error('API 错误:', error.response?.data)
      throw error
    }
  },

  // 更新员工部门关系
  update: async (id: number, employeeDepartment: EmployeeDepartmentRequest) => {
    const response = await api.put<{ message: string }>(`/employee-departments/${id}`, employeeDepartment)
    return response.data
  },

  // 删除员工部门关系
  delete: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/employee-departments/${id}`)
    return response.data
  }
} 