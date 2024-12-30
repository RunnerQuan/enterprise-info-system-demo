import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EmployeeDepartment, EmployeeDepartmentDetail } from '@/types'
import { useEmployeeStore } from './employee'
import { useDepartmentStore } from './department'

// 模拟数据
const MOCK_EMPLOYEE_DEPARTMENTS: EmployeeDepartment[] = [
  {
    edID: 1,
    empNo: 1,
    deptNo: 1,
    edEntryDate: '2023-01-15',
    edLeaveDate: null,
    edStatus: 1
  },
  {
    edID: 2,
    empNo: 2,
    deptNo: 2,
    edEntryDate: '2023-03-01',
    edLeaveDate: null,
    edStatus: 1
  }
]

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const employeeStore = useEmployeeStore()
  const departmentStore = useDepartmentStore()
  
  const employeeDepartments = ref<EmployeeDepartment[]>([])
  const isLoading = ref(false)

  // 计算属性：带有详细信息的员工部门关系列表
  const employeeDepartmentDetails = computed<EmployeeDepartmentDetail[]>(() => {
    return employeeDepartments.value.map(ed => {
      const employee = employeeStore.employees.find(e => e.empNo === ed.empNo)
      const department = departmentStore.departments.find(d => d.deptNo === ed.deptNo)
      
      return {
        ...ed,
        employeeName: employee ? `${employee.firstName}${employee.lastName}` : '未知',
        departmentName: department?.deptName ?? '未知'
      }
    })
  })

  // 加载员工部门关系列表
  const loadEmployeeDepartments = async () => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await Promise.all([
        employeeStore.loadEmployees(),
        departmentStore.loadDepartments()
      ])
      await new Promise(resolve => setTimeout(resolve, 1000))
      employeeDepartments.value = MOCK_EMPLOYEE_DEPARTMENTS
    } finally {
      isLoading.value = false
    }
  }

  // 添加员工部门关系
  const addEmployeeDepartment = async (employeeDepartment: Omit<EmployeeDepartment, 'edID'>) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newEmployeeDepartment: EmployeeDepartment = {
        ...employeeDepartment,
        edID: Math.max(0, ...employeeDepartments.value.map(ed => ed.edID)) + 1
      }
      employeeDepartments.value.push(newEmployeeDepartment)
      return newEmployeeDepartment
    } finally {
      isLoading.value = false
    }
  }

  // 更新员���部门关系
  const updateEmployeeDepartment = async (employeeDepartment: EmployeeDepartment) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = employeeDepartments.value.findIndex(ed => ed.edID === employeeDepartment.edID)
      if (index !== -1) {
        employeeDepartments.value[index] = employeeDepartment
      }
    } finally {
      isLoading.value = false
    }
  }

  // 删除员工部门关系
  const deleteEmployeeDepartment = async (edID: number) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      employeeDepartments.value = employeeDepartments.value.filter(ed => ed.edID !== edID)
    } finally {
      isLoading.value = false
    }
  }

  // 获取员工的所有部门
  const getEmployeeDepartments = computed(() => (empNo: number) => {
    return employeeDepartmentDetails.value.filter(ed => 
      ed.empNo === empNo && ed.edStatus === 1
    )
  })

  // 获取部门的所有员工
  const getDepartmentEmployees = computed(() => (deptNo: number) => {
    return employeeDepartmentDetails.value.filter(ed => 
      ed.deptNo === deptNo && ed.edStatus === 1
    )
  })

  return {
    employeeDepartments,
    employeeDepartmentDetails,
    isLoading,
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment,
    getEmployeeDepartments,
    getDepartmentEmployees
  }
}) 