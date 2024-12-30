<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCustomerStore } from '@/stores/customer'
import { useMessage } from '@/composables/useMessage'
import CustomerForm from '@/components/CustomerForm.vue'
import type { Customer } from '@/types'

const customerStore = useCustomerStore()
const { showSuccess, showError } = useMessage()

const showAddModal = ref(false)
const showEditModal = ref(false)
const currentCustomer = ref<Customer | null>(null)

// 加载客户列表
onMounted(async () => {
  try {
    await customerStore.loadCustomers()
  } catch (error: any) {
    showError(error.response?.data?.error || '加载客户列表失败')
  }
})

// 添加客户
const handleAdd = async (customerData: Omit<Customer, 'customerID'>) => {
  try {
    await customerStore.addCustomer(customerData)
    showSuccess('添加客户成功')
    showAddModal.value = false
  } catch (error: any) {
    showError(error.response?.data?.error || '添加客户失败')
  }
}

// 编辑客户
const handleEdit = async (customer: Customer) => {
  try {
    await customerStore.updateCustomer(customer)
    showSuccess('更新客户成功')
    showEditModal.value = false
    currentCustomer.value = null
  } catch (error: any) {
    showError(error.response?.data?.error || '更新客户失败')
  }
}

// 删除客户
const handleDelete = async (customer: Customer) => {
  if (!confirm(`确定要删除客户 ${customer.customerName} 吗？`)) {
    return
  }
  
  try {
    await customerStore.deleteCustomer(customer.customerID)
    showSuccess('删除客户成功')
  } catch (error: any) {
    showError(error.response?.data?.error || '删除客户失败')
  }
}

const openEditModal = (customer: Customer) => {
  currentCustomer.value = customer
  showEditModal.value = true
}

// 获取头像背景色
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">客户管理</h2>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        添加客户
      </button>
    </div>

    <!-- 客户列表 -->
    <div class="bg-white shadow rounded-lg">
      <ul v-if="customerStore.customers.length" class="divide-y divide-gray-200">
        <li v-for="customer in customerStore.customers" :key="customer.customerID" 
            class="p-3 hover:bg-gray-50">
          <div class="flex justify-between items-center">
            <!-- 头像和基本信息 -->
            <div class="flex items-center space-x-4 flex-1">
              <!-- 头像 -->
              <div 
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg',
                  getAvatarColor(customer.customerName)
                ]"
              >
                {{ customer.customerName[0] }}
              </div>

              <!-- 所有信息放在一行 -->
              <div class="flex items-center space-x-6 flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ customer.customerName }}</span>
                  <span class="px-2 py-0.5 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    {{ customer.company }}
                  </span>
                  <span 
                    class="px-2 py-0.5 text-sm font-medium rounded-full"
                    :class="customer.sex === '男' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'"
                  >
                    {{ customer.sex }}
                  </span>
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {{ customer.age }}岁
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ customer.telephone }}
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ customer.address }}
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 ml-4">
              <button
                @click="openEditModal(customer)"
                class="inline-flex items-center px-2.5 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>
              <button
                @click="handleDelete(customer)"
                class="inline-flex items-center px-2.5 py-1 border border-red-600 rounded text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <svg class="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                删除
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="py-8">
        <div class="text-center">
          <p class="text-sm text-gray-500">暂无客户信息</p>
        </div>
      </div>
    </div>

    <!-- 添加客户对话框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加客户</h3>
        <CustomerForm
          @submit="handleAdd"
          @cancel="showAddModal = false"
        />
      </div>
    </div>

    <!-- 编辑客户对话框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">编辑客户</h3>
        <CustomerForm
          v-if="currentCustomer"
          :customer="currentCustomer"
          :is-edit="true"
          @submit="handleEdit"
          @cancel="showEditModal = false"
        />
      </div>
    </div>
  </div>
</template> 