import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Employee } from '@/types'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)

  // 加载员工列表
  const loadEmployees = async () => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
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

  // 搜索员工
  const searchEmployees = computed(() => (params: {
    name?: string
    department?: string | number
    hireDateStart?: string
    hireDateEnd?: string
  }) => {
    return employees.value.filter(employee => {
      // 姓名匹配
      if (params.name && !`${employee.firstName}${employee.lastName}`.includes(params.name)) {
        return false
      }

      // 入职日期范围匹配
      if (params.hireDateStart && employee.hireDate < params.hireDateStart) {
        return false
      }
      if (params.hireDateEnd && employee.hireDate > params.hireDateEnd) {
        return false
      }

      // 部门匹配（需要通过 employeeDepartment 关系查询）
      if (params.department) {
        const employeeDepartmentStore = useEmployeeDepartmentStore()
        const departments = employeeDepartmentStore.getEmployeeDepartments(employee.empNo)
        if (!departments.some(d => d.deptNo === Number(params.department))) {
          return false
        }
      }

      return true
    })
  })

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