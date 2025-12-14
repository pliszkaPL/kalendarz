import axios from 'axios'

const API_URL = 'http://kalendarz.loc/api'

const api = axios.create({
  baseURL: API_URL,
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

export const calendarService = {
  /**
   * Synchronize calendar entries and groups to backend
   * @param {Array} entries - Array of Entry objects
   * @param {Array} groups - Array of Group objects
   * @returns {Promise<Object>} Response with success status and message
   */
  async syncToBackend(entries, groups) {
    const response = await api.post('/calendar/sync', {
      entries,
      groups
    })
    return response.data
  }
}
