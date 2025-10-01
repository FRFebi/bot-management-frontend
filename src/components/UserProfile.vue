<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="avatar">
        {{ userInitials }}
      </div>
      <div class="user-details">
        <h2>{{ authStore.user?.name }}</h2>
        <p class="email">{{ authStore.user?.email }}</p>
        <span class="role-badge" :class="roleClass">
          {{ authStore.user?.role }}
        </span>
      </div>
    </div>

    <div class="profile-section">
      <h3>Account Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <label>User ID</label>
          <span>{{ authStore.user?.id }}</span>
        </div>
        <div class="info-item">
          <label>Role</label>
          <span class="capitalize">{{ authStore.user?.role }}</span>
        </div>
        <div class="info-item">
          <label>Email</label>
          <span>{{ authStore.user?.email }}</span>
        </div>
        <div class="info-item">
          <label>Session Type</label>
          <span>{{ authStore.rememberMe ? 'Persistent' : 'Session' }}</span>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <h3>Permissions</h3>
      <ul class="permissions-list">
        <li v-if="authStore.isAdmin">
          <span class="permission-icon">✓</span>
          Full administrative access
        </li>
        <li v-if="authStore.isAdmin">
          <span class="permission-icon">✓</span>
          Manage users and roles
        </li>
        <li>
          <span class="permission-icon">✓</span>
          View bots and schedules
        </li>
        <li v-if="authStore.isAdmin">
          <span class="permission-icon">✓</span>
          Create and modify bots
        </li>
        <li v-if="authStore.isViewer">
          <span class="permission-icon">✗</span>
          Limited to read-only access
        </li>
      </ul>
    </div>

    <div class="profile-actions">
      <button @click="handleLogout" class="logout-btn">
        Logout
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const roleClass = computed(() => {
  return {
    'role-admin': authStore.isAdmin,
    'role-viewer': authStore.isViewer
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.user-details h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.user-details .email {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-admin {
  background: #e3f2fd;
  color: #1976d2;
}

.role-viewer {
  background: #f3e5f5;
  color: #7b1fa2;
}

.profile-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-section h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.info-item span {
  color: #333;
  font-size: 0.95rem;
}

.capitalize {
  text-transform: capitalize;
}

.permissions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.permissions-list li {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.permissions-list li:last-child {
  border-bottom: none;
}

.permission-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
}

.permissions-list li:has(.permission-icon:contains('✓')) .permission-icon {
  background: #e8f5e9;
  color: #4caf50;
}

.permissions-list li:has(.permission-icon:contains('✗')) .permission-icon {
  background: #ffebee;
  color: #f44336;
}

.profile-actions {
  display: flex;
  justify-content: flex-end;
}

.logout-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #d32f2f;
}
</style>
