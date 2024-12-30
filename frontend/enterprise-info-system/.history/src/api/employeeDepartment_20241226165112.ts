import axios from 'axios'
import type { EmployeeDepartment } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const employeeDepartmentApi = {
  // 获取所有员工部门关系
  getEmployeeDepartments: async () => {
    const response = await api.get<EmployeeDepartment[]>('/employee-departments')
    return response.data
  },

  // 创建员工部门关系
  createEmployeeDepartment: async (employeeDepartment: Omit<EmployeeDepartment, 'edID'>) => {
    const response = await api.post<EmployeeDepartment>('/employee-departments', employeeDepartment)
    return response.data
  },

  // 更新员工部门关系
  updateEmployeeDepartment: async (employeeDepartment: EmployeeDepartment) => {
    const response = await api.put<EmployeeDepartment>(`/employee-departments/${employeeDepartment.edID}`, employeeDepartment)
    return response.data
  },

  // 删除员工部门关系
  deleteEmployeeDepartment: async (edID: number) => {
    const response = await api.delete(`/employee-departments/${edID}`)
    return response.data
  }
} 