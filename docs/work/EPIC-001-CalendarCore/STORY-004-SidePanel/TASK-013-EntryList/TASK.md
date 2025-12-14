# TASK-013: Entry List Component

## Metadane

- **ID**: `TASK-013`
- **Typ**: `task`
- **Tytuł**: Entry List Component
- **Status**: `new`
- **Story**: [STORY-004: Side Panel](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja listy wpisów z ikoną, nazwą, datą i akcjami.

**Lokalizacja pliku**: `frontend/src/components/calendar/EntryList.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/EntryList.vue -->
<template>
  <div class="entries-list">
    <div
      v-for="entry in entries"
      :key="entry.id"
      class="entry-item"
      :style="{ borderLeft: `4px solid ${getEntryColor(entry)}` }"
    >
      <div class="entry-icon">{{ getEntryIcon(entry) }}</div>
      <div class="entry-details">
        <div class="entry-name">{{ entry.name }}</div>
        <div class="entry-date">{{ formatDate(entry.date) }}</div>
        <div v-if="entry.tags.length > 0" class="entry-tags">
          <span v-for="tag in entry.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>
      <div class="entry-actions">
        <button
          class="edit-btn"
          :title="t('edit')"
          @click="$emit('edit', entry.id)"
        >
          ✏️
        </button>
        <button
          class="delete-btn"
          :title="t('archive')"
          @click="$emit('archive', entry.id)"
        >
          📦
        </button>
      </div>
    </div>

    <div v-if="entries.length === 0" class="empty-state">
      {{ t('noEntries') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import { useTemplatesStore } from '@/stores/templates';
import { useGroupsStore } from '@/stores/groups';
import type { Entry } from '@/types';

// Props
defineProps<{
  entries: Entry[];
}>();

// Emits
defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'archive', id: string): void;
}>();

// Stores
const calendarStore = useCalendarStore();
const templatesStore = useTemplatesStore();
const groupsStore = useGroupsStore();

// i18n
const translations = {
  pl: {
    edit: 'Edytuj',
    archive: 'Archiwizuj',
    noEntries: 'Brak wpisów'
  },
  en: {
    edit: 'Edit',
    archive: 'Archive',
    noEntries: 'No entries'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function getEntryColor(entry: Entry): string {
  if (entry.groupId) {
    const group = groupsStore.getGroupById(entry.groupId);
    if (group) return group.color;
  }
  if (entry.templateId) {
    const template = templatesStore.getTemplateById(entry.templateId);
    if (template) return template.backgroundColor;
  }
  return '#74b9ff';
}

function getEntryIcon(entry: Entry): string {
  if (entry.templateId) {
    const template = templatesStore.getTemplateById(entry.templateId);
    if (template) return template.icon;
  }
  return '📅';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const locale = calendarStore.language === 'pl' ? 'pl-PL' : 'en-US';
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}
</script>

<style scoped>
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.entry-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: white;
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.entry-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.entry-details {
  flex: 1;
  min-width: 0;
}

.entry-name {
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entry-date {
  font-size: 0.75rem;
  color: #666;
  margin: 0.25rem 0;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.tag {
  font-size: 0.7rem;
  padding: 2px 6px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 10px;
}

.entry-actions {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.edit-btn,
.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 4px;
  border-radius: 4px;
}

.edit-btn:hover {
  background: #e3f2fd;
}

.delete-btn:hover {
  background: #fff3e0;
}

.empty-state {
  text-align: center;
  color: #999;
  font-size: 0.875rem;
  padding: 1rem;
}
</style>
```

## Kryteria Akceptacji

- [ ] Lista wpisów z border-left w kolorze
- [ ] Ikona z szablonu
- [ ] Nazwa, data (lokalizowana), tagi
- [ ] Przyciski edycji i archiwizacji
- [ ] Empty state gdy brak wpisów
- [ ] text-overflow dla długich nazw

## Powiązane Zadania

- [TASK-011: Side Panel Layout](../TASK-011-SidePanelLayout/TASK.md)

## Scenariusze Testowe

1. 3 wpisy renderuje 3 entry-item
2. Wpis bez tagów nie pokazuje sekcji tagów
3. Data formatowana wg locale
4. Kliknięcie archive emituje archive z ID

## Notatki

- Archiwizacja zamiast usuwania (📦 nie 🗑️)
- Kolor: grupa > szablon > domyślny
- formatDate używa Intl.DateTimeFormat
