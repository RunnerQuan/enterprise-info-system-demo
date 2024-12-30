<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navItems = [
  { name: '仪表盘', path: '/', icon: 'chart-bar' },
  { name: '客户管理', path: '/customers', icon: 'users' },
  { name: '员工管理', path: '/employees', icon: 'user-group' },
  { name: '部门管理', path: '/departments', icon: 'office-building' },
  { name: '员工部门', path: '/employee-departments', icon: 'template' },
  { name: '员工查询', path: '/employee-search', icon: 'search' },
]

const isActive = (path: string) => route.path === path

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <!-- Logo和系统名称 -->
        <div class="flex items-center">
          <div class="text-xl font-bold text-indigo-600">企业信息管理系统</div>
        </div>

        <!-- 导航链接 -->
        <div class="flex items-center space-x-4">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="group relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
            :class="[
              isActive(item.path)
                ? 'text-indigo-600 bg-indigo-50'
                : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
            ]"
          >
            <!-- 悬浮效果 -->
            <span class="relative z-10">{{ item.name }}</span>
            <div
              class="absolute bottom-0 left-0 h-0.5 bg-indigo-600 transition-all duration-200"
              :class="[
                isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
              ]"
            ></div>
          </router-link>

          <!-- 用户信息和退出按钮 -->
          <div class="flex items-center ml-4">
            <span class="text-sm text-gray-600 mr-4">
              欢迎, {{ authStore.user?.username }}
            </span>
            <button
              @click="handleLogout"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template> 