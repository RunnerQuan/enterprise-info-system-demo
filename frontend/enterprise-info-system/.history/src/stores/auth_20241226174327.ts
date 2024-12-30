import { defineStore } from 'pinia'
import { ref } from 'vue'
import { http } from '@/utils/http'
import { useRouter } from 'vue-router'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const router = useRouter()

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await http.post<{ token: string; user: User }>('/api/login', credentials)
      const { token, user: userData } = response.data
      
      // 保存 token 到 localStorage
      localStorage.setItem('token', token)
      
      // 更新状态
      user.value = userData
      isAuthenticated.value = true
      
      // 登录成功后跳转到仪表盘
      await router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    user.value = null
    isAuthenticated.value = false
    router.push('/login')
  }

  // 初始化时检查 token
  const initializeAuth = () => {
    const token = localStorage.getItem('token')
    if (token) {
      isAuthenticated.value = true
      // 可以在这里添加获取用户信息的逻辑
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
}) 