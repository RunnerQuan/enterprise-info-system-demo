import type { EmployeeDepartment, EmployeeDepartmentRequest, GroupedEmployeeDepartment } from '@/types'
import axios from 'axios'

export const employeeDepartmentApi = {
  /**
   * 获取所有员工部门关系（分组后的）
   */
  getAll: async () => {
    const { data } = await http.get<GroupedEmployeeDepartment[]>('/api/employee-departments')
    return data
  },

  /**
   * 添加员工部门关系
   */
  create: async (employeeDepartment: EmployeeDepartmentRequest) => {
    const { data } = await http.post<{ message: string }>('/api/employee-departments', employeeDepartment)
    return data
  },

  /**
   * 更新员工部门关系
   */
  update: async (id: number, employeeDepartment: EmployeeDepartmentRequest) => {
    const { data } = await http.put<{ message: string }>(`/api/employee-departments/${id}`, employeeDepartment)
    return data
  },

  /**
   * 删除员工部门关系
   */
  delete: async (id: number) => {
    const { data } = await http.delete<{ message: string }>(`/api/employee-departments/${id}`)
    return data
  }
} 