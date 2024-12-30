import { defineStore } from 'pinia'
import { ref } from 'vue'

// 模拟用户数据
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', role: 'Admin' },
  { username: 'user', password: 'user123', role: 'User' }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ username: string; role: string } | null>(null)
  const isAuthenticated = ref(false)

  const login = async (credentials: { username: string; password: string }) => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = MOCK_USERS.find(
      u => u.username === credentials.username && u.password === credentials.password
    )
    
    if (!foundUser) {
      throw new Error('Invalid credentials')
    }

    user.value = {
      username: foundUser.username,
      role: foundUser.role
    }
    isAuthenticated.value = true
  }

  const logout = async () => {
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