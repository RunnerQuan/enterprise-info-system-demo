import { api } from '@/api'
import type { EmployeeDepartment } from '@/types'

export const employeeDepartmentApi = {
  // 删除员工的所有部门关系
  deleteEmployeeDepartments: async (empNo: number) => {
    return await api.delete(`/employee-departments/employee/${empNo}`)
  },

  // 删除部门的所有员工关系
  deleteDepartmentRelations: async (deptNo: number) => {
    return await api.delete(`/employee-departments/department/${deptNo}`)
  },

  // 获取员工的部门关系
  getEmployeeDepartments: async (empNo: number) => {
    const response = await api.get<EmployeeDepartment[]>(`/employee-departments/employee/${empNo}`)
    return response.data
  }
} 