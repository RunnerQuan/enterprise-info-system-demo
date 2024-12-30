import { ref } from 'vue'

interface Message {
  type: 'success' | 'error'
  content: string
}

const message = ref<Message | null>(null)
const isVisible = ref(false)

export const useMessage = () => {
  const showMessage = (type: 'success' | 'error', content: string) => {
    message.value = { type, content }
    isVisible.value = true
    
    setTimeout(() => {
      isVisible.value = false
      message.value = null
    }, 3000)
  }

  const showSuccess = (content: string) => showMessage('success', content)
  const showError = (content: string) => showMessage('error', content)

  return {
    message,
    isVisible,
    showSuccess,
    showError
  }
} 