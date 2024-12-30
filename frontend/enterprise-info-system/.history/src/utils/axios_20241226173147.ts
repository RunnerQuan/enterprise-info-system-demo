import axios from 'axios'
import { useMessage } from '@/composables/useMessage'

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { showError } = useMessage()
    if (error.response) {
      // 服务器返回错误信息
      showError(error.response.data.error || '请求失败')
    } else if (error.request) {
      // 请求发出但没有收到响应
      showError('无法连接到服务器')
    } else {
      // 请求配置出错
      showError('请求配置错误')
    }
    return Promise.reject(error)
  }
)

export default instance 