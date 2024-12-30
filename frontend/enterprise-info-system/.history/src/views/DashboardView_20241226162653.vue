<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import { useDepartmentStore } from '@/stores/department'
import { useEmployeeStore } from '@/stores/employee'
import { storeToRefs } from 'pinia'

// 注册必须的组件
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent
])

const departmentStore = useDepartmentStore()
const employeeStore = useEmployeeStore()
const { departments } = storeToRefs(departmentStore)

// 部门分布图表选项
const departmentChartOption = computed(() => ({
  title: {
    text: '部门人员分布',
    left: 'center',
    textStyle: {
      color: '#374151',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
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
    data: departments.value.map(dept => dept.deptName),
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {
    type: 'value',
    name: '人数',
    minInterval: 1
  },
  series: [
    {
      name: '部门人数',
      type: 'bar',
      data: departments.value.map(dept => dept.deptPeopleCount),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#6366f1' },
            { offset: 1, color: '#818cf8' }
          ]
        },
        borderRadius: [4, 4, 0, 0]
      },
      emphasis: {
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#4f46e5' },
              { offset: 1, color: '#6366f1' }
            ]
          }
        }
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ]
}))

onMounted(async () => {
  await Promise.all([
    departmentStore.loadDepartments(),
    employeeStore.loadEmployees()
  ])
})
</script>

<template>
  <div class="space-y-6 p-6">
    <h1 class="text-2xl font-bold text-gray-900">欢迎使用企业信息管理系统</h1>
    <div class="text-sm text-gray-600">
      当前用户：{{ $route.query.username }}
    </div>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- 客户总数 -->
      <div class="bg-blue-500 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">客户总数</div>
            <div class="text-3xl font-bold mt-2">7</div>
          </div>
          <div class="text-white opacity-80">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <router-link to="/customers" class="text-white hover:text-blue-100">
            点击管理客户信息
          </router-link>
        </div>
      </div>

      <!-- 员工总数 -->
      <div class="bg-green-500 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">员工总数</div>
            <div class="text-3xl font-bold mt-2">5</div>
          </div>
          <div class="text-white opacity-80">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <router-link to="/employees" class="text-white hover:text-green-100">
            点击管理员工信息
          </router-link>
        </div>
      </div>

      <!-- 部门总数 -->
      <div class="bg-purple-500 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">部门总数</div>
            <div class="text-3xl font-bold mt-2">12</div>
          </div>
          <div class="text-white opacity-80">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <router-link to="/departments" class="text-white hover:text-purple-100">
            点击管理部门信息
          </router-link>
        </div>
      </div>

      <!-- 在职员工 -->
      <div class="bg-red-500 rounded-lg p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm opacity-80">在职员工</div>
            <div class="text-3xl font-bold mt-2">2</div>
          </div>
          <div class="text-white opacity-80">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm">
          <router-link to="/employee-departments" class="text-white hover:text-red-100">
            点击管理员工部门关系
          </router-link>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 部门人员分布 -->
      <div class="bg-white rounded-lg p-6 shadow">
        <v-chart class="w-full h-[400px]" :option="departmentChartOption" />
      </div>

      <!-- 员工性别分布 -->
      <div class="bg-white rounded-lg p-6 shadow">
        <!-- 这里可以添加性别分布的饼图 -->
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