# TASK-012: Group List Component

## Metadane

- **ID**: `TASK-012`
- **Typ**: `task`
- **Tytuł**: Group List Component
- **Status**: `new`
- **Story**: [STORY-004: Side Panel](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja listy grup z kolorami, tagami i akcjami.

**Lokalizacja pliku**: `frontend/src/components/calendar/GroupList.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/GroupList.vue -->
<template>
  <div class="groups-list">
    <div
      v-for="group in groups"
      :key="group.id"
      class="group-item"
      :style="{ borderLeft: `4px solid ${group.color}` }"
    >
      <div class="group-info">
        <div class="group-name">{{ group.name }}</div>
        <div class="group-entries-count">
          {{ entriesCount(group.id) }} {{ getCountLabel(entriesCount(group.id)) }}
        </div>
        <div v-if="group.tags.length > 0" class="group-tags">
          <span v-for="tag in group.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </div>
      <div class="group-actions">
        <button
          class="edit-btn"
          :title="t('edit')"
          @click="$emit('edit', group.id)"
        >
          ✏️
        </button>
        <button
          class="delete-btn"
          :title="t('delete')"
          @click="$emit('delete', group.id)"
        >
          🗑️
        </button>
      </div>
    </div>

    <div v-if="groups.length === 0" class="empty-state">
      {{ t('noGroups') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import type { Group } from '@/types';

// Props
const props = defineProps<{
  groups: Group[];
  entriesCount: (groupId: string) => number;
}>();

// Emits
defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();

// Store
const calendarStore = useCalendarStore();

// i18n
const translations = {
  pl: {
    edit: 'Edytuj',
    delete: 'Usuń',
    noGroups: 'Brak grup',
    entry: 'wpis',
    entries: 'wpisy',
    entriesMany: 'wpisów'
  },
  en: {
    edit: 'Edit',
    delete: 'Delete',
    noGroups: 'No groups',
    entry: 'entry',
    entries: 'entries',
    entriesMany: 'entries'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

function getCountLabel(count: number): string {
  if (calendarStore.language === 'en') {
    return count === 1 ? t('entry') : t('entries');
  }
  // Polish pluralization
  if (count === 1) return t('entry');
  if (count >= 2 && count <= 4) return t('entries');
  return t('entriesMany');
}
</script>

<style scoped>
.groups-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border-radius: 4px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.group-info {
  flex: 1;
  min-width: 0;
}

.group-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.group-entries-count {
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.group-tags {
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

.group-actions {
  display: flex;
  gap: 0.25rem;
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
  background: #ffebee;
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

- [ ] Lista grup z border-left w kolorze grupy
- [ ] Nazwa grupy, licznik wpisów, tagi
- [ ] Poprawna pluralizacja (PL: wpis/wpisy/wpisów)
- [ ] Przyciski edycji i usuwania
- [ ] Empty state gdy brak grup
- [ ] Emituje edit i delete z ID

## Powiązane Zadania

- [TASK-011: Side Panel Layout](../TASK-011-SidePanelLayout/TASK.md)

## Scenariusze Testowe

1. 2 grupy renderuje 2 group-item
2. Grupa bez tagów nie pokazuje sekcji tagów
3. 1 wpis = "1 wpis", 3 wpisy = "3 wpisy", 5 wpisów = "5 wpisów"
4. Kliknięcie edit emituje edit z ID

## Notatki

- border-left: 4px solid {color} dla wizualizacji koloru
- Polish pluralization: 1=wpis, 2-4=wpisy, 5+=wpisów
- entriesCount jako prop-funkcja (computed z rodzica)
