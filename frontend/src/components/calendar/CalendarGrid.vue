<template>
  <div class="calendar-grid">
    <!-- Day headers -->
    <div class="calendar-header">
      <div 
        v-for="day in dayHeaders"
        :key="day"
        class="day-header"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- Calendar days -->
    <div class="calendar-days">
      <CalendarDay
        v-for="(dayData, index) in calendarDays"
        :key="`${dayData.date.getTime()}-${index}`"
        :date="dayData.date"
        :entries="dayData.entries"
        :is-other-month="dayData.isOtherMonth"
        @entry-click="handleEntryClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import CalendarDay from './CalendarDay.vue'
import { useCalendarStore } from '../../stores/calendar'
import { useEntriesStore } from '../../stores/entries'
import type { Entry } from '../../types'

const calendarStore = useCalendarStore()
const entriesStore = useEntriesStore()

interface DayData {
  date: Date
  entries: Entry[]
  isOtherMonth: boolean
}

const dayHeaders = computed(() => {
  const start = calendarStore.weekStart
  const days = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']
  
  if (start === 0) {
    return days // Start on Sunday
  } else {
    // Start on Monday
    return [...days.slice(1), days[0]]
  }
})

const calendarDays = computed((): DayData[] => {
  const year = calendarStore.currentYear
  const month = calendarStore.currentMonth
  const weekStart = calendarStore.weekStart
  
  // First day of the month
  const firstDay = new Date(year, month, 1)
  const firstDayOfWeek = firstDay.getDay()
  
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0)
  const lastDayOfWeek = lastDay.getDay()
  
  // Calculate days to show from previous month
  let daysFromPrevMonth = firstDayOfWeek - weekStart
  if (daysFromPrevMonth < 0) daysFromPrevMonth += 7
  
  // Calculate days to show from next month
  let daysFromNextMonth = 6 - lastDayOfWeek + weekStart
  if (daysFromNextMonth > 6) daysFromNextMonth -= 7
  
  const days: DayData[] = []
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i)
    days.push({
      date,
      entries: getEntriesForDate(date),
      isOtherMonth: true
    })
  }
  
  // Current month days
  const daysInMonth = lastDay.getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i)
    days.push({
      date,
      entries: getEntriesForDate(date),
      isOtherMonth: false
    })
  }
  
  // Next month days
  for (let i = 1; i <= daysFromNextMonth; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      date,
      entries: getEntriesForDate(date),
      isOtherMonth: true
    })
  }
  
  return days
})

function getEntriesForDate(date: Date): Entry[] {
  const dateStr = formatDate(date)
  return entriesStore.getEntriesForDate(dateStr)
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function handleEntryClick(entry: Entry) {
  console.log('Entry clicked in grid:', entry)
  // TODO: Open entry modal
}
</script>

<style scoped>
.calendar-grid {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 2px solid #e5e7eb;
}

.day-header {
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #6b7280;
  background: #f9fafb;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(100px, 1fr);
  flex: 1;
}
</style>
