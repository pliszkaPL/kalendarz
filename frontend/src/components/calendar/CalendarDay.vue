<template>
  <div 
    class="calendar-day"
    :class="{
      'other-month': isOtherMonth,
      'today': isToday,
      'has-entries': dayEntries.length > 0
    }"
  >
    <div class="day-number">{{ dayNumber }}</div>
    
    <div class="entries-list">
      <div 
        v-for="entry in displayedEntries"
        :key="entry.id"
        class="entry-item"
        :style="{
          backgroundColor: getEntryColor(entry),
          color: getEntryTextColor(entry)
        }"
        @click="onEntryClick(entry)"
      >
        <span class="entry-icon">{{ getEntryIcon(entry) }}</span>
        <span class="entry-name">{{ entry.name }}</span>
      </div>
      
      <div v-if="remainingCount > 0" class="more-entries">
        +{{ remainingCount }} więcej
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Entry } from '../../types'
import { useTemplatesStore } from '../../stores/templates'

interface Props {
  date: Date
  entries: Entry[]
  isOtherMonth?: boolean
  maxDisplayed?: number
}

const props = withDefaults(defineProps<Props>(), {
  isOtherMonth: false,
  maxDisplayed: 3
})

const emit = defineEmits<{
  entryClick: [entry: Entry]
}>()

const templatesStore = useTemplatesStore()

const dayNumber = computed(() => props.date.getDate())

const isToday = computed(() => {
  const today = new Date()
  return (
    props.date.getDate() === today.getDate() &&
    props.date.getMonth() === today.getMonth() &&
    props.date.getFullYear() === today.getFullYear()
  )
})

const dayEntries = computed(() => props.entries)

const displayedEntries = computed(() => 
  dayEntries.value.slice(0, props.maxDisplayed)
)

const remainingCount = computed(() => 
  Math.max(0, dayEntries.value.length - props.maxDisplayed)
)

function getEntryColor(entry: Entry): string {
  const template = templatesStore.getTemplateById(entry.templateId)
  return template?.backgroundColor || '#74b9ff'
}

function getEntryTextColor(entry: Entry): string {
  const template = templatesStore.getTemplateById(entry.templateId)
  return template?.textColor || '#ffffff'
}

function getEntryIcon(entry: Entry): string {
  const template = templatesStore.getTemplateById(entry.templateId)
  return template?.icon || '📝'
}

function onEntryClick(entry: Entry) {
  emit('entryClick', entry)
  console.log('Entry clicked:', entry)
}
</script>

<style scoped>
.calendar-day {
  min-height: 100px;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  transition: all 0.2s;
}

.calendar-day:hover {
  background: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calendar-day.other-month {
  background: #f9fafb;
  opacity: 0.6;
}

.calendar-day.today {
  background: #eff6ff;
  border-color: #3b82f6;
  font-weight: 600;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.calendar-day.today .day-number {
  color: #3b82f6;
}

.entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.entry-item {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entry-item:hover {
  transform: translateX(2px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.entry-icon {
  font-size: 0.875rem;
  flex-shrink: 0;
}

.entry-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-entries {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}
</style>
