import { request } from '@/utils/request'
import type { GroupedEmployeeDepartment, EmployeeDepartmentRequest, EmployeeDepartment } from '@/types'

export const employeeDepartmentApi = {
  // 获取所有员工部门关系
  getEmployeeDepartments: () => 
    request.get<GroupedEmployeeDepartment[]>('/employee-departments'),

  // 添加员工部门关系
  createEmployeeDepartment: (data: EmployeeDepartmentRequest) =>
    request.post<void>('/employee-departments', data),

  // 更新员工部门关系
  updateEmployeeDepartment: (id: number, data: EmployeeDepartmentRequest) =>
    request.put<void>(`/employee-departments/${id}`, data),

  // 删除员工部门关系
  deleteEmployeeDepartment: (id: number) =>
    request.delete<void>(`/employee-departments/${id}`)
} 