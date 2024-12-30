import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'

// 模拟用户数据
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'user', password: 'user123', role: 'User' }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  const login = async (username: string, password: string) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟验证
    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    )
    
    if (foundUser) {
      user.value = {
        userID: 1, // 模拟ID
        username: foundUser.username,
        role: foundUser.role as 'Admin' | 'User'
      }
      isAuthenticated.value = true
      return true
    }
    
    throw new Error('用户名或密码错误')
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
}) 