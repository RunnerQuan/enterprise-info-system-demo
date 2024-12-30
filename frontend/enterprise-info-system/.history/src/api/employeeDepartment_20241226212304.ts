import type { EmployeeDepartment, EmployeeDepartmentRequest, GroupedEmployeeDepartment } from '@/types'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
  })
  

export const employeeDepartmentApi = {
  /**
   * 获取所有员工部门关系（分组后的）
   */
  getAll: async () => {
    const { data } = await api.get<GroupedEmployeeDepartment[]>('/api/employee-departments')
    return data
  },

  /**
   * 添加员工部门关系
   */
  create: async (employeeDepartment: EmployeeDepartmentRequest) => {
    const { data } = await api.post<{ message: string }>('/api/employee-departments', employeeDepartment)
    return data
  },

  /**
   * 更新员工部门关系
   */
  update: async (id: number, employeeDepartment: EmployeeDepartmentRequest) => {
    const { data } = await api.put<{ message: string }>(`/api/employee-departments/${id}`, employeeDepartment)
    return data
  },

  /**
   * 删除员工部门关系
   */
  delete: async (id: number) => {
    const { data } = await api.delete<{ message: string }>(`/api/employee-departments/${id}`)
    return data
  }
} 