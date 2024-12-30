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
  } catch (error) {
    showError('加载客户列表失败')
  }
})

// 添加客户
const handleAdd = async (customerData: Omit<Customer, 'customerID'>) => {
  try {
    await customerStore.addCustomer(customerData)
    showSuccess('添加客户成功')
    showAddModal.value = false
  } catch (error) {
    showError('添加客户失败')
  }
}

// 编辑客户
const handleEdit = async (customer: Customer) => {
  try {
    await customerStore.updateCustomer(customer)
    showSuccess('更新客户成功')
    showEditModal.value = false
    currentCustomer.value = null
  } catch (error) {
    showError('更新客户失败')
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
  } catch (error) {
    showError('删除客户失败')
  }
}

const openEditModal = (customer: Customer) => {
  currentCustomer.value = customer
  showEditModal.value = true
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
        添加客户
      </button>
    </div>

    <!-- 客户列表 -->
    <div class="bg-white shadow rounded-lg">
      <ul v-if="customerStore.customers.length" class="divide-y divide-gray-200">
        <li v-for="customer in customerStore.customers" :key="customer.customerID" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 flex-grow">
              <!-- 左侧信息 -->
              <div class="flex items-center">
                <span class="text-gray-500 w-16">姓名：</span>
                <span class="font-medium text-gray-900">{{ customer.customerName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">公司：</span>
                <span class="text-gray-900">{{ customer.company }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">性别：</span>
                <span class="text-gray-900">{{ customer.sex }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">年龄：</span>
                <span class="text-gray-900">{{ customer.age }}岁</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">电话：</span>
                <span class="text-gray-900">{{ customer.telephone }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">地址：</span>
                <span class="text-gray-900">{{ customer.address }}</span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 ml-4">
              <button
                @click="openEditModal(customer)"
                class="inline-flex items-center px-3 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                编辑
              </button>
              <button
                @click="handleDelete(customer)"
                class="inline-flex items-center px-3 py-1 border border-red-600 rounded text-sm font-medium text-red-600 hover:bg-red-50"
              >
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