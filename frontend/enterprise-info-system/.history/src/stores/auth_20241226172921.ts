import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authApi, type User } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const login = async (credentials: { username: string; password: string }) => {
    const response = await authApi.login(credentials)
    if (response.user) {
      user.value = response.user
      isAuthenticated.value = true
    } else {
      throw new Error(response.error || '登录失败')
    }
  }

  const register = async (data: { username: string; password: string; role?: string }) => {
    const response = await authApi.register(data)
    if (response.user) {
      user.value = response.user
      isAuthenticated.value = true
    } else {
      throw new Error(response.error || '注册失败')
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
}) 