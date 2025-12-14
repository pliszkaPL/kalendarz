import axios from 'axios'

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

async function getCsrfCookie() {
  await axios.get('/sanctum/csrf-cookie', {
    withCredentials: true
  })
}

export const authService = {
  async register(name, email, password, password_confirmation) {
    await getCsrfCookie()
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async login(email, password) {
    await getCsrfCookie()
    const response = await api.post('/login', {
      email,
      password
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  async logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  async getUser() {
    const response = await api.get('/user')
    return response.data
  },

  getCurrentUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}
