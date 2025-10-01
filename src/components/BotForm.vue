<template>
  <div class="bot-form">
    <h3>{{ isEdit ? 'Edit Bot' : 'Create New Bot' }}</h3>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Bot Name *</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          placeholder="Enter bot name"
          :disabled="loading"
        />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          placeholder="Enter bot description"
          rows="3"
          :disabled="loading"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="version">Version</label>
        <input
          id="version"
          v-model="formData.version"
          type="text"
          placeholder="e.g., 1.0.0"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="config">Configuration (JSON)</label>
        <textarea
          id="config"
          v-model="configText"
          placeholder='{"key": "value"}'
          rows="8"
          :disabled="loading"
          @blur="validateConfig"
          class="config-editor"
        ></textarea>
        <span v-if="errors.config" class="error">{{ errors.config }}</span>
        <span v-if="!errors.config && configText" class="hint">✓ Valid JSON</span>
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn-secondary" :disabled="loading">
          Cancel
        </button>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Saving...' : (isEdit ? 'Update Bot' : 'Create Bot') }}
        </button>
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Bot, CreateBotRequest, UpdateBotRequest } from '../services/botService'

interface Props {
  bot?: Bot
  isEdit?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [data: CreateBotRequest | UpdateBotRequest]
  cancel: []
}>()

const formData = ref<{
  name: string
  description: string
  version: string
}>({
  name: '',
  description: '',
  version: ''
})

const configText = ref('')
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const errorMessage = ref('')

onMounted(() => {
  if (props.bot) {
    formData.value = {
      name: props.bot.name,
      description: props.bot.description || '',
      version: props.bot.version || ''
    }
    configText.value = JSON.stringify(props.bot.config || {}, null, 2)
  }
})

watch(() => props.bot, (newBot) => {
  if (newBot) {
    formData.value = {
      name: newBot.name,
      description: newBot.description || '',
      version: newBot.version || ''
    }
    configText.value = JSON.stringify(newBot.config || {}, null, 2)
  }
})

const validateConfig = () => {
  errors.value.config = ''
  if (configText.value.trim()) {
    try {
      JSON.parse(configText.value)
    } catch (e) {
      errors.value.config = 'Invalid JSON format'
    }
  }
}

const handleSubmit = () => {
  errors.value = {}
  errorMessage.value = ''

  // Validate name
  if (!formData.value.name.trim()) {
    errors.value.name = 'Bot name is required'
    return
  }

  // Validate config JSON
  let config: Record<string, any> = {}
  if (configText.value.trim()) {
    try {
      config = JSON.parse(configText.value)
    } catch (e) {
      errors.value.config = 'Invalid JSON format'
      return
    }
  }

  const data = {
    name: formData.value.name,
    description: formData.value.description || undefined,
    version: formData.value.version || undefined,
    config: Object.keys(config).length > 0 ? config : undefined
  }

  emit('submit', data)
}
</script>

<style scoped>
.bot-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bot-form h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled,
.form-group textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.config-editor {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.813rem;
  line-height: 1.5;
}

.error {
  display: block;
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.hint {
  display: block;
  color: #4caf50;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.form-actions button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>
