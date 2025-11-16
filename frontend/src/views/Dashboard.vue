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
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
          <p class="text-blue-700">
            This is your personal dashboard. More features coming soon!
          </p>
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
