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

onMounted(async () => {
  try {
    await employeeDepartmentStore.loadEmployeeDepartments()
  } catch (error) {
    showError('加载员工部门关系列表失败')
  }
})

const handleAdd = async (employeeDepartmentData: Omit<EmployeeDepartment, 'edID'>) => {
  try {
    await employeeDepartmentStore.addEmployeeDepartment(employeeDepartmentData)
    showSuccess('添加员工部门关系成功')
    showAddModal.value = false
  } catch (error) {
    showError('添加员工部门关系失败')
  }
}

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

const getStatusText = (status: number) => status === 1 ? '在职' : '离职'
const getStatusClass = (status: number) => status === 1 
  ? 'bg-green-100 text-green-800'
  : 'bg-red-100 text-red-800'
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">员工部门管理</h2>
        <p class="mt-1 text-sm text-gray-500">管理员工与部门的关联关系</p>
      </div>
      <button
        @click="showAddModal = true"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        添加关系
      </button>
    </div>

    <!-- 员工部门关系列表 -->
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul v-if="employeeDepartmentStore.groupedEmployeeDepartments.length" class="divide-y divide-gray-200">
        <li v-for="employee in employeeDepartmentStore.groupedEmployeeDepartments" 
            :key="employee.empNo" 
            class="p-4 hover:bg-gray-50 transition-colors duration-200">
          <!-- 员工信息 -->
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <span class="text-indigo-700 font-medium">{{ employee.employeeName[0] }}</span>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900">{{ employee.employeeName }}</h3>
              <p class="text-sm text-gray-500">员工编号: {{ employee.empNo }}</p>
            </div>
          </div>
          
          <!-- 部门列表 -->
          <div class="ml-16 space-y-3">
            <div v-for="dept in employee.departments" 
                 :key="dept.edID"
                 class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-4">
                <!-- 部门信息 -->
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ dept.departmentName }}</div>
                    <div class="text-sm text-gray-500">
                      {{ dept.edEntryDate }} ~ {{ dept.edLeaveDate || '至今' }}
                    </div>
                  </div>
                </div>
                
                <!-- 状态标签 -->
                <span :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusClass(dept.edStatus)
                ]">
                  {{ getStatusText(dept.edStatus) }}
                </span>
              </div>
              
              <!-- 操作按钮 -->
              <div class="flex space-x-2">
                <button
                  @click="openEditModal({
                    edID: dept.edID,
                    empNo: employee.empNo,
                    deptNo: dept.deptNo,
                    edEntryDate: dept.edEntryDate,
                    edLeaveDate: dept.edLeaveDate,
                    edStatus: dept.edStatus
                  })"
                  class="inline-flex items-center px-2 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="handleDelete({
                    edID: dept.edID,
                    empNo: employee.empNo,
                    deptNo: dept.deptNo,
                    edEntryDate: dept.edEntryDate,
                    edLeaveDate: dept.edLeaveDate,
                    edStatus: dept.edStatus
                  })"
                  class="inline-flex items-center px-2 py-1 border border-red-600 rounded text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-else class="py-8">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">暂无员工部门关系信息</p>
        </div>
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <div v-if="showAddModal || showEditModal" 
         class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ showEditModal ? '编辑员工部门关系' : '添加员工部门关系' }}
          </h3>
          <button @click="showAddModal = showEditModal = false" 
                  class="text-gray-400 hover:text-gray-500">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <EmployeeDepartmentForm
          v-if="showEditModal"
          :employee-department="currentEmployeeDepartment"
          :is-edit="true"
          @submit="handleEdit"
          @cancel="showEditModal = false"
        />
        <EmployeeDepartmentForm
          v-else
          @submit="handleAdd"
          @cancel="showAddModal = false"
        />
      </div>
    </div>
  </div>
</template> 