<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'
import { useMessage } from '@/composables/useMessage'
import EmployeeDepartmentForm from '@/components/EmployeeDepartmentForm.vue'
import type { EmployeeDepartment } from '@/types'

const employeeDepartmentStore = useEmployeeDepartmentStore()
const { showSuccess, showError } = useMessage()

const showAddModal = ref(false)
const showEditModal = ref(false)
const currentEmployeeDepartment = ref<EmployeeDepartment | null>(null)

// 加载员工部门关系列表
onMounted(async () => {
  try {
    await employeeDepartmentStore.loadEmployeeDepartments()
  } catch (error) {
    showError('加载员工部门关系列表失败')
  }
})

// 添加员工部门关系
const handleAdd = async (employeeDepartmentData: Omit<EmployeeDepartment, 'edID'>) => {
  try {
    await employeeDepartmentStore.addEmployeeDepartment(employeeDepartmentData)
    showSuccess('添加员工部门关系成功')
    showAddModal.value = false
  } catch (error) {
    showError('添加员工部门关系失败')
  }
}

// 编辑员工部门关系
const handleEdit = async (employeeDepartment: EmployeeDepartment) => {
  try {
    await employeeDepartmentStore.updateEmployeeDepartment(employeeDepartment)
    showSuccess('更新员工部门关系成功')
    showEditModal.value = false
    currentEmployeeDepartment.value = null
  } catch (error) {
    showError('更新员工部门关系失败')
  }
}

// 删除员工部门关系
const handleDelete = async (employeeDepartment: EmployeeDepartment) => {
  if (!confirm('确定要删除该员工部门关系吗？')) {
    return
  }
  
  try {
    await employeeDepartmentStore.deleteEmployeeDepartment(employeeDepartment.edID)
    showSuccess('删除员工部门关系成功')
  } catch (error) {
    showError('删除员工部门关系失败')
  }
}

const openEditModal = (employeeDepartment: EmployeeDepartment) => {
  currentEmployeeDepartment.value = employeeDepartment
  showEditModal.value = true
}

const getStatusText = (status: number) => status === 1 ? '隶属部门' : '离开部门'
const getStatusClass = (status: number) => status === 1 
  ? 'bg-green-100 text-green-800'
  : 'bg-red-100 text-red-800'
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">员工部门管理</h2>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        添加关系
      </button>
    </div>

    <!-- 员工部门关系列表 -->
    <div class="bg-white shadow rounded-lg">
      <ul v-if="employeeDepartmentStore.employeeDepartmentDetails.length" class="divide-y divide-gray-200">
        <li v-for="ed in employeeDepartmentStore.employeeDepartmentDetails" :key="ed.edID" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 flex-grow">
              <div class="flex items-center">
                <span class="text-gray-500 w-20">员工：</span>
                <span class="font-medium text-gray-900">{{ ed.employeeName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-20">部门：</span>
                <span class="text-gray-900">{{ ed.departmentName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-20">入职日期：</span>
                <span class="text-gray-900">{{ ed.edEntryDate }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-20">离职日期：</span>
                <span class="text-gray-900">{{ ed.edLeaveDate || '在职' }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-20">状态：</span>
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  ed.edStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ ed.edStatus === 1 ? '在职' : '离职' }}
                </span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 ml-4">
              <button
                @click="openEditModal(ed)"
                class="inline-flex items-center px-3 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                编辑
              </button>
              <button
                @click="handleDelete(ed)"
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
          <p class="text-sm text-gray-500">暂无员工部门关系信息</p>
        </div>
      </div>
    </div>

    <!-- 添加员工部门关系对话框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加员工部门关系</h3>
        <EmployeeDepartmentForm
          @submit="handleAdd"
          @cancel="showAddModal = false"
        />
      </div>
    </div>

    <!-- 编辑员工部门关系对话框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">编辑员工部门关系</h3>
        <EmployeeDepartmentForm
          v-if="currentEmployeeDepartment"
          :employee-department="currentEmployeeDepartment"
          :is-edit="true"
          @submit="handleEdit"
          @cancel="showEditModal = false"
        />
      </div>
    </div>
  </div>
</template> 