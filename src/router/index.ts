import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue'
import Bots from '../views/Bots.vue'
import BotDetail from '../views/BotDetail.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Users from '../views/Users.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/bots',
    name: 'Bots',
    component: Bots,
    meta: { requiresAuth: true }
  },
  {
    path: '/bots/:id',
    name: 'BotDetail',
    component: BotDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin === true)

  if (requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login if trying to access protected route
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Redirect to dashboard if already logged in
    next({ name: 'Dashboard' })
  } else if (requiresAdmin && !authStore.isAdmin) {
    // Redirect to dashboard if trying to access admin route without admin role
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router