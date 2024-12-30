import axios from 'axios'
import type { Customer } from '@/types'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export const customerApi = {
  // 获取所有客户
  getCustomers: async () => {
    const response = await api.get<Customer[]>('/customers')
    return response.data
  },

  // 创建客户
  createCustomer: async (customer: Omit<Customer, 'customerID'>) => {
    const response = await api.post<Customer>('/customers', customer)
    return response.data
  },

  // 更新客户
  updateCustomer: async (customer: Customer) => {
    const response = await api.put<Customer>('/customers', customer)
    return response.data
  },

  // 删除客户
  deleteCustomer: async (customerID: number) => {
    const response = await api.delete(`/customers/${customerID}`)
    return response.data
  }
} 