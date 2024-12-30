<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'

const router = useRouter()
const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const customerStore = useCustomerStore()
const employeeDepartmentStore = useEmployeeDepartmentStore()

// 使用 storeToRefs 来保持响应性
const { employees, isLoading: isEmployeesLoading, error: employeesError } = storeToRefs(employeeStore)
const { departments, isLoading: isDepartmentsLoading, error: departmentsError } = storeToRefs(departmentStore)

// 合并加载状态
const isLoading = computed(() => isEmployeesLoading.value || isDepartmentsLoading.value)
const error = computed(() => employeesError.value || departmentsError.value)

// 统计数据
const stats = computed(() => ({
  customers: customerStore.customers.length,
  employees: employeeStore.employees.length,
  departments: departmentStore.departments.length,
  activeEmployeeDepartments: employeeDepartmentStore.employeeDepartmentDetails.filter(ed => ed.edStatus === 1).length
}))

// 性别分布数据
const genderDistribution = computed(() => {
  const male = employees.value?.filter(e => e.gender === 1).length ?? 0
  const female = employees.value?.filter(e => e.gender === 0).length ?? 0
  return [
    { name: '男', value: male },
    { name: '女', value: female }
  ]
})

// 部门分布数据
const departmentDistribution = computed(() => {
  if (!departments.value) return []
  return departments.value.map(dept => ({
    name: dept.deptName,
    value: dept.deptPeopleCount
  }))
})

// 图表相关
const departmentChartRef = ref<HTMLElement>()
let departmentChart: echarts.ECharts | null = null

// 导航方法
const navigateTo = (path: string) => {
  router.push(path)
}

// 初始化部门图表
const initDepartmentChart = () => {
  if (!departmentChartRef.value) return
  
  departmentChart = echarts.init(departmentChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: departmentDistribution.value.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [{
      name: '部门人数',
      type: 'bar',
      data: departmentDistribution.value.map(item => item.value),
      itemStyle: { color: '#6366f1' },
      label: {
        show: true,
        position: 'top'
      }
    }]
  }
  
  departmentChart.setOption(option)
}

// 加载所有数据
onMounted(async () => {
  try {
    isLoading.value = true
    await Promise.all([
      customerStore.loadCustomers(),
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments(),
      employeeDepartmentStore.loadEmployeeDepartments()
    ])
    
    // 确保 DOM 已更新后初始化图表
    await nextTick()
    initDepartmentChart()
  } catch (err) {
    console.error('Failed to load dashboard data:', err)
  } finally {
    isLoading.value = false
  }
})

// 监听窗口大小变化
window.addEventListener('resize', () => {
  departmentChart?.resize()
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
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.employees }}</p>
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
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ stats.departments }}</p>
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
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ genderDistribution[0].value }}</p>
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
              <p class="mt-2 text-3xl font-bold text-gray-900">{{ genderDistribution[1].value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 部门人数统计 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">部门人数统计</h3>
        <div class="space-y-4">
          <div v-for="dept in departmentDistribution" :key="dept.name" class="flex items-center">
            <span class="flex-1 text-gray-600">{{ dept.name }}</span>
            <div class="flex-1">
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="bg-indigo-600 h-2.5 rounded-full" 
                     :style="{ width: `${(dept.value / stats.employees * 100) || 0}%` }"></div>
              </div>
            </div>
            <span class="ml-4 text-gray-900 font-medium">{{ dept.value }}人</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 