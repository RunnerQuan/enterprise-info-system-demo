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
  } catch (error) {
    showError('加载员工列表失败')
  }
})

// 添加员工
const handleAdd = async (employeeData: Omit<Employee, 'empNo'>) => {
  try {
    await employeeStore.addEmployee(employeeData)
    showSuccess('添加员工成功')
    showAddModal.value = false
  } catch (error) {
    showError('添加员工失败')
  }
}

// 编辑员工
const handleEdit = async (employee: Employee) => {
  try {
    await employeeStore.updateEmployee(employee)
    showSuccess('更新员工成功')
    showEditModal.value = false
    currentEmployee.value = null
  } catch (error) {
    showError('更新员工失败')
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
  } catch (error) {
    showError('删除员工失败')
  }
}

const openEditModal = (employee: Employee) => {
  currentEmployee.value = employee
  showEditModal.value = true
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
        <li v-for="employee in employeeStore.employees" :key="employee.empNo" class="p-4 hover:bg-gray-50">
          <div class="flex justify-between items-start">
            <div class="grid grid-cols-2 gap-x-8 gap-y-2 flex-grow">
              <div class="flex items-center">
                <span class="text-gray-500 w-16">姓名：</span>
                <span class="font-medium text-gray-900">{{ employee.firstName }}{{ employee.lastName }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">性别：</span>
                <span class="text-gray-900">{{ employee.gender ? '男' : '女' }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">生日：</span>
                <span class="text-gray-900">{{ employee.birthday }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">入职：</span>
                <span class="text-gray-900">{{ employee.hireDate }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">电话：</span>
                <span class="text-gray-900">{{ employee.telephone }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-16">地址：</span>
                <span class="text-gray-900">{{ employee.address }}</span>
              </div>
            </div>
            
            <!-- 操作按钮 -->
            <div class="flex space-x-2 ml-4">
              <button
                @click="openEditModal(employee)"
                class="inline-flex items-center px-3 py-1 border border-indigo-600 rounded text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                编辑
              </button>
              <button
                @click="handleDelete(employee)"
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