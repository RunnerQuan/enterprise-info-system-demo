<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customer'
import { useEmployeeStore } from '@/stores/employee'
import { useDepartmentStore } from '@/stores/department'
import { useEmployeeDepartmentStore } from '@/stores/employeeDepartment'
import * as echarts from 'echarts'

const router = useRouter()
const customerStore = useCustomerStore()
const employeeStore = useEmployeeStore()
const departmentStore = useDepartmentStore()
const employeeDepartmentStore = useEmployeeDepartmentStore()

const isLoading = ref(true)

// 添加 chart 相关的代码
const departmentChartRef = ref<HTMLElement>()
let departmentChart: echarts.ECharts | null = null

// 加载所有数据
onMounted(async () => {
  try {
    await Promise.all([
      customerStore.loadCustomers(),
      employeeStore.loadEmployees(),
      departmentStore.loadDepartments(),
      employeeDepartmentStore.loadEmployeeDepartments()
    ])
  } finally {
    isLoading.value = false
    // 确保 DOM 已更新后初始化图表
    await nextTick()
    initDepartmentChart()
  }
})

// 添加初始化图表的方法
const initDepartmentChart = () => {
  if (!departmentChartRef.value) return
  
  departmentChart = echarts.init(departmentChartRef.value)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
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
    series: [
      {
        name: '部门人数',
        type: 'bar',
        data: departmentDistribution.value.map(item => item.value),
        itemStyle: {
          color: '#6366f1'
        },
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  }
  
  departmentChart.setOption(option)
}

// 添加窗口大小变化的监听
window.addEventListener('resize', () => {
  departmentChart?.resize()
})

// 统计数据
const stats = computed(() => ({
  customers: customerStore.customers.length,
  employees: employeeStore.employees.length,
  departments: departmentStore.departments.length,
  activeEmployeeDepartments: employeeDepartmentStore.employeeDepartmentDetails.filter(ed => ed.edStatus === 1).length
}))

// 部门员工分布数据
const departmentDistribution = computed(() => 
  departmentStore.departments.map(dept => ({
    name: dept.deptName,
    value: dept.deptPeopleCount
  }))
)

// 性别分布数据
const genderDistribution = computed(() => {
  const male = employeeStore.employees.filter(e => e.gender === 1).length
  const female = employeeStore.employees.filter(e => e.gender === 0).length
  return [
    { name: '男', value: male },
    { name: '女', value: female }
  ]
})

const navigateTo = (path: string) => {
  router.push(path)
}

const filteredData = computed(() => data.value?.filter(...) ?? [])
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">欢迎使用企业信息管理系统</h2>
        <p class="mt-1 text-sm text-gray-500">
          当前用户：<span class="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800">user</span>
        </p>
      </div>
      <div class="text-sm text-gray-500">
        {{ new Date().toLocaleDateString() }} {{ new Date().toLocaleTimeString() }}
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 客户统计 -->
      <div
        @click="navigateTo('/customers')"
        class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-75">客户总数</p>
            <p class="text-3xl font-bold mt-1">{{ stats.customers }}</p>
          </div>
          <div class="bg-white/20 p-3 rounded-lg">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="opacity-75">点击管理客户信息</span>
        </div>
      </div>

      <!-- 员工统计 -->
      <div
        @click="navigateTo('/employees')"
        class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-75">员工总数</p>
            <p class="text-3xl font-bold mt-1">{{ stats.employees }}</p>
          </div>
          <div class="bg-white/20 p-3 rounded-lg">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="opacity-75">点击管理员工信息</span>
        </div>
      </div>

      <!-- 部门统计 -->
      <div
        @click="navigateTo('/departments')"
        class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-75">部门总数</p>
            <p class="text-3xl font-bold mt-1">{{ stats.departments }}</p>
          </div>
          <div class="bg-white/20 p-3 rounded-lg">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="opacity-75">点击管理部门信息</span>
        </div>
      </div>

      <!-- 在职员工统计 -->
      <div
        @click="navigateTo('/employee-departments')"
        class="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-75">在职员工</p>
            <p class="text-3xl font-bold mt-1">{{ stats.activeEmployeeDepartments }}</p>
          </div>
          <div class="bg-white/20 p-3 rounded-lg">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <span class="opacity-75">点击管理员工部门关系</span>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 部门人员分布 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">部门人员分布</h3>
        <div ref="departmentChartRef" class="h-80"></div>
      </div>

      <!-- 员工性别分布 -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">员工性别分布</h3>
        <div class="h-80 flex items-center justify-center">
          <div class="flex items-center space-x-8">
            <div class="text-center">
              <div class="relative w-32 h-32">
                <svg class="transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    class="text-gray-200"
                    stroke-width="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    class="text-blue-500 transition-all duration-1000"
                    stroke-width="10"
                    :stroke-dasharray="2 * Math.PI * 45"
                    :stroke-dashoffset="2 * Math.PI * 45 * (1 - genderDistribution[0].value / stats.employees)"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-xl font-bold text-blue-500">{{ genderDistribution[0].value }}</div>
                    <div class="text-sm text-gray-500">男</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div class="relative w-32 h-32">
                <svg class="transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    class="text-gray-200"
                    stroke-width="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    class="text-pink-500 transition-all duration-1000"
                    stroke-width="10"
                    :stroke-dasharray="2 * Math.PI * 45"
                    :stroke-dashoffset="2 * Math.PI * 45 * (1 - genderDistribution[1].value / stats.employees)"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <div class="text-center">
                    <div class="text-xl font-bold text-pink-500">{{ genderDistribution[1].value }}</div>
                    <div class="text-sm text-gray-500">女</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷功能区 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        @click="navigateTo('/employee-search')"
        class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex items-center space-x-4">
          <div class="bg-indigo-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">员工查询</h3>
            <p class="text-sm text-gray-500">快速查找员工信息</p>
          </div>
        </div>
      </div>

      <div
        @click="navigateTo('/customers')"
        class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex items-center space-x-4">
          <div class="bg-green-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">添加客户</h3>
            <p class="text-sm text-gray-500">新增客户信息</p>
          </div>
        </div>
      </div>

      <div
        @click="navigateTo('/employee-departments')"
        class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      >
        <div class="flex items-center space-x-4">
          <div class="bg-purple-100 p-3 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">部门调动</h3>
            <p class="text-sm text-gray-500">管理员工部门关系</p>
          </div>
        </div>
      </div>
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