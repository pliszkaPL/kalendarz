<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <h1 class="text-2xl font-bold text-gray-900">Kalendarz</h1>
          <div class="flex items-center gap-4">
            <span class="text-gray-700">Welcome, {{ userName }}</span>
            <button
              @click="handleLogout"
              class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Dashboard</h2>
        <p class="text-gray-600 mb-4">
          Hello, {{ userName }}! You are successfully logged in.
        </p>
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p class="text-blue-700">
            This is your personal dashboard. More features coming soon!
          </p>
        </div>
        
        <div class="mt-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-4">Quick Links</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <router-link
              to="/calendar"
              class="block p-6 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              <h4 class="text-lg font-semibold mb-2">📅 Calendar</h4>
              <p class="text-blue-100">View and manage your calendar</p>
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth'

export default {
  name: 'Dashboard',
  setup() {
    const router = useRouter()
    const userName = ref('')

    onMounted(() => {
      const user = authService.getCurrentUser()
      if (user) {
        userName.value = user.name
      }
    })

    const handleLogout = async () => {
      await authService.logout()
      router.push('/')
    }

    return {
      userName,
      handleLogout
    }
  }
}
</script>
