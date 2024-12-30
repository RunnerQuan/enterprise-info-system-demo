import axios from '@/utils/axios'
import type { EmployeeDepartment, GroupedEmployeeDepartment } from '@/types'

export const employeeDepartmentApi = {
  // 获取所有员工部门关系(按员工分组)
  getEmployeeDepartments: async () => {
    const response = await axios.get<GroupedEmployeeDepartment[]>('/employee-departments')
    return response.data
  },

  // 添加员工部门关系
  addEmployeeDepartment: async (data: Omit<EmployeeDepartment, 'edID'>) => {
    const response = await axios.post('/employee-departments', data)
    return response.data
  },

  // 更新员工部门关系
  updateEmployeeDepartment: async (edID: number, data: Omit<EmployeeDepartment, 'edID'>) => {
    const response = await axios.put(`/employee-departments/${edID}`, data)
    return response.data
  },

  // 删除员工部门关系
  deleteEmployeeDepartment: async (edID: number) => {
    const response = await axios.delete(`/employee-departments/${edID}`)
    return response.data
  }
} 