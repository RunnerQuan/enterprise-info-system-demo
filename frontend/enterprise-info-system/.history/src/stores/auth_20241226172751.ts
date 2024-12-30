import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  
  const login = async (credentials: { username: string; password: string }) => {
    // 简单的密码验证
    if (credentials.password === 'admin') {
      isAuthenticated.value = true
      return true
    }
    throw new Error('密码错误')
  }

  const logout = () => {
    isAuthenticated.value = false
  }

  return {
    isAuthenticated,
    login,
    logout
  }
}) 