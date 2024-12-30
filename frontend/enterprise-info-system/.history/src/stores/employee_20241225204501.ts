import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Employee } from '@/types'

// 模拟员工数据
const MOCK_EMPLOYEES: Employee[] = [
  {
    empNo: 1,
    firstName: '小',
    lastName: '王',
    gender: 1,
    hireDate: '2023-01-15',
    birthday: '1990-05-20',
    address: '广州市天河区',
    telephone: '13511112222'
  },
  {
    empNo: 2,
    firstName: '小',
    lastName: '李',
    gender: 0,
    hireDate: '2023-03-01',
    birthday: '1995-08-12',
    address: '深圳市福田区',
    telephone: '13533334444'
  }
]

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)

  // 加载员工列表
  const loadEmployees = async () => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      employees.value = MOCK_EMPLOYEES
    } finally {
      isLoading.value = false
    }
  }

  // 添加员工
  const addEmployee = async (employee: Omit<Employee, 'empNo'>) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newEmployee: Employee = {
        ...employee,
        empNo: Math.max(0, ...employees.value.map(e => e.empNo)) + 1
      }
      employees.value.push(newEmployee)
      return newEmployee
    } finally {
      isLoading.value = false
    }
  }

  // 更新员工
  const updateEmployee = async (employee: Employee) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = employees.value.findIndex(e => e.empNo === employee.empNo)
      if (index !== -1) {
        employees.value[index] = employee
      }
    } finally {
      isLoading.value = false
    }
  }

  // 删除员工
  const deleteEmployee = async (empNo: number) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      employees.value = employees.value.filter(e => e.empNo !== empNo)
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
    deleteEmployee
  }
}) 