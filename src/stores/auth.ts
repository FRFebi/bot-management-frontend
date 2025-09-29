import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface LoginResponse {
  token: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isViewer = computed(() => user.value?.role === 'viewer')

  function setAuthData(authToken: string, userData: User) {
    token.value = authToken
    user.value = userData
    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  function clearAuthData() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  async function login(email: string, password: string): Promise<void> {
    try {
      const response = await api.post<LoginResponse>('/api/v1/auth/login', {
        email,
        password
      })
      setAuthData(response.data.token, response.data.user)
    } catch (error: any) {
      clearAuthData()
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthData()
    }
  }

  async function fetchMe(): Promise<void> {
    if (!token.value) return

    try {
      const response = await api.get<User>('/api/v1/me')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      clearAuthData()
      throw error
    }
  }

  async function refreshToken(): Promise<void> {
    if (!token.value) return

    try {
      const response = await api.post<{ token: string }>('/api/v1/auth/refresh')
      token.value = response.data.token
      localStorage.setItem('token', response.data.token)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
    } catch (error) {
      clearAuthData()
      throw error
    }
  }

  // Initialize api with token if exists
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    isViewer,
    login,
    logout,
    fetchMe,
    refreshToken
  }
})