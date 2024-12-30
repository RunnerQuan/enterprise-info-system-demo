import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer } from '@/types'

// 模拟客户数据
const MOCK_CUSTOMERS: Customer[] = [
  {
    customerID: 1,
    customerName: '张三',
    company: '阿里巴巴',
    sex: '男',
    age: 35,
    telephone: '13800138000',
    address: '杭州市西湖区'
  },
  {
    customerID: 2,
    customerName: '李四',
    company: '腾讯',
    sex: '女',
    age: 28,
    telephone: '13900139000',
    address: '深圳市南山区'
  }
]

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const isLoading = ref(false)

  // 加载客户列表
  const loadCustomers = async () => {
    try {
      isLoading.value = true
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      customers.value = MOCK_CUSTOMERS
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