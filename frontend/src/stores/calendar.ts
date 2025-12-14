/**
 * Calendar Store - zarządzanie stanem widoku kalendarza
 * STORY-002: Storage Layer
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const currentDate = ref(new Date())
  const weekStart = ref<0 | 1>(1) // 0 = niedziela, 1 = poniedziałek
  
  // Getters
  const currentYear = computed(() => currentDate.value.getFullYear())
  const currentMonth = computed(() => currentDate.value.getMonth())
  
  const monthName = computed(() => {
    return currentDate.value.toLocaleDateString('pl-PL', { month: 'long' })
  })
  
  // Actions
  function setDate(date: Date) {
    currentDate.value = date
  }
  
  function nextMonth() {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() + 1)
    currentDate.value = newDate
  }
  
  function previousMonth() {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(newDate.getMonth() - 1)
    currentDate.value = newDate
  }
  
  function goToToday() {
    currentDate.value = new Date()
  }
  
  function setYear(year: number) {
    const newDate = new Date(currentDate.value)
    newDate.setFullYear(year)
    currentDate.value = newDate
  }
  
  function setMonth(month: number) {
    const newDate = new Date(currentDate.value)
    newDate.setMonth(month)
    currentDate.value = newDate
  }
  
  function setWeekStart(start: 0 | 1) {
    weekStart.value = start
  }
  
  return {
    // State
    currentDate,
    weekStart,
    // Getters
    currentYear,
    currentMonth,
    monthName,
    // Actions
    setDate,
    nextMonth,
    previousMonth,
    goToToday,
    setYear,
    setMonth,
    setWeekStart
  }
})
