import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const TIMEOUT_DURATION = 30 * 60 * 1000 // 30 minutes
const WARNING_DURATION = 5 * 60 * 1000 // 5 minutes before timeout

export function useSessionTimeout() {
  const router = useRouter()
  const authStore = useAuthStore()

  let timeoutId: number | null = null
  let warningTimeoutId: number | null = null
  let lastActivity: number = Date.now()

  const resetTimeout = () => {
    lastActivity = Date.now()

    if (timeoutId) clearTimeout(timeoutId)
    if (warningTimeoutId) clearTimeout(warningTimeoutId)

    // Only set timeout if user is authenticated and not using remember me
    if (authStore.isAuthenticated && !authStore.rememberMe) {
      // Warning before logout
      warningTimeoutId = window.setTimeout(() => {
        console.warn('Session will expire in 5 minutes')
      }, TIMEOUT_DURATION - WARNING_DURATION)

      // Auto logout
      timeoutId = window.setTimeout(async () => {
        console.warn('Session expired due to inactivity')
        await authStore.logout()
        router.push('/login?reason=timeout')
      }, TIMEOUT_DURATION)
    }
  }

  const handleActivity = () => {
    // Only reset if more than 1 minute has passed since last activity
    if (Date.now() - lastActivity > 60000) {
      resetTimeout()
    }
  }

  const setupListeners = () => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })
  }

  const removeListeners = () => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.removeEventListener(event, handleActivity)
    })
  }

  onMounted(() => {
    if (authStore.isAuthenticated && !authStore.rememberMe) {
      setupListeners()
      resetTimeout()
    }
  })

  onUnmounted(() => {
    removeListeners()
    if (timeoutId) clearTimeout(timeoutId)
    if (warningTimeoutId) clearTimeout(warningTimeoutId)
  })

  return {
    resetTimeout
  }
}
