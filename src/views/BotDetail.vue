<template>
  <div class="bot-detail">
    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading bot details...</p>
    </div>

    <!-- Bot Details -->
    <template v-else-if="bot">
      <div class="detail-header">
        <button @click="goBack" class="btn-back">← Back to Bots</button>
        <div class="header-content">
          <div class="title-section">
            <h2>{{ bot.name }}</h2>
            <span class="bot-status" :class="statusClass">
              <span class="status-dot"></span>
              {{ bot.status }}
            </span>
          </div>
          <div class="version-badge">v{{ bot.version }}</div>
        </div>
      </div>

      <div class="detail-grid">
        <!-- Bot Information -->
        <div class="card">
          <h3>Bot Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name:</span>
              <span class="value">{{ bot.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Version:</span>
              <span class="value">{{ bot.version }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status:</span>
              <span class="value" :class="`status-${bot.status}`">{{ bot.status }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">Description:</span>
              <span class="value">{{ bot.description || 'No description' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Created:</span>
              <span class="value">{{ formatDate(bot.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Last Updated:</span>
              <span class="value">{{ formatDate(bot.updated_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Bot Configuration -->
        <div class="card">
          <h3>Configuration</h3>
          <pre class="config-display">{{ JSON.stringify(bot.config, null, 2) }}</pre>
        </div>

        <!-- Bot Controls (Admin Only) -->
        <div v-if="authStore.isAdmin" class="card full-width">
          <BotControls
            :bot="bot"
            :loading="operationLoading"
            @start="handleStart"
            @stop="handleStop"
            @restart="handleRestart"
            @deploy="handleDeploy"
            @delete="handleDelete"
          />
        </div>
      </div>
    </template>

    <!-- Error State -->
    <div v-else class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Bot Not Found</h3>
      <p>The bot you're looking for doesn't exist or has been deleted.</p>
      <button @click="goBack" class="btn-primary">Back to Bots</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BotControls from '../components/BotControls.vue'
import botService, { type Bot } from '../services/botService'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const bot = ref<Bot | null>(null)
const loading = ref(false)
const operationLoading = ref(false)

const statusClass = computed(() => ({
  'status-running': bot.value?.status === 'running',
  'status-stopped': bot.value?.status === 'stopped'
}))

const loadBot = async () => {
  try {
    loading.value = true
    const id = parseInt(route.params.id as string)
    bot.value = await botService.getBot(id)
  } catch (error: any) {
    console.error('Failed to load bot:', error)
    bot.value = null
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/bots')
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleStart = async () => {
  if (!bot.value) return
  try {
    operationLoading.value = true
    await botService.startBot(bot.value.id)
    alert('Bot started successfully')
    await loadBot()
  } catch (error: any) {
    console.error('Failed to start bot:', error)
    alert(error.response?.data?.error || 'Failed to start bot')
  } finally {
    operationLoading.value = false
  }
}

const handleStop = async () => {
  if (!bot.value) return
  try {
    operationLoading.value = true
    await botService.stopBot(bot.value.id)
    alert('Bot stopped successfully')
    await loadBot()
  } catch (error: any) {
    console.error('Failed to stop bot:', error)
    alert(error.response?.data?.error || 'Failed to stop bot')
  } finally {
    operationLoading.value = false
  }
}

const handleRestart = async () => {
  if (!bot.value) return
  try {
    operationLoading.value = true
    await botService.restartBot(bot.value.id)
    alert('Bot restarted successfully')
    await loadBot()
  } catch (error: any) {
    console.error('Failed to restart bot:', error)
    alert(error.response?.data?.error || 'Failed to restart bot')
  } finally {
    operationLoading.value = false
  }
}

const handleDeploy = async (version: string) => {
  if (!bot.value) return
  try {
    operationLoading.value = true
    await botService.deployBot(bot.value.id, { version })
    alert(`Bot deployed successfully to version ${version}`)
    await loadBot()
  } catch (error: any) {
    console.error('Failed to deploy bot:', error)
    alert(error.response?.data?.error || 'Failed to deploy bot')
  } finally {
    operationLoading.value = false
  }
}

const handleDelete = async () => {
  if (!bot.value) return
  try {
    operationLoading.value = true
    await botService.deleteBot(bot.value.id)
    alert('Bot deleted successfully')
    goBack()
  } catch (error: any) {
    console.error('Failed to delete bot:', error)
    alert(error.response?.data?.error || 'Failed to delete bot')
    operationLoading.value = false
  }
}

onMounted(() => {
  loadBot()
})
</script>

<style scoped>
.bot-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.detail-header {
  margin-bottom: 2rem;
}

.btn-back {
  background: #e0e0e0;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #d0d0d0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.title-section h2 {
  margin: 0;
  color: #333;
  font-size: 2rem;
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

.version-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.25rem;
}

.full-width {
  grid-column: 1 / -1;
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

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item .label {
  font-size: 0.75rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
}

.info-item .value {
  font-size: 0.95rem;
  color: #333;
  font-weight: 500;
}

.status-running {
  color: #4caf50;
  text-transform: capitalize;
}

.status-stopped {
  color: #f44336;
  text-transform: capitalize;
}

.config-display {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.813rem;
  line-height: 1.5;
  overflow-x: auto;
  margin: 0;
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.error-state p {
  margin: 0 0 2rem 0;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
