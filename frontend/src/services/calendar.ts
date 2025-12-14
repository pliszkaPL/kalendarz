import axios from 'axios'
import type { Entry, Group } from '../types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface SyncResponse {
  success: boolean
  message: string
  entries_count: number
  groups_count: number
  saved_at: string
}

export const calendarService = {
  /**
   * Synchronize calendar entries and groups to backend
   * @param entries - Array of Entry objects
   * @param groups - Array of Group objects
   * @returns Response with success status and message
   */
  async syncToBackend(entries: Entry[], groups: Group[]): Promise<SyncResponse> {
    const response = await api.post<SyncResponse>('/calendar/sync', {
      entries,
      groups
    })
    return response.data
  }
}
