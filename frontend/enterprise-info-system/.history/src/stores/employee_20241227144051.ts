import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee, EmployeeRequest } from '@/types'
import { api } from '@/api'
import { employeeDepartmentApi } from '@/api/employeeDepartment'
import { useEmployeeDepartmentStore } from './employeeDepartment'

export const useEmployeeStore = defineStore('employee', () => {
  const employeeDepartmentStore = useEmployeeDepartmentStore()
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const loadEmployees = async () => {
    isLoading.value = true
    try {
      const response = await api.get('/employees')
      employees.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || '加载员工列表失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addEmployee = async (employeeData: Omit<Employee, 'empNo'>) => {
    try {
      const formattedData = {
        ...employeeData,
        hireDate: employeeData.hireDate.split('T')[0],
        birthday: employeeData.birthday.split('T')[0]
      }
      const response = await api.post('/employees', formattedData)
      employees.value.push(response.data)
      return response.data
    } catch (err: any) {
      throw err.response?.data?.error || '添加员工失败'
    }
  }

  const updateEmployee = async (employee: Employee) => {
    try {
      const formattedData = {
        ...employee,
        hireDate: employee.hireDate.split('T')[0],
        birthday: employee.birthday.split('T')[0]
      }
      const response = await api.put('/employees', formattedData)
      const index = employees.value.findIndex(e => e.empNo === employee.empNo)
      if (index !== -1) {
        employees.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      throw err.response?.data?.error || '更新员工失败'
    }
  }

  const deleteEmployee = async (empNo: number) => {
    try {
      // 先删除员工的部门关系
      await employeeDepartmentApi.deleteEmployeeDepartments(empNo)
      // 再删除员工信息
      await api.delete(`/employees/${empNo}`)
      employees.value = employees.value.filter(e => e.empNo !== empNo)
      // 删除成功后，重新加载员工部门关系数据
      await employeeDepartmentStore.loadEmployeeDepartments()
    } catch (err: any) {
      console.error('删除员工错误:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || '删除员工失败'
      error.value = errorMessage
      throw new Error(errorMessage)
    }
  }

  return {
    employees,
    isLoading,
    error,
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
  }
}) 