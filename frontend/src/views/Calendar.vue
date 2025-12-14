<template>
  <div class="calendar-view">
    <!-- Top Navbar -->
    <div class="top-navbar">
      <div class="navbar-left">
        <h1 class="app-title">📅 Kalendarz</h1>
      </div>
      <div class="navbar-right">
        <div class="sync-control">
          <label class="sync-label">
            <input 
              type="checkbox" 
              v-model="syncEnabled" 
              @change="handleSyncToggle"
              class="sync-checkbox"
            />
            <span class="sync-text">Synchronizacja</span>
          </label>
        </div>
        <button 
          class="navbar-btn save-btn"
          @click="handleSaveToBackend"
          :disabled="!syncEnabled || isSaving"
          title="Zapisz wszystkie dane do bazy"
        >
          <span v-if="!isSaving">💾 Zapisz do bazy</span>
          <span v-else>⏳ Zapisywanie...</span>
        </button>
        <button 
          class="navbar-btn logout-btn"
          @click="handleLogout"
          title="Wyloguj się"
        >
          🚪 Wyloguj
        </button>
      </div>
    </div>
    
    <div class="calendar-header">
      <div class="header-top">
        <h2 class="calendar-title">Twój kalendarz</h2>
        <button 
          class="add-entry-btn"
          @click="openAddEntryModal"
          aria-label="Dodaj wpis"
        >
          <span class="add-icon">+</span>
          <span class="add-text">Dodaj wpis</span>
        </button>
      </div>
      <MonthNavigation />
    </div>
    
    <div class="calendar-content">
      <div class="calendar-main">
        <CalendarGrid />
      </div>
      
      <div class="calendar-sidebar">
        <div class="sidebar-section">
          <div class="sidebar-header">
            <h2 class="sidebar-title">Grupy</h2>
            <button 
              class="sidebar-add-btn"
              @click="openAddGroupModal"
              aria-label="Dodaj grupę"
              title="Dodaj nową grupę"
            >+</button>
          </div>
          <div class="groups-list">
            <div 
              v-for="group in groups"
              :key="group.id"
              class="group-item"
              :style="{ borderLeftColor: group.color }"
              @click="openEditGroupModal(group)"
              :title="`Kliknij aby edytować grupę ${group.name}`"
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
              @click="openAddEntryWithTemplate(template.id)"
              :title="`Kliknij aby utworzyć wpis z szablonem ${template.name}`"
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
    
    <!-- Entry Modal -->
    <EntryModal 
      v-model="isEntryModalOpen"
      :entry="selectedEntry"
      :initial-date="selectedDate"
      :initial-template-id="selectedTemplateId"
      @saved="handleEntrySaved"
      @deleted="handleEntryDeleted"
    />
    
    <!-- Group Modal -->
    <GroupModal 
      v-model="isGroupModalOpen"
      :group="selectedGroup"
      @saved="handleGroupSaved"
      @deleted="handleGroupDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, provide } from 'vue'
import MonthNavigation from '../components/calendar/MonthNavigation.vue'
import CalendarGrid from '../components/calendar/CalendarGrid.vue'
import EntryModal from '../components/calendar/EntryModal.vue'
import GroupModal from '../components/calendar/GroupModal.vue'
import { useCalendarStore } from '../stores/calendar'
import { useEntriesStore } from '../stores/entries'
import { useGroupsStore } from '../stores/groups'
import { useTemplatesStore } from '../stores/templates'
import { calendarService } from '../services/calendar'
import type { Entry, Group } from '../types'

const calendarStore = useCalendarStore()
const entriesStore = useEntriesStore()
const groupsStore = useGroupsStore()
const templatesStore = useTemplatesStore()

const groups = computed(() => groupsStore.allGroups)
const templates = computed(() => templatesStore.allTemplates)
const totalEntries = computed(() => entriesStore.allEntries.length)

// Entry Modal state
const isEntryModalOpen = ref(false)
const selectedEntry = ref<Entry | null>(null)
const selectedDate = ref<string | undefined>(undefined)
const selectedTemplateId = ref<string | undefined>(undefined)

// Group Modal state
const isGroupModalOpen = ref(false)
const selectedGroup = ref<Group | null>(null)

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

// Modal handlers
function openAddEntryModal() {
  selectedEntry.value = null
  selectedDate.value = undefined
  selectedTemplateId.value = undefined
  isEntryModalOpen.value = true
}

function openAddEntryForDate(date: string) {
  selectedEntry.value = null
  selectedDate.value = date
  selectedTemplateId.value = undefined
  isEntryModalOpen.value = true
}

function openEditEntryModal(entry: Entry) {
  selectedEntry.value = entry
  selectedDate.value = undefined
  selectedTemplateId.value = undefined
  isEntryModalOpen.value = true
}

function openAddEntryWithTemplate(templateId: string) {
  selectedEntry.value = null
  selectedDate.value = undefined
  selectedTemplateId.value = templateId
  isEntryModalOpen.value = true
}

function handleEntrySaved() {
  console.log('Entry saved!')
}

function handleEntryDeleted() {
  console.log('Entry deleted!')
}

// Group modal handlers
function openAddGroupModal() {
  selectedGroup.value = null
  isGroupModalOpen.value = true
}

function openEditGroupModal(group: Group) {
  selectedGroup.value = group
  isGroupModalOpen.value = true
}

function handleGroupSaved() {
  console.log('Group saved!')
}

function handleGroupDeleted() {
  console.log('Group deleted!')
}

// Navbar state and handlers
const syncEnabled = ref(true) // Synchronizacja włączona domyślnie
const isSaving = ref(false)

function handleSyncToggle() {
  console.log('Sync toggled:', syncEnabled.value)
  // TODO: Implement sync logic
}

async function handleSaveToBackend() {
  if (!syncEnabled.value || isSaving.value) return
  
  try {
    isSaving.value = true
    console.log('Saving to backend...')
    
    const entries = entriesStore.allEntries
    const groups = groupsStore.allGroups
    
    console.log('Entries to save:', entries.length)
    console.log('Groups to save:', groups.length)
    console.log('First entry full data:', JSON.stringify(entries[0], null, 2))
    console.log('First group full data:', JSON.stringify(groups[0], null, 2))
    
    // Call backend API to sync data
    const result = await calendarService.syncToBackend(entries, groups)
    
    console.log('Sync result:', result)
    alert(`✅ ${result.message}`)
  } catch (error: any) {
    console.error('Failed to save to backend:', error)
    console.error('Response data:', error.response?.data)
    const errorMessage = error.response?.data?.message || error.message || 'Nieznany błąd'
    const validationErrors = error.response?.data?.errors
    if (validationErrors) {
      console.error('Validation errors:', validationErrors)
    }
    alert(`❌ Błąd podczas zapisywania: ${errorMessage}`)
  } finally {
    isSaving.value = false
  }
}

async function handleLogout() {
  if (confirm('Czy na pewno chcesz się wylogować?')) {
    try {
      // Clear token
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
}

// Provide methods to child components
provide('openAddEntryForDate', openAddEntryForDate)
provide('openEditEntryModal', openEditEntryModal)
provide('openAddEntryWithTemplate', openAddEntryWithTemplate)

// Fix entries missing required fields (migration for old localStorage data)
function migrateOldEntries() {
  const entries = entriesStore.allEntries
  let needsMigration = false
  
  entries.forEach(entry => {
    if (!entry.icon || !entry.backgroundColor || !entry.textColor) {
      needsMigration = true
      
      // Try to get colors from template
      let icon = entry.icon || '📅'
      let backgroundColor = entry.backgroundColor || '#3b82f6'
      let textColor = entry.textColor || '#ffffff'
      
      if (entry.templateId) {
        const template = templatesStore.allTemplates.find(t => t.id === entry.templateId)
        if (template) {
          icon = template.icon
          backgroundColor = template.backgroundColor
          textColor = template.textColor
        }
      }
      
      // Update the entry
      entriesStore.updateEntry(entry.id, {
        icon,
        backgroundColor,
        textColor
      })
    }
  })
  
  if (needsMigration) {
    console.log('Migrated old entries to include icon, backgroundColor, textColor')
  }
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
  
  // Migrate old data if needed
  migrateOldEntries()
  
  // Seed data for demo (only on first run)
  if (import.meta.env.DEV && entriesStore.allEntries.length === 0) {
    import('../utils/seedData').then(({ seedData }) => {
      seedData()
    })
  }
})
</script>

<style scoped>
/* Top Navbar Styles */
.top-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sync-control {
  display: flex;
  align-items: center;
}

.sync-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
}

.sync-checkbox {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.sync-text {
  user-select: none;
}

.navbar-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.save-btn {
  background: #10b981;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.save-btn:disabled {
  background: #6b7280;
  cursor: not-allowed;
  opacity: 0.6;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .top-navbar {
    padding: 0.5rem 1rem;
  }
  
  .app-title {
    font-size: 1.25rem;
  }
  
  .navbar-right {
    gap: 0.5rem;
  }
  
  .sync-text {
    display: none;
  }
  
  .navbar-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
}

/* Calendar View */
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

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.add-entry-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-entry-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-icon {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
}

.add-text {
  display: none;
}

@media (min-width: 640px) {
  .add-text {
    display: inline;
  }
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

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.sidebar-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.sidebar-add-btn {
  width: 1.75rem;
  height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.sidebar-add-btn:hover {
  background: #2563eb;
  transform: scale(1.05);
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
