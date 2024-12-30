import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type User } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  
  const isAuthenticated = computed(() => !!token.value)
  
  const user = ref<User | null>(null)

  const login = async (credentials: { username: string; password: string }) => {
    const response = await authApi.login(credentials)
    if (response.user) {
      user.value = response.user
      token.value = response.token
    } else {
      throw new Error(response.error || '登录失败')
    }
  }

  const register = async (data: { username: string; password: string; role?: string }) => {
    const response = await authApi.register(data)
    if (response.user) {
      user.value = response.user
      token.value = response.token
    } else {
      throw new Error(response.error || '注册失败')
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
  }

  return {
    token,
    isAuthenticated,
    user,
    login,
    register,
    logout
  }
}) 