<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'
import EmployeeSearchForm from '@/components/EmployeeSearchForm.vue'
import type { Employee } from '@/types'

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const employeeDepartmentStore = useEmployeeDepartmentStore()

const searchResults = ref<Employee[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments(),
      employeeDepartmentStore.loadEmployeeDepartments()
    ])
    // 初始显示所有员工
    searchResults.value = employeeStore.employees
  } catch (err: any) {
    error.value = err.message || '加载数据失败'
  } finally {
    isLoading.value = false
  }
})

const handleSearch = async (searchParams: {
  name: string
  department: string
  hireDateStart: string
  hireDateEnd: string
}) => {
  try {
    isLoading.value = true
    // 构造搜索参数
    const params = {
      ...searchParams,
      // 如果日期为空，则不传该参数
      hireDateStart: searchParams.hireDateStart || undefined,
      hireDateEnd: searchParams.hireDateEnd || undefined
    }
    searchResults.value = await employeeStore.searchEmployees(params)
  } catch (err: any) {
    error.value = err.message || '搜索失败'
  } finally {
    isLoading.value = false
  }
}

const handleReset = () => {
  error.value = null
  searchResults.value = employeeStore.employees
}

// 获取员工所属部门列表（只显示在职部门）
const getEmployeeDepartments = (empNo: number) => {
  const employeeData = employeeDepartmentStore.groupedEmployeeDepartments.find(
    e => e.empNo === empNo
  )
  // 只返回在职（edStatus = 1）的部门
  return employeeData?.departments.filter(dept => dept.edStatus === 1) || []
}

// 格式化日期显示
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold text-gray-900">员工信息查询</h2>

    <!-- 搜索表单 -->
    <EmployeeSearchForm
      @search="handleSearch"
      @reset="handleReset"
      class="transition-all duration-300 ease-in-out transform hover:shadow-lg"
    />

    <!-- 错误提示 -->
    <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="py-32 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>

      <template v-else>
        <!-- 搜索结果统计 -->
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <p class="text-sm text-gray-700">
            共找到 <span class="font-medium text-indigo-600">{{ searchResults.length }}</span> 条记录
          </p>
        </div>

        <!-- 结果列表 -->
        <div v-if="searchResults.length" class="divide-y divide-gray-200">
          <div
            v-for="employee in searchResults"
            :key="employee.empNo"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- 基本信息 -->
              <div class="space-y-2">
                <div class="flex items-center">
                  <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span class="text-indigo-600 font-medium">
                      {{ employee.lastName[0] }}
                    </span>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ employee.lastName }}{{ employee.firstName }}
                    </h3>
                    <p class="text-sm text-gray-500">工号：{{ employee.empNo }}</p>
                  </div>
                </div>
              </div>

              <!-- 部门信息 -->
              <div class="space-y-2">
                <h4 class="text-sm font-medium text-gray-500">所属部门</h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="dept in getEmployeeDepartments(employee.empNo)"
                    :key="dept.edID"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 transition-all duration-200 hover:bg-indigo-200"
                  >
                    {{ dept.departmentName }}
                  </span>
                </div>
              </div>

              <!-- 详细信息 -->
              <div class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">性别</p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ employee.gender ? '男' : '女' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">入职日期</p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ formatDate(employee.hireDate) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">联系电话</p>
                    <p class="mt-1 text-sm font-medium text-gray-900">
                      {{ employee.telephone }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">地址</p>
                    <p class="mt-1 text-sm font-medium text-gray-900 truncate" :title="employee.address">
                      {{ employee.address }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 无结果提示 -->
        <div v-else class="py-32 flex flex-col items-center justify-center">
          <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">未找到匹配的员工信息</h3>
          <p class="mt-1 text-sm text-gray-500">请尝试调整搜索条件后重试</p>
          <button
            @click="handleReset"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            重置搜索
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 