import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref<User | null>(null)
  
  const login = async (credentials: { username: string; password: string }) => {
    // 简单的密码验证
    if (credentials.password === 'admin') {
      isAuthenticated.value = true
      user.value = {
        userID: 1,
        username: credentials.username,
        role: 'Admin'
      }
      return true
    }
    throw new Error('密码错误')
  }

  const register = async (data: { username: string; password: string; role?: string }) => {
    // 简单的注册逻辑
    if (data.password) {
      isAuthenticated.value = true
      user.value = {
        userID: 1,
        username: data.username,
        role: data.role || 'User'
      }
      return true
    }
    throw new Error('注册失败')
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = null
  }

  return {
    isAuthenticated,
    user,
    login,
    register,
    logout
  }
}) 