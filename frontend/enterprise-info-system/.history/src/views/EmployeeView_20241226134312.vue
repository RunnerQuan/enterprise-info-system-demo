<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useMessage } from '@/composables/useMessage'
import EmployeeForm from '@/components/EmployeeForm.vue'
import type { Employee } from '@/types'

const employeeStore = useEmployeeStore()
const { showSuccess, showError } = useMessage()

const showAddModal = ref(false)
const showEditModal = ref(false)
const currentEmployee = ref<Employee | null>(null)

// 加载员工列表
onMounted(async () => {
  try {
    await employeeStore.loadEmployees()
  } catch (error: any) {
    showError(error.response?.data?.error || '加载员工列表失败')
  }
})

// 添加员工
const handleAdd = async (employeeData: Omit<Employee, 'empNo'>) => {
  try {
    await employeeStore.addEmployee(employeeData)
    showSuccess('添加员工成功')
    showAddModal.value = false
  } catch (error: any) {
    showError(error.response?.data?.error || '添加员工失败')
  }
}

// 编辑员工
const handleEdit = async (employee: Employee) => {
  try {
    await employeeStore.updateEmployee(employee)
    showSuccess('更新员工成功')
    showEditModal.value = false
    currentEmployee.value = null
  } catch (error: any) {
    showError(error.response?.data?.error || '更新员工失败')
  }
}

// 删除员工
const handleDelete = async (employee: Employee) => {
  if (!confirm(`确定要删除员工 ${employee.firstName}${employee.lastName} 吗？`)) {
    return
  }
  
  try {
    await employeeStore.deleteEmployee(employee.empNo)
    showSuccess('删除员工成功')
  } catch (error: any) {
    showError(error.response?.data?.error || '删除员工失败')
  }
}

const openEditModal = (employee: Employee) => {
  currentEmployee.value = employee
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

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">员工管理</h2>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        添加员工
      </button>
    </div>

    <!-- 员工列表 -->
    <div class="bg-white shadow rounded-lg">
      <ul v-if="employeeStore.employees.length" class="divide-y divide-gray-200">
        <li v-for="employee in employeeStore.employees" :key="employee.empNo" 
            class="p-3 hover:bg-gray-50">
          <div class="flex justify-between items-center">
            <!-- 头像和基本信息 -->
            <div class="flex items-center space-x-4 flex-1">
              <!-- 头像 -->
              <div 
                :class="[
                  'flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-lg',
                  getAvatarColor(employee.lastName)
                ]"
              >
                {{ employee.lastName }}
              </div>

              <!-- 所有信息放在一行 -->
              <div class="flex items-center space-x-6 flex-1">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">
                    {{ employee.lastName }}{{ employee.firstName }}
                  </span>
                  <span 
                    class="px-2 py-0.5 text-sm font-medium rounded-full"
                    :class="employee.gender ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'"
                  >
                    {{ employee.gender ? '男' : '女' }}
                  </span>
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ formatDate(employee.hireDate) }}
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {{ employee.telephone }}
                </div>

                <div class="flex items-center text-sm text-gray-600">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {{ employee.address }}
                </div>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 ml-4">
              <button
                @click="openEditModal(employee)"
                class="inline-flex items-center px-2.5 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                编辑
              </button>
              <button
                @click="handleDelete(employee)"
                class="inline-flex items-center px-2.5 py-1 border border-red-600 rounded text-sm font-medium text-red-600 hover:bg-red-50"
              >
                删除
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="py-8">
        <div class="text-center">
          <p class="text-sm text-gray-500">暂无员工信息</p>
        </div>
      </div>
    </div>

    <!-- 添加员工对话框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加员工</h3>
        <EmployeeForm
          @submit="handleAdd"
          @cancel="showAddModal = false"
        />
      </div>
    </div>

    <!-- 编辑员工对话框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">编辑员工</h3>
        <EmployeeForm
          v-if="currentEmployee"
          :employee="currentEmployee"
          :is-edit="true"
          @submit="handleEdit"
          @cancel="showEditModal = false"
        />
      </div>
    </div>
  </div>
</template> 