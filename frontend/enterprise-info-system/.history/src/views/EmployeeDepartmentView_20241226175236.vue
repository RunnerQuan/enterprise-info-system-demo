<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'
import { useMessage } from '@/composables/useMessage'
import EmployeeDepartmentForm from '@/components/EmployeeDepartmentForm.vue'
import type { EmployeeDepartment, DepartmentRelation } from '@/types'

const employeeDepartmentStore = useEmployeeDepartmentStore()
const { showSuccess, showError } = useMessage()

const showAddModal = ref(false)
const showEditModal = ref(false)
const currentDepartment = ref<DepartmentRelation | null>(null)

onMounted(async () => {
  try {
    await employeeDepartmentStore.loadEmployeeDepartments()
  } catch (error: any) {
    showError(error.response?.data?.error || '加载员工部门关系失败')
  }
})

const handleAdd = async (data: Omit<EmployeeDepartment, 'edID'>) => {
  try {
    await employeeDepartmentStore.addEmployeeDepartment(data)
    showSuccess('添加部门关系成功')
    showAddModal.value = false
  } catch (error: any) {
    showError(error.response?.data?.error || '添加部门关系失败')
  }
}

const handleEdit = async (data: EmployeeDepartment) => {
  try {
    await employeeDepartmentStore.updateEmployeeDepartment(data.edID, data)
    showSuccess('更新部门关系成功')
    showEditModal.value = false
    currentDepartment.value = null
  } catch (error: any) {
    showError(error.response?.data?.error || '更新部门关系失败')
  }
}

const handleDelete = async (relation: DepartmentRelation) => {
  if (!confirm('确定要删除该部门关系吗？')) {
    return
  }

  try {
    await employeeDepartmentStore.deleteEmployeeDepartment(relation.edID)
    showSuccess('删除部门关系成功')
  } catch (error: any) {
    showError(error.response?.data?.error || '删除部门关系失败')
  }
}

const openEditModal = (relation: DepartmentRelation) => {
  currentDepartment.value = relation
  showEditModal.value = true
}

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString()
}

const getStatusText = (status: number) => status === 1 ? '在职' : '离职'
const getStatusClass = (status: number) => 
  status === 1 
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
        添加部门关系
      </button>
    </div>

    <!-- 员工部门列表 -->
    <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div v-for="group in employeeDepartmentStore.employeeDepartments" :key="group.empNo" class="p-6">
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ group.employeeName }}
            <span class="text-sm text-gray-500">(工号: {{ group.empNo }})</span>
          </h3>
        </div>

        <div class="space-y-4">
          <div v-for="dept in group.departments" :key="dept.edID" 
               class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div class="space-y-2">
              <div class="text-gray-900 font-medium">{{ dept.deptName }}</div>
              <div class="text-sm text-gray-500">
                入职时间: {{ formatDate(dept.edEntryDate) }}
                {{ dept.edLeaveDate ? `| 离职时间: ${formatDate(dept.edLeaveDate)}` : '' }}
              </div>
              <span 
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(dept.edStatus)
                ]"
              >
                {{ getStatusText(dept.edStatus) }}
              </span>
            </div>

            <div class="flex space-x-3">
              <button
                @click="openEditModal(dept)"
                class="inline-flex items-center px-3 py-1 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                编辑
              </button>
              <button
                @click="handleDelete(dept)"
                class="inline-flex items-center px-3 py-1 border border-red-600 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加对话框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加部门关系</h3>
        <EmployeeDepartmentForm
          @submit="handleAdd"
          @cancel="showAddModal = false"
        />
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">编辑部门关系</h3>
        <EmployeeDepartmentForm
          v-if="currentDepartment"
          :employee-department="currentDepartment"
          :is-edit="true"
          @submit="handleEdit"
          @cancel="showEditModal = false"
        />
      </div>
    </div>
  </div>
</template> 