<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <h1 class="calendar-title">Kalendarz</h1>
      <MonthNavigation />
    </div>
    
    <div class="calendar-content">
      <div class="calendar-main">
        <CalendarGrid />
      </div>
      
      <div class="calendar-sidebar">
        <div class="sidebar-section">
          <h2 class="sidebar-title">Grupy</h2>
          <div class="groups-list">
            <div 
              v-for="group in groups"
              :key="group.id"
              class="group-item"
              :style="{ borderLeftColor: group.color }"
            >
              <span class="group-name">{{ group.name }}</span>
              <span class="group-count">{{ getGroupEntryCount(group.id) }}</span>
            </div>
            
            <div v-if="groups.length === 0" class="empty-message">
              Brak grup
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h2 class="sidebar-title">Szablony</h2>
          <div class="templates-list">
            <div 
              v-for="template in templates"
              :key="template.id"
              class="template-item"
              :style="{ backgroundColor: template.backgroundColor }"
            >
              <span class="template-icon">{{ template.icon }}</span>
              <span 
                class="template-name"
                :style="{ color: template.textColor }"
              >
                {{ template.name }}
              </span>
            </div>
            
            <div v-if="templates.length === 0" class="empty-message">
              Ładowanie szablonów...
            </div>
          </div>
        </div>
        
        <div class="sidebar-section">
          <h2 class="sidebar-title">Statystyki</h2>
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">Wszystkie wpisy:</span>
              <span class="stat-value">{{ totalEntries }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">W tym miesiącu:</span>
              <span class="stat-value">{{ entriesThisMonth }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MonthNavigation from '../components/calendar/MonthNavigation.vue'
import CalendarGrid from '../components/calendar/CalendarGrid.vue'
import { useCalendarStore } from '../stores/calendar'
import { useEntriesStore } from '../stores/entries'
import { useGroupsStore } from '../stores/groups'
import { useTemplatesStore } from '../stores/templates'

const calendarStore = useCalendarStore()
const entriesStore = useEntriesStore()
const groupsStore = useGroupsStore()
const templatesStore = useTemplatesStore()

const groups = computed(() => groupsStore.allGroups)
const templates = computed(() => templatesStore.allTemplates)
const totalEntries = computed(() => entriesStore.allEntries.length)

const entriesThisMonth = computed(() => {
  const year = calendarStore.currentYear
  const month = calendarStore.currentMonth
  
  return entriesStore.allEntries.filter(entry => {
    const entryDate = new Date(entry.date)
    return (
      entryDate.getFullYear() === year &&
      entryDate.getMonth() === month
    )
  }).length
})

function getGroupEntryCount(groupId: string): number {
  return entriesStore.getEntriesByGroup(groupId).length
}

onMounted(() => {
  // Ensure stores are loaded
  if (!entriesStore.isLoaded) {
    entriesStore.loadFromStorage()
  }
  if (!groupsStore.isLoaded) {
    groupsStore.loadFromStorage()
  }
  if (!templatesStore.isLoaded) {
    templatesStore.loadFromStorage()
  }
  
  // Seed data for demo (only on first run)
  if (import.meta.env.DEV && entriesStore.allEntries.length === 0) {
    import('../utils/seedData').then(({ seedData }) => {
      seedData()
    })
  }
})
</script>

<style scoped>
.calendar-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f3f4f6;
}

.calendar-header {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.calendar-title {
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.calendar-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.calendar-sidebar {
  width: 300px;
  background: white;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 1.5rem;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.groups-list,
.templates-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-item {
  padding: 0.75rem 1rem;
  border-left: 3px solid;
  background: #f9fafb;
  border-radius: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.group-item:hover {
  background: #f3f4f6;
}

.group-name {
  font-weight: 500;
  color: #374151;
}

.group-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.template-item {
  padding: 0.75rem 1rem;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.template-item:hover {
  transform: translateX(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.template-icon {
  font-size: 1.25rem;
}

.template-name {
  font-weight: 500;
}

.empty-message {
  padding: 1rem;
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-value {
  font-weight: 600;
  color: #111827;
}

@media (max-width: 768px) {
  .calendar-content {
    flex-direction: column;
  }
  
  .calendar-sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }
}
</style>
