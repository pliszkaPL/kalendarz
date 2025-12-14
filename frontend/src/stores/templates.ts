/**
 * Templates Store - zarządzanie szablonami wpisów
 * STORY-002: Storage Layer (localStorage)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Template } from '../types'
import { TEMPLATE_PRESETS } from '../types'
import { generateUUID } from '../utils/uuid'

const STORAGE_KEY = 'kalendarz_templates'

export const useTemplatesStore = defineStore('templates', () => {
  // State
  const templates = ref<Template[]>([])
  const isLoaded = ref(false)
  
  // Getters
  const allTemplates = computed(() => templates.value.filter(t => !t.isArchived))
  
  const archivedTemplates = computed(() => templates.value.filter(t => t.isArchived))
  
  const systemTemplates = computed(() => allTemplates.value.filter(t => t.isSystem))
  
  const userTemplates = computed(() => allTemplates.value.filter(t => !t.isSystem))
  
  const templatesMap = computed(() => {
    const map = new Map<string, Template>()
    templates.value.forEach(template => {
      map.set(template.id, template)
    })
    return map
  })
  
  // Actions
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        templates.value = JSON.parse(stored)
      } else {
        // Initialize with default templates if storage is empty
        initializeDefaultTemplates()
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load templates from storage:', error)
      templates.value = []
      initializeDefaultTemplates()
      isLoaded.value = true
    }
  }
  
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates.value))
    } catch (error) {
      console.error('Failed to save templates to storage:', error)
    }
  }
  
  function initializeDefaultTemplates() {
    const now = new Date().toISOString()
    
    // Birthday template
    const birthdayTemplate: Template = {
      id: generateUUID(),
      name: 'Urodziny',
      preset: 'birthday',
      icon: TEMPLATE_PRESETS.birthday.icon,
      backgroundColor: TEMPLATE_PRESETS.birthday.color,
      textColor: '#ffffff',
      fields: [
        {
          name: 'imie',
          label: 'Imię',
          type: 'text',
          required: true
        },
        {
          name: 'rok_urodzenia',
          label: 'Rok urodzenia',
          type: 'number',
          required: false
        }
      ],
      displayFormat: '🎂 Urodziny {imie} ({wiek})',
      operations: [
        {
          type: 'calculateAge',
          sourceField: 'rok_urodzenia',
          outputVariable: 'wiek'
        }
      ],
      isArchived: false,
      isSystem: true,
      userId: null,
      createdAt: now,
      updatedAt: now
    }
    
    // Anniversary template
    const anniversaryTemplate: Template = {
      id: generateUUID(),
      name: 'Rocznica',
      preset: 'anniversary',
      icon: TEMPLATE_PRESETS.anniversary.icon,
      backgroundColor: TEMPLATE_PRESETS.anniversary.color,
      textColor: '#ffffff',
      fields: [
        {
          name: 'wydarzenie',
          label: 'Wydarzenie',
          type: 'text',
          required: true
        }
      ],
      displayFormat: '💕 {wydarzenie}',
      operations: [],
      isArchived: false,
      isSystem: true,
      userId: null,
      createdAt: now,
      updatedAt: now
    }
    
    // Reminder template
    const reminderTemplate: Template = {
      id: generateUUID(),
      name: 'Przypomnienie',
      preset: 'reminder',
      icon: TEMPLATE_PRESETS.reminder.icon,
      backgroundColor: TEMPLATE_PRESETS.reminder.color,
      textColor: '#333333',
      fields: [
        {
          name: 'opis',
          label: 'Opis',
          type: 'text',
          required: true
        }
      ],
      displayFormat: '⏰ {opis}',
      operations: [],
      isArchived: false,
      isSystem: true,
      userId: null,
      createdAt: now,
      updatedAt: now
    }
    
    templates.value = [birthdayTemplate, anniversaryTemplate, reminderTemplate]
    saveToStorage()
  }
  
  function getTemplateById(id: string): Template | undefined {
    return templatesMap.value.get(id)
  }
  
  function archiveTemplate(id: string): boolean {
    const index = templates.value.findIndex(t => t.id === id)
    if (index === -1) return false
    
    templates.value[index] = {
      ...templates.value[index],
      isArchived: true,
      updatedAt: new Date().toISOString()
    }
    saveToStorage()
    return true
  }
  
  function unarchiveTemplate(id: string): boolean {
    const index = templates.value.findIndex(t => t.id === id)
    if (index === -1) return false
    
    templates.value[index] = {
      ...templates.value[index],
      isArchived: false,
      updatedAt: new Date().toISOString()
    }
    saveToStorage()
    return true
  }
  
  // Initialize
  if (!isLoaded.value) {
    loadFromStorage()
  }
  
  return {
    // State
    templates,
    isLoaded,
    // Getters
    allTemplates,
    archivedTemplates,
    systemTemplates,
    userTemplates,
    templatesMap,
    // Actions
    loadFromStorage,
    saveToStorage,
    initializeDefaultTemplates,
    getTemplateById,
    archiveTemplate,
    unarchiveTemplate
  }
})
