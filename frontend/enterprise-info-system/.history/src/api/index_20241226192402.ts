import axios from 'axios'

// 创建一个全局的 axios 实例
export const api = axios.create({
  baseURL: 'http://localhost:8080'  // 注意这里不要加 /api
})

// 添加请求拦截器
api.interceptors.request.use(config => {
  // 可以在这里添加 token 等认证信息
  return config
})

// 添加响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
) 