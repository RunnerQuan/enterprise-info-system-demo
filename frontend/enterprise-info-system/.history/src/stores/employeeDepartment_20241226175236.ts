import { defineStore } from 'pinia'
import axios from 'axios'
import type { GroupedEmployeeDepartment, EmployeeDepartmentRequest } from '@/types'

export const useEmployeeDepartmentStore = defineStore('employeeDepartment', {
  state: () => ({
    employeeDepartments: [] as GroupedEmployeeDepartment[]
  }),

  actions: {
    async loadEmployeeDepartments() {
      const response = await axios.get('/api/employee-departments')
      this.employeeDepartments = response.data
    },

    async addEmployeeDepartment(data: EmployeeDepartmentRequest) {
      await axios.post('/api/employee-departments', data)
      await this.loadEmployeeDepartments()
    },

    async updateEmployeeDepartment(id: number, data: EmployeeDepartmentRequest) {
      await axios.put(`/api/employee-departments/${id}`, data)
      await this.loadEmployeeDepartments()
    },

    async deleteEmployeeDepartment(id: number) {
      await axios.delete(`/api/employee-departments/${id}`)
      await this.loadEmployeeDepartments()
    }
  }
}) 