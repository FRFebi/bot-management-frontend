import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Bots from '../views/Bots.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/bots',
    name: 'Bots',
    component: Bots
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router