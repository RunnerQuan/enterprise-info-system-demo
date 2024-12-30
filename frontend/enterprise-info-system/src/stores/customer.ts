import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from '@/types'
import { customerApi } from '@/api/customer'

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)

  // 加载客户列表
  const loadCustomers = async () => {
    try {
      isLoading.value = true
      const data = await customerApi.getCustomers()
      customers.value = data
    } catch (error) {
      console.error('加载客户列表失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 添加客户
  const addCustomer = async (customer: Omit<Customer, 'customerID'>) => {
    try {
      isLoading.value = true
      const newCustomer = await customerApi.createCustomer(customer)
      customers.value.push(newCustomer)
      return newCustomer
    } catch (error) {
      console.error('添加客户失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 更新客户
  const updateCustomer = async (customer: Customer) => {
    try {
      isLoading.value = true
      const updatedCustomer = await customerApi.updateCustomer(customer)
      const index = customers.value.findIndex(c => c.customerID === customer.customerID)
      if (index !== -1) {
        customers.value[index] = updatedCustomer
      }
    } catch (error) {
      console.error('更新客户失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // 删除客户
  const deleteCustomer = async (customerID: number) => {
    try {
      isLoading.value = true
      await customerApi.deleteCustomer(customerID)
      customers.value = customers.value.filter(c => c.customerID !== customerID)
    } catch (error) {
      console.error('删除客户失败:', error)
      throw error
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