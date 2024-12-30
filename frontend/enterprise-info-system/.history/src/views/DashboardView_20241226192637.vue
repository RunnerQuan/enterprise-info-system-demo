<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'

const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()

// 使用 storeToRefs 来保持响应性
const { employees, isLoading: isEmployeesLoading, error: employeesError } = storeToRefs(employeeStore)
const { departments, isLoading: isDepartmentsLoading, error: departmentsError } = storeToRefs(departmentStore)

// 合并加载状态
const isLoading = computed(() => isEmployeesLoading.value || isDepartmentsLoading.value)
const error = computed(() => employeesError.value || departmentsError.value)

// 统计数据
const totalEmployees = computed(() => employees.value?.length ?? 0)
const totalDepartments = computed(() => departments.value?.length ?? 0)
const maleEmployees = computed(() => employees.value?.filter(emp => emp.gender === 1).length ?? 0)
const femaleEmployees = computed(() => employees.value?.filter(emp => emp.gender === 0).length ?? 0)

// 部门人数统计
const departmentStats = computed(() => {
  if (!departments.value) return []
  return departments.value.map(dept => ({
    name: dept.deptName,
    count: dept.deptPeopleCount
  }))
})

// 初始化数据
onMounted(async () => {
  try {
    console.log('Loading dashboard data...')
    await Promise.all([
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments()
    ])
    console.log('Dashboard data loaded successfully')
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">企业信息管理系统</h1>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    
    <!-- 数据展示 -->
    <div v-else>
      <!-- 主要统计数据 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- 总员工数 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100">
              <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-gray-500 text-sm font-medium">总员工数</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalEmployees }}</p>
            </div>
          </div>
        </div>
        
        <!-- 部门数量 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-gray-500 text-sm font-medium">部门数量</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalDepartments }}</p>
            </div>
          </div>
        </div>
        
        <!-- 男性员工 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100">
              <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-gray-500 text-sm font-medium">男性员工</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ maleEmployees }}</p>
            </div>
          </div>
        </div>
        
        <!-- 女性员工 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-pink-100">
              <svg class="h-8 w-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-gray-500 text-sm font-medium">女性员工</h3>
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ femaleEmployees }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门人数统计 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">部门人数统计</h3>
        <div class="space-y-4">
          <div v-for="dept in departmentStats" :key="dept.name" class="flex items-center">
            <span class="flex-1 text-gray-600">{{ dept.name }}</span>
            <div class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-indigo-600 h-2.5 rounded-full" 
                     :style="{ width: `${(dept.count / totalEmployees * 100) || 0}%` }"></div>
              </div>
            </div>
            <span class="ml-4 text-gray-900 font-medium">{{ dept.count }}人</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 