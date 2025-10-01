<template>
  <div class="bots">
    <div class="header-section">
      <h2>Bot Management</h2>
      <button v-if="authStore.isAdmin" @click="showCreateForm = true" class="btn-primary">
        + Add New Bot
      </button>
    </div>

    <!-- Search and Filter -->
    <div class="filter-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search bots by name or description..."
          class="search-input"
        />
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="running">Running</option>
          <option value="stopped">Stopped</option>
        </select>
      </div>
    </div>

    <!-- Create/Edit Form Modal -->
    <div v-if="showCreateForm || showEditForm" class="modal-overlay" @click="closeForm">
      <div class="modal-content" @click.stop>
        <BotForm
          :bot="editingBot"
          :is-edit="showEditForm"
          @submit="handleFormSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading bots...</p>
    </div>

    <!-- Bot List -->
    <div v-else-if="filteredBots.length > 0" class="bots-grid">
      <BotCard
        v-for="bot in filteredBots"
        :key="bot.id"
        :bot="bot"
        @view="viewBot"
        @edit="editBot"
        @start="startBot"
        @stop="stopBot"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">🤖</div>
      <h3>{{ searchQuery || statusFilter ? 'No bots found' : 'No bots yet' }}</h3>
      <p>{{ searchQuery || statusFilter ? 'Try adjusting your search or filters' : 'Click "Add New Bot" to get started' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BotCard from '../components/BotCard.vue'
import BotForm from '../components/BotForm.vue'
import botService, { type Bot, type CreateBotRequest, type UpdateBotRequest } from '../services/botService'

const router = useRouter()
const authStore = useAuthStore()

const bots = ref<Bot[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const showCreateForm = ref(false)
const showEditForm = ref(false)
const editingBot = ref<Bot | undefined>(undefined)

const filteredBots = computed(() => {
  return bots.value.filter(bot => {
    const matchesSearch = searchQuery.value
      ? bot.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        bot.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true

    const matchesStatus = statusFilter.value
      ? bot.status === statusFilter.value
      : true

    return matchesSearch && matchesStatus
  })
})

const loadBots = async () => {
  try {
    loading.value = true
    bots.value = await botService.getBots()
  } catch (error: any) {
    console.error('Failed to load bots:', error)
    alert(error.response?.data?.error || 'Failed to load bots')
  } finally {
    loading.value = false
  }
}

const handleFormSubmit = async (data: CreateBotRequest | UpdateBotRequest) => {
  try {
    if (showEditForm.value && editingBot.value) {
      await botService.updateBot(editingBot.value.id, data)
      alert('Bot updated successfully')
    } else {
      await botService.createBot(data as CreateBotRequest)
      alert('Bot created successfully')
    }
    closeForm()
    await loadBots()
  } catch (error: any) {
    console.error('Failed to save bot:', error)
    alert(error.response?.data?.error || 'Failed to save bot')
  }
}

const closeForm = () => {
  showCreateForm.value = false
  showEditForm.value = false
  editingBot.value = undefined
}

const viewBot = (id: number) => {
  router.push(`/bots/${id}`)
}

const editBot = (id: number) => {
  const bot = bots.value.find(b => b.id === id)
  if (bot) {
    editingBot.value = bot
    showEditForm.value = true
  }
}

const startBot = async (id: number) => {
  try {
    await botService.startBot(id)
    alert('Bot started successfully')
    await loadBots()
  } catch (error: any) {
    console.error('Failed to start bot:', error)
    alert(error.response?.data?.error || 'Failed to start bot')
  }
}

const stopBot = async (id: number) => {
  try {
    await botService.stopBot(id)
    alert('Bot stopped successfully')
    await loadBots()
  } catch (error: any) {
    console.error('Failed to stop bot:', error)
    alert(error.response?.data?.error || 'Failed to stop bot')
  }
}

onMounted(() => {
  loadBots()
})
</script>

<style scoped>
.bots h2 {
  color: #333;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
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

.filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 2rem;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  margin: auto;
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

.bots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.empty-state p {
  margin: 0;
  color: #666;
}
</style>
