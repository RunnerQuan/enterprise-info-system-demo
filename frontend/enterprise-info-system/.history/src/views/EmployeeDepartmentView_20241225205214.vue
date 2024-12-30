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
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">员工部门管理</h2>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        添加员工部门关系
      </button>
    </div>

    <!-- 员工部门关系列表 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul v-if="employeeDepartmentStore.employeeDepartmentDetails.length" class="divide-y divide-gray-200">
        <li
          v-for="ed in employeeDepartmentStore.employeeDepartmentDetails"
          :key="ed.edID"
          class="px-6 py-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium text-gray-900">
                {{ ed.employeeName }}
                <span class="mx-2">→</span>
                {{ ed.departmentName }}
                <span
                  :class="[
                    'ml-2 px-2 py-1 text-xs font-medium rounded-full',
                    getStatusClass(ed.edStatus)
                  ]"
                >
                  {{ getStatusText(ed.edStatus) }}
                </span>
              </div>
              <div class="text-sm text-gray-500">
                入职日期: {{ ed.edEntryDate }}
                <template v-if="ed.edLeaveDate">
                  | 离职日期: {{ ed.edLeaveDate }}
                </template>
              </div>
            </div>
            <div class="flex space-x-3">
              <button
                @click="openEditModal(ed)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                编辑
              </button>
              <button
                @click="handleDelete(ed)"
                class="text-red-600 hover:text-red-900"
              >
                删除
              </button>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="py-12">
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