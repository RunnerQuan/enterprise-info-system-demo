import axios from 'axios'

const instance = axios.create({
  baseURL: '/api'
})

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 处理未认证情况
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance 