import axios from 'axios'
import type { Employee, EmployeeRequest } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const employeeApi = {
  // 获取所有员工
  getEmployees: async () => {
    const response = await api.get<Employee[]>('/employees')
    return response.data
  },

  // 创建员工
  createEmployee: async (employee: EmployeeRequest) => {
    const response = await api.post<Employee>('/employees', employee)
    return response.data
  },

  // 更新员工
  updateEmployee: async (employee: EmployeeRequest) => {
    const response = await api.put<Employee>('/employees', employee)
    return response.data
  },

  // 删除员工
  deleteEmployee: async (empNo: number) => {
    const response = await api.delete(`/employees/${empNo}`)
    return response.data
  },

  // 搜索员工
  searchEmployees: async (params: {
    name?: string
    department?: number
    hireDateStart?: string
    hireDateEnd?: string
  }) => {
    const response = await api.post<Employee[]>('/employees/search', params)
    return response.data
  }
} 