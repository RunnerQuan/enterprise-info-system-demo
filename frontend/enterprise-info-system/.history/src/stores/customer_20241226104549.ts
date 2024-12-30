import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from '@/types'


export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)

  // 加载客户列表
  const loadCustomers = async () => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      isLoading.value = false
    }
  }

  // 添加客户
  const addCustomer = async (customer: Omit<Customer, 'customerID'>) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newCustomer: Customer = {
        ...customer,
        customerID: Math.max(0, ...customers.value.map(c => c.customerID)) + 1
      }
      customers.value.push(newCustomer)
      return newCustomer
    } finally {
      isLoading.value = false
    }
  }

  // 更新客户
  const updateCustomer = async (customer: Customer) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const index = customers.value.findIndex(c => c.customerID === customer.customerID)
      if (index !== -1) {
        customers.value[index] = customer
      }
    } finally {
      isLoading.value = false
    }
  }

  // 删除客户
  const deleteCustomer = async (customerID: number) => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      customers.value = customers.value.filter(c => c.customerID !== customerID)
    } finally {
      isLoading.value = false
    }
  }

  return {
    customers,
    isLoading,
    loadCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer
  }
}) 