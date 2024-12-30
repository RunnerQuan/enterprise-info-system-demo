<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-4">欢迎使用企业信息管理系统</h2>
    <p class="text-gray-600">
      当前用户: {{ authStore.user?.username }}
      <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
        {{ authStore.user?.role }}
      </span>
    </p>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <div class="bg-indigo-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold text-indigo-700">客户管理</h3>
        <p class="text-indigo-600 mt-2">管理客户信息和关系</p>
      </div>
      <div class="bg-green-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold text-green-700">员工管理</h3>
        <p class="text-green-600 mt-2">管理员工信息和状态</p>
      </div>
      <div class="bg-purple-50 p-6 rounded-lg">
        <h3 class="text-lg font-semibold text-purple-700">部门管理</h3>
        <p class="text-purple-600 mt-2">管理部门结构和人员</p>
      </div>
    </div>
  </div>
</template> 