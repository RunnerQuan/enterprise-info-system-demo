import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    // 如果有token，添加到请求头
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const status = error.response.status
      // 如果是401未授权，清除token并跳转到登录页
      if (status === 401) {
        const authStore = useAuthStore()
        authStore.clearToken()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export { http } 