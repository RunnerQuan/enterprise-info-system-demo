import { api } from '@/api'
import type { EmployeeDepartment } from '@/types'
import { departmentApi } from './department'

export const employeeDepartmentApi = {
  // 删除员工的所有部门关系
  deleteEmployeeDepartments: async (empNo: number) => {
    // 获取员工的所有部门关系
    const relations = await api.get<EmployeeDepartment[]>(`/employee-departments/employee/${empNo}`)
    // 逐个删除关系
    await Promise.all(
      relations.data.map(relation => 
        api.delete(`/employee-departments/${relation.edID}`)
      )
    )
  },

  // 删除部门的所有员工关系
  deleteDepartmentRelations: async (deptNo: number) => {
    // 这里会先调用 GET /api/departments/:id/employees 获取部门员工
    const relations = await departmentApi.getDepartmentEmployees(deptNo)
    if (relations.length > 0) {
      await Promise.all(
        relations.map(relation => 
          api.delete(`/employee-departments/${relation.edID}`)
        )
      )
    }
  },

  // 获取员工的部门关系
  getEmployeeDepartments: async (empNo: number) => {
    const response = await api.get<EmployeeDepartment[]>(`/employee-departments/employee/${empNo}`)
    return response.data
  },

  // 添加新方法
  deleteDepartmentRelationsDirectly: async (deptNo: number) => {
    await api.delete(`/employee-departments/department/${deptNo}`)
  }
} 