<template>
  <div class="bot-card">
    <div class="bot-header">
      <div class="bot-info">
        <h3>{{ bot.name }}</h3>
        <span class="bot-version">v{{ bot.version }}</span>
      </div>
      <span class="bot-status" :class="statusClass">
        <span class="status-dot"></span>
        {{ bot.status }}
      </span>
    </div>

    <p class="bot-description">{{ bot.description || 'No description' }}</p>

    <div class="bot-meta">
      <div class="meta-item">
        <span class="label">Created:</span>
        <span class="value">{{ formatDate(bot.created_at) }}</span>
      </div>
      <div class="meta-item">
        <span class="label">Updated:</span>
        <span class="value">{{ formatDate(bot.updated_at) }}</span>
      </div>
    </div>

    <div class="bot-actions">
      <button @click="$emit('view', bot.id)" class="btn-secondary">
        View Details
      </button>
      <button
        v-if="canControl"
        @click="$emit('edit', bot.id)"
        class="btn-secondary"
      >
        Edit
      </button>
      <button
        v-if="canControl && bot.status === 'stopped'"
        @click="$emit('start', bot.id)"
        class="btn-success"
      >
        Start
      </button>
      <button
        v-if="canControl && bot.status === 'running'"
        @click="$emit('stop', bot.id)"
        class="btn-danger"
      >
        Stop
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import type { Bot } from '../services/botService'

interface Props {
  bot: Bot
}

const props = defineProps<Props>()
const authStore = useAuthStore()

defineEmits<{
  view: [id: number]
  edit: [id: number]
  start: [id: number]
  stop: [id: number]
}>()

const canControl = computed(() => authStore.isAdmin)

const statusClass = computed(() => ({
  'status-running': props.bot.status === 'running',
  'status-stopped': props.bot.status === 'stopped'
}))

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.bot-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.bot-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bot-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.bot-info h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.bot-version {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.bot-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-running {
  background: #e8f5e9;
  color: #4caf50;
}

.status-running .status-dot {
  background: #4caf50;
  animation: pulse 2s infinite;
}

.status-stopped {
  background: #ffebee;
  color: #f44336;
}

.status-stopped .status-dot {
  background: #f44336;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.bot-description {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.bot-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 6px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-item .label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
}

.meta-item .value {
  font-size: 0.875rem;
  color: #333;
}

.bot-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bot-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #da190b;
}
</style>
