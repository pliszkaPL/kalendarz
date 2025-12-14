<template>
  <div class="month-navigation">
    <button @click="previousMonth" class="nav-button" aria-label="Poprzedni miesiąc">
      ‹
    </button>
    
    <div class="month-year-display">
      <button @click="toggleMonthPicker" class="month-button">
        {{ monthName }}
      </button>
      <button @click="toggleYearPicker" class="year-button">
        {{ currentYear }}
      </button>
    </div>
    
    <button @click="nextMonth" class="nav-button" aria-label="Następny miesiąc">
      ›
    </button>
    
    <button @click="goToToday" class="today-button">
      Dziś
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCalendarStore } from '../../stores/calendar'

const calendarStore = useCalendarStore()

const showMonthPicker = ref(false)
const showYearPicker = ref(false)

const monthName = computed(() => calendarStore.monthName)
const currentYear = computed(() => calendarStore.currentYear)

function previousMonth() {
  calendarStore.previousMonth()
}

function nextMonth() {
  calendarStore.nextMonth()
}

function goToToday() {
  calendarStore.goToToday()
}

function toggleMonthPicker() {
  showMonthPicker.value = !showMonthPicker.value
  showYearPicker.value = false
  // TODO: Implement month picker modal
  console.log('Month picker - to be implemented')
}

function toggleYearPicker() {
  showYearPicker.value = !showYearPicker.value
  showMonthPicker.value = false
  // TODO: Implement year picker modal
  console.log('Year picker - to be implemented')
}
</script>

<style scoped>
.month-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.nav-button {
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.month-year-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.month-button,
.year-button {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.month-button:hover,
.year-button:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.today-button {
  padding: 0.5rem 1.5rem;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.today-button:hover {
  background: #2563eb;
  border-color: #2563eb;
}
</style>
