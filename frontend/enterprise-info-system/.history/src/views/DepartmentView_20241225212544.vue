<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDepartmentStore } from '@/stores/department'
import { useMessage } from '@/composables/useMessage'
import DepartmentForm from '@/components/DepartmentForm.vue'
import type { Department } from '@/types'

const departmentStore = useDepartmentStore()
const { showSuccess, showError } = useMessage()

const showAddModal = ref(false)
const showEditModal = ref(false)
const currentDepartment = ref<Department | null>(null)

// 加载部门列表
onMounted(async () => {
  try {
    await departmentStore.loadDepartments()
  } catch (error) {
    showError('加载部门列表失败')
  }
})

// 添加部门
const handleAdd = async (departmentData: Omit<Department, 'deptNo'>) => {
  try {
    await departmentStore.addDepartment(departmentData)
    showSuccess('添加部门成功')
    showAddModal.value = false
  } catch (error) {
    showError('添加部门失败')
  }
}

// 编辑部门
const handleEdit = async (department: Department) => {
  try {
    await departmentStore.updateDepartment(department)
    showSuccess('更新部门成功')
    showEditModal.value = false
    currentDepartment.value = null
  } catch (error) {
    showError('更新部门失败')
  }
}

// 删除部门
const handleDelete = async (department: Department) => {
  if (!confirm(`确定要删除部门 ${department.deptName} 吗？`)) {
    return
  }
  
  try {
    await departmentStore.deleteDepartment(department.deptNo)
    showSuccess('删除部门成功')
  } catch (error) {
    showError('删除部门失败')
  }
}

const openEditModal = (department: Department) => {
  currentDepartment.value = department
  showEditModal.value = true
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-900">部门管理</h2>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        添加部门
      </button>
    </div>

    <!-- 部门列表 -->
    <div class="bg-white shadow rounded-lg">
      <ul v-if="departmentStore.departments.length" class="divide-y divide-gray-200">
        <li v-for="department in departmentStore.departments" :key="department.deptNo" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 flex-grow">
              <div class="flex items-center">
                <span class="text-gray-500 w-24">部门名称：</span>
                <span class="font-medium text-gray-900">{{ department.deptName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-24">部门人数：</span>
                <span class="text-gray-900">{{ department.deptPeopleCount }} 人</span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 ml-4">
              <button
                @click="openEditModal(department)"
                class="inline-flex items-center px-3 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                编辑
              </button>
              <button
                @click="handleDelete(department)"
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
          <p class="text-sm text-gray-500">暂无部门信息</p>
        </div>
      </div>
    </div>

    <!-- 添加部门对话框 -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">添加部门</h3>
        <DepartmentForm
          @submit="handleAdd"
          @cancel="showAddModal = false"
        />
      </div>
    </div>

    <!-- 编辑部门对话框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">编辑部门</h3>
        <DepartmentForm
          v-if="currentDepartment"
          :department="currentDepartment"
          :is-edit="true"
          @submit="handleEdit"
          @cancel="showEditModal = false"
        />
      </div>
    </div>
  </div>
</template> 