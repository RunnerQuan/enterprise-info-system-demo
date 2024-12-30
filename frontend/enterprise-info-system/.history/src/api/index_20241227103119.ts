import axios from 'axios'

// 创建一个全局的 axios 实例
export const api = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加响应拦截器处理错误
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 处理后端返回的错误
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
) 