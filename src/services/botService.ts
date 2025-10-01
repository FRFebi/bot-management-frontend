import api from './api'

export interface Bot {
  id: number
  name: string
  description: string
  version: string
  config: Record<string, any>
  status: 'stopped' | 'running'
  created_at: string
  updated_at: string
}

export interface CreateBotRequest {
  name: string
  description?: string
  version?: string
  config?: Record<string, any>
}

export interface UpdateBotRequest {
  name?: string
  description?: string
  version?: string
  config?: Record<string, any>
}

export interface DeployBotRequest {
  version: string
}

class BotService {
  async getBots(): Promise<Bot[]> {
    const response = await api.get<Bot[]>('/api/v1/bots')
    return response.data
  }

  async getBot(id: number): Promise<Bot> {
    const response = await api.get<Bot>(`/api/v1/bots/${id}`)
    return response.data
  }

  async createBot(data: CreateBotRequest): Promise<Bot> {
    const response = await api.post<Bot>('/api/v1/bots', data)
    return response.data
  }

  async updateBot(id: number, data: UpdateBotRequest): Promise<Bot> {
    const response = await api.put<Bot>(`/api/v1/bots/${id}`, data)
    return response.data
  }

  async deleteBot(id: number): Promise<void> {
    await api.delete(`/api/v1/bots/${id}`)
  }

  async getBotStatus(id: number): Promise<{ id: number; name: string; status: string; version: string }> {
    const response = await api.get(`/api/v1/bots/${id}/status`)
    return response.data
  }

  async startBot(id: number): Promise<{ message: string; bot: Bot }> {
    const response = await api.post(`/api/v1/bots/${id}/start`)
    return response.data
  }

  async stopBot(id: number): Promise<{ message: string; bot: Bot }> {
    const response = await api.post(`/api/v1/bots/${id}/stop`)
    return response.data
  }

  async restartBot(id: number): Promise<{ message: string; bot: Bot }> {
    const response = await api.post(`/api/v1/bots/${id}/restart`)
    return response.data
  }

  async deployBot(id: number, data: DeployBotRequest): Promise<{ message: string; bot: Bot }> {
    const response = await api.post(`/api/v1/bots/${id}/deploy`, data)
    return response.data
  }
}

export default new BotService()
