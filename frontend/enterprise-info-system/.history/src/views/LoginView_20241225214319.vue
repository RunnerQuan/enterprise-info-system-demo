<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useMessage } from '@/composables/useMessage'

const router = useRouter()
const authStore = useAuthStore()
const { showError } = useMessage()

const form = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    showError('请输入用户名和密码')
    return
  }

  isLoading.value = true
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (error) {
    showError('登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full bg-white rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
      <!-- 登录表单卡片 -->
      <div class="p-8">
        <!-- 标题区域 -->
        <div class="text-center mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">
            企业信息管理系统
          </h2>
          <p class="text-sm text-gray-600">请登录以继续使用系统</p>
        </div>

        <!-- 登录表单 -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- 用户名输入框 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">用户名</label>
            <div class="mt-1 relative">
              <input
                v-model="form.username"
                type="text"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'animate-shake': isLoading }"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <!-- 密码输入框 -->
          <div>
            <label class="block text-sm font-medium text-gray-700">密码</label>
            <div class="mt-1 relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                :class="{ 'animate-shake': isLoading }"
                placeholder="请输入密码"
              />
              <!-- 密码可见性切换按钮 -->
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  class="h-5 w-5 text-gray-400 hover:text-gray-500"
                  :class="{ 'text-indigo-500': showPassword }"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path v-if="!showPassword" d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path v-if="!showPassword" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path v-if="showPassword" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 12C18.268 7.943 14.478 5 10 5a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" />
                  <path v-if="showPassword" d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 12c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 登录按钮 -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              :class="{ 'opacity-75 cursor-not-allowed': isLoading }"
            >
              <template v-if="isLoading">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                登录中...
              </template>
              <template v-else>
                登录
              </template>
            </button>
          </div>

          <!-- 测试账号提示 -->
          <div class="mt-4 text-center text-sm text-gray-500">
            <p>测试账号：admin / admin123</p>
            <p>或 user / user123</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style> 