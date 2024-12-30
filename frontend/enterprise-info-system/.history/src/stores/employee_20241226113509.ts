import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee } from '@/types'
import { employeeApi } from '@/api/employee'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)

  // 加载员工列表
  const loadEmployees = async () => {
    try {
      isLoading.value = true
      const data = await employeeApi.getEmployees()
      employees.value = data
    } catch (error) {
      console.error('加载员工列表失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 添加员工
  const addEmployee = async (employee: Omit<Employee, 'empNo'>) => {
    try {
      isLoading.value = true
      const newEmployee = await employeeApi.createEmployee(employee)
      employees.value.push(newEmployee)
      return newEmployee
    } catch (error) {
      console.error('添加员工失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 更新员工
  const updateEmployee = async (employee: Employee) => {
    try {
      isLoading.value = true
      const updatedEmployee = await employeeApi.updateEmployee(employee)
      const index = employees.value.findIndex(e => e.empNo === employee.empNo)
      if (index !== -1) {
        employees.value[index] = updatedEmployee
      }
    } catch (error) {
      console.error('更新员工失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 删除员工
  const deleteEmployee = async (empNo: number) => {
    try {
      isLoading.value = true
      await employeeApi.deleteEmployee(empNo)
      employees.value = employees.value.filter(e => e.empNo !== empNo)
    } catch (error) {
      console.error('删除员工失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 搜索员工
  const searchEmployees = async (params: {
    name?: string
    department?: number
    hireDateStart?: string
    hireDateEnd?: string
  }) => {
    try {
      isLoading.value = true
      return await employeeApi.searchEmployees(params)
    } catch (error) {
      console.error('搜索员工失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  return {
    employees,
    isLoading,
    loadEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees
  }
}) 