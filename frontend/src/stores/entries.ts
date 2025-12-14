/**
 * Entries Store - zarządzanie wpisami w kalendarzu
 * STORY-002: Storage Layer (localStorage)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Entry, CreateEntryInput } from '../types'
import { generateUUID } from '../utils/uuid'

const STORAGE_KEY = 'kalendarz_entries'

export const useEntriesStore = defineStore('entries', () => {
  // State
  const entries = ref<Entry[]>([])
  const isLoaded = ref(false)
  
  // Getters
  const allEntries = computed(() => entries.value.filter(e => !e.isArchived))
  
  const archivedEntries = computed(() => entries.value.filter(e => e.isArchived))
  
  const entriesByDate = computed(() => {
    const map = new Map<string, Entry[]>()
    
    allEntries.value.forEach(entry => {
      const date = entry.date
      if (!map.has(date)) {
        map.set(date, [])
      }
      map.get(date)!.push(entry)
    })
    
    return map
  })
  
  // Actions
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        entries.value = JSON.parse(stored)
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load entries from storage:', error)
      entries.value = []
      isLoaded.value = true
    }
  }
  
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.value))
    } catch (error) {
      console.error('Failed to save entries to storage:', error)
    }
  }
  
  function addEntry(input: CreateEntryInput): Entry {
    const now = new Date().toISOString()
    const entry: Entry = {
      id: generateUUID(),
      ...input,
      createdAt: now,
      updatedAt: now
    }
    
    entries.value.push(entry)
    saveToStorage()
    return entry
  }
  
  function updateEntry(id: string, updates: Partial<Entry>): Entry | null {
    const index = entries.value.findIndex(e => e.id === id)
    if (index === -1) return null
    
    const updated: Entry = {
      ...entries.value[index],
      ...updates,
      id: entries.value[index].id,
      updatedAt: new Date().toISOString()
    }
    
    entries.value[index] = updated
    saveToStorage()
    return updated
  }
  
  function deleteEntry(id: string): boolean {
    const index = entries.value.findIndex(e => e.id === id)
    if (index === -1) return false
    
    entries.value.splice(index, 1)
    saveToStorage()
    return true
  }
  
  function archiveEntry(id: string): boolean {
    return updateEntry(id, { isArchived: true }) !== null
  }
  
  function unarchiveEntry(id: string): boolean {
    return updateEntry(id, { isArchived: false }) !== null
  }
  
  function getEntriesForDate(date: string): Entry[] {
    return entriesByDate.value.get(date) || []
  }
  
  function getEntriesByGroup(groupId: string | null): Entry[] {
    return allEntries.value.filter(e => e.groupId === groupId)
  }
  
  function searchEntries(query: string): Entry[] {
    const lowerQuery = query.toLowerCase()
    return allEntries.value.filter(e =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.description?.toLowerCase().includes(lowerQuery) ||
      e.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  // Initialize
  if (!isLoaded.value) {
    loadFromStorage()
  }
  
  return {
    // State
    entries,
    isLoaded,
    // Getters
    allEntries,
    archivedEntries,
    entriesByDate,
    // Actions
    loadFromStorage,
    saveToStorage,
    addEntry,
    updateEntry,
    deleteEntry,
    archiveEntry,
    unarchiveEntry,
    getEntriesForDate,
    getEntriesByGroup,
    searchEntries
  }
})
