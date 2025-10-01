<template>
  <div id="app">
    <header v-if="authStore.isAuthenticated" class="header">
      <div class="header-left">
        <h1>Bot Management Dashboard</h1>
        <nav>
          <router-link to="/">Dashboard</router-link>
          <router-link to="/bots">Bots</router-link>
          <router-link v-if="authStore.isAdmin" to="/users">Users</router-link>
        </nav>
      </div>

      <div class="user-menu">
        <router-link to="/profile" class="user-info">
          <span class="user-name">{{ authStore.user?.name }}</span>
          <span class="user-role">{{ authStore.user?.role }}</span>
        </router-link>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <main class="main" :class="{ 'no-header': !authStore.isAuthenticated }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'
import { useSessionTimeout } from './composables/useSessionTimeout'

const authStore = useAuthStore()
const router = useRouter()

// Setup session timeout monitoring
useSessionTimeout()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.header nav {
  display: flex;
  gap: 0.5rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.header nav a:hover,
.header nav a.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.user-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  opacity: 0.8;
  text-transform: capitalize;
}

.logout-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main {
  padding: 2rem;
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
}

.main.no-header {
  padding: 0;
  min-height: 100vh;
}
</style>