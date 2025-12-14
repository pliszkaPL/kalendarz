/**
 * Groups Store - zarządzanie grupami wpisów
 * STORY-002: Storage Layer (localStorage)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Group, CreateGroupInput } from '../types'
import { generateUUID } from '../utils/uuid'

const STORAGE_KEY = 'kalendarz_groups'

export const useGroupsStore = defineStore('groups', () => {
  // State
  const groups = ref<Group[]>([])
  const isLoaded = ref(false)
  
  // Getters
  const allGroups = computed(() => groups.value)
  
  const groupsMap = computed(() => {
    const map = new Map<string, Group>()
    groups.value.forEach(group => {
      map.set(group.id, group)
    })
    return map
  })
  
  // Actions
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        groups.value = JSON.parse(stored)
      }
      isLoaded.value = true
    } catch (error) {
      console.error('Failed to load groups from storage:', error)
      groups.value = []
      isLoaded.value = true
    }
  }
  
  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups.value))
    } catch (error) {
      console.error('Failed to save groups to storage:', error)
    }
  }
  
  function addGroup(input: CreateGroupInput): Group {
    const now = new Date().toISOString()
    const group: Group = {
      id: generateUUID(),
      ...input,
      createdAt: now,
      updatedAt: now
    }
    
    groups.value.push(group)
    saveToStorage()
    return group
  }
  
  function updateGroup(id: string, updates: Partial<Group>): Group | null {
    const index = groups.value.findIndex(g => g.id === id)
    if (index === -1) return null
    
    const updated: Group = {
      ...groups.value[index],
      ...updates,
      id: groups.value[index].id,
      updatedAt: new Date().toISOString()
    }
    
    groups.value[index] = updated
    saveToStorage()
    return updated
  }
  
  function deleteGroup(id: string): boolean {
    const index = groups.value.findIndex(g => g.id === id)
    if (index === -1) return false
    
    groups.value.splice(index, 1)
    saveToStorage()
    return true
  }
  
  function getGroupById(id: string): Group | undefined {
    return groupsMap.value.get(id)
  }
  
  function searchGroups(query: string): Group[] {
    const lowerQuery = query.toLowerCase()
    return allGroups.value.filter(g =>
      g.name.toLowerCase().includes(lowerQuery) ||
      g.description.toLowerCase().includes(lowerQuery) ||
      g.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
  }
  
  // Initialize
  if (!isLoaded.value) {
    loadFromStorage()
  }
  
  return {
    // State
    groups,
    isLoaded,
    // Getters
    allGroups,
    groupsMap,
    // Actions
    loadFromStorage,
    saveToStorage,
    addGroup,
    updateGroup,
    deleteGroup,
    getGroupById,
    searchGroups
  }
})
