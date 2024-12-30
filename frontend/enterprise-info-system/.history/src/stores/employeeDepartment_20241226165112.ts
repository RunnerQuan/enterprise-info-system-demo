import { defineStore } from 'pinia'
import { ref } from 'vue'
import { employeeDepartmentApi } from '@/api/employeeDepartment'
import type { EmployeeDepartment } from '@/types'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', () => {
  const employeeDepartmentDetails = ref<EmployeeDepartment[]>([])

  const loadEmployeeDepartments = async () => {
    employeeDepartmentDetails.value = await employeeDepartmentApi.getEmployeeDepartments()
  }

  const addEmployeeDepartment = async (employeeDepartment: Omit<EmployeeDepartment, 'edID'>) => {
    const newEmployeeDepartment = await employeeDepartmentApi.createEmployeeDepartment(employeeDepartment)
    employeeDepartmentDetails.value.push(newEmployeeDepartment)
  }

  const updateEmployeeDepartment = async (employeeDepartment: EmployeeDepartment) => {
    const updatedEmployeeDepartment = await employeeDepartmentApi.updateEmployeeDepartment(employeeDepartment)
    const index = employeeDepartmentDetails.value.findIndex(ed => ed.edID === employeeDepartment.edID)
    if (index !== -1) {
      employeeDepartmentDetails.value[index] = updatedEmployeeDepartment
    }
  }

  const deleteEmployeeDepartment = async (edID: number) => {
    await employeeDepartmentApi.deleteEmployeeDepartment(edID)
    employeeDepartmentDetails.value = employeeDepartmentDetails.value.filter(ed => ed.edID !== edID)
  }

  return {
    employeeDepartmentDetails,
    loadEmployeeDepartments,
    addEmployeeDepartment,
    updateEmployeeDepartment,
    deleteEmployeeDepartment
  }
}) 