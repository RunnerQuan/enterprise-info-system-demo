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

// 初始化数据
onMounted(async () => {
  try {
    console.log('Loading dashboard data...') // 添加日志
    await Promise.all([
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments()
    ])
    console.log('Dashboard data loaded successfully') // 添加日志
  } catch (err) {
    console.error('Failed to load dashboard data:', err) // 添加错误日志
  }
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">仪表盘</h1>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    
    <!-- 数据展示 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">总员工数</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalEmployees }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">部门数量</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ totalDepartments }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">男性员工</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ maleEmployees }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-gray-500 text-sm font-medium">女性员工</h3>
        <p class="mt-2 text-3xl font-bold text-gray-900">{{ femaleEmployees }}</p>
      </div>
    </div>
  </div>
</template> 