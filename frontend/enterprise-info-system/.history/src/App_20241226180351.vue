<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import MessageToast from './components/MessageToast.vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // 如果没有登录，重定向到登录页
  if (!authStore.isAuthenticated && router.currentRoute.value.name !== 'login') {
    router.push('/login')
  }
})
</script>

<template>
  <div class="w-full min-h-screen">
    <router-view />
    <MessageToast />
  </div>
</template>
