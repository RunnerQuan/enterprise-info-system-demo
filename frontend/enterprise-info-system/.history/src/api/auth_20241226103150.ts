import axios from 'axios'
import CryptoJS from 'crypto-js'

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
})

export interface LoginRequest {
  username: string
  password_hash: string
}

export interface RegisterRequest {
  username: string
  password_hash: string
  role?: string
}

export interface User {
  user_id: number
  username: string
  role: string
}

export interface ApiResponse<T = any> {
  message: string
  error?: string
  user?: T
}

// 密码加密函数
const hashPassword = (password: string) => {
  return CryptoJS.SHA256(password).toString()
}

export const authApi = {
  login: async (data: { username: string; password: string }) => {
    const hashedPassword = hashPassword(data.password)
    const response = await api.post<ApiResponse<User>>('/login', {
      username: data.username,
      password_hash: hashedPassword
    })
    return response.data
  },

  register: async (data: { username: string; password: string; role?: string }) => {
    const hashedPassword = hashPassword(data.password)
    const response = await api.post<ApiResponse<User>>('/register', {
      username: data.username,
      password_hash: hashedPassword,
      role: data.role
    })
    return response.data
  }
} 