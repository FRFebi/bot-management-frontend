<template>
  <div class="bot-controls">
    <div class="control-section">
      <h4>Bot Operations</h4>
      <div class="control-buttons">
        <button
          @click="$emit('start')"
          :disabled="bot.status === 'running' || loading"
          class="btn btn-success"
        >
          <span class="icon">▶</span>
          Start
        </button>

        <button
          @click="$emit('stop')"
          :disabled="bot.status === 'stopped' || loading"
          class="btn btn-danger"
        >
          <span class="icon">⏸</span>
          Stop
        </button>

        <button
          @click="$emit('restart')"
          :disabled="loading"
          class="btn btn-warning"
        >
          <span class="icon">↻</span>
          Restart
        </button>

        <button
          @click="showDeployModal = true"
          :disabled="loading"
          class="btn btn-primary"
        >
          <span class="icon">🚀</span>
          Deploy
        </button>

        <button
          @click="confirmDelete"
          :disabled="loading"
          class="btn btn-delete"
        >
          <span class="icon">🗑</span>
          Delete
        </button>
      </div>
    </div>

    <!-- Deploy Modal -->
    <div v-if="showDeployModal" class="modal-overlay" @click="showDeployModal = false">
      <div class="modal-content" @click.stop>
        <h3>Deploy New Version</h3>
        <form @submit.prevent="handleDeploy">
          <div class="form-group">
            <label for="version">Version *</label>
            <input
              id="version"
              v-model="deployVersion"
              type="text"
              required
              placeholder="e.g., 2.0.0"
              autofocus
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showDeployModal = false" class="btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              Deploy
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Bot } from '../services/botService'

interface Props {
  bot: Bot
  loading?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  start: []
  stop: []
  restart: []
  deploy: [version: string]
  delete: []
}>()

const showDeployModal = ref(false)
const deployVersion = ref('')

const handleDeploy = () => {
  if (deployVersion.value.trim()) {
    emit('deploy', deployVersion.value.trim())
    showDeployModal.value = false
    deployVersion.value = ''
  }
}

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
    emit('delete')
  }
}
</script>

<style scoped>
.bot-controls {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.control-section h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
}

.control-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn .icon {
  font-size: 1rem;
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #da190b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #e68900;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-delete {
  background: #d32f2f;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #b71c1c;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
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
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
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
</style>
