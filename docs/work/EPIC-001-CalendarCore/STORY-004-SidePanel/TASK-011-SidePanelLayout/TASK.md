# TASK-011: Side Panel Layout

## Metadane

- **ID**: `TASK-011`
- **Typ**: `task`
- **Tytuł**: Side Panel Layout
- **Status**: `new`
- **Story**: [STORY-004: Side Panel](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja głównego layoutu panelu bocznego.

**Lokalizacja pliku**: `frontend/src/components/calendar/SidePanel.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/SidePanel.vue -->
<template>
  <div class="side-panel">
    <!-- Search Section -->
    <div class="search-section">
      <SearchInput v-model="searchQuery" :placeholder="t('searchPlaceholder')" />
    </div>

    <!-- Groups Section -->
    <div class="groups-section">
      <div class="section-header">
        <h3>{{ t('groups') }}</h3>
        <button class="add-btn" @click="$emit('add-group')">+</button>
      </div>
      <GroupList
        :groups="groups"
        :entries-count="getEntriesCountByGroup"
        @edit="(id) => $emit('edit-group', id)"
        @delete="handleDeleteGroup"
      />
    </div>

    <!-- Entries Section -->
    <div class="entries-section">
      <h3>{{ t('allEntries') }}</h3>
      <EntryList
        :entries="filteredEntries"
        @edit="(id) => $emit('edit-entry', id)"
        @archive="handleArchiveEntry"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { useGroupsStore } from '@/stores/groups';
import { useEntriesStore } from '@/stores/entries';
import SearchInput from './SearchInput.vue';
import GroupList from './GroupList.vue';
import EntryList from './EntryList.vue';

// Emits
defineEmits<{
  (e: 'add-group'): void;
  (e: 'edit-group', id: string): void;
  (e: 'edit-entry', id: string): void;
}>();

// Stores
const calendarStore = useCalendarStore();
const groupsStore = useGroupsStore();
const entriesStore = useEntriesStore();

// State
const searchQuery = ref('');

// Computed
const groups = computed(() => groupsStore.groups);

const filteredEntries = computed(() => {
  let entries = entriesStore.activeEntries;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    entries = entries.filter(entry =>
      entry.name.toLowerCase().includes(query) ||
      entry.description?.toLowerCase().includes(query) ||
      entry.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Sort by date (newest first)
  return [...entries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
});

const getEntriesCountByGroup = computed(() => (groupId: string) => {
  return entriesStore.activeEntries.filter(e => e.groupId === groupId).length;
});

// i18n
const translations = {
  pl: {
    searchPlaceholder: 'Szukaj wpisów...',
    groups: 'Grupy',
    allEntries: 'Wszystkie wpisy'
  },
  en: {
    searchPlaceholder: 'Search entries...',
    groups: 'Groups',
    allEntries: 'All entries'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
async function handleDeleteGroup(id: string) {
  if (confirm(calendarStore.language === 'pl'
    ? 'Czy na pewno chcesz usunąć tę grupę?'
    : 'Are you sure you want to delete this group?'
  )) {
    await groupsStore.deleteGroup(id);
  }
}

async function handleArchiveEntry(id: string) {
  await entriesStore.archiveEntry(id);
}
</script>

<style scoped>
.side-panel {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.search-section {
  flex-shrink: 0;
}

.groups-section,
.entries-section {
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-header h3,
.entries-section h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.add-btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  background: #43a047;
}

/* Hide on mobile */
@media (max-width: 768px) {
  .side-panel {
    display: none;
  }
}
</style>
```

## Kryteria Akceptacji

- [ ] Layout z search, groups, entries
- [ ] Wyszukiwarka filtruje wpisy
- [ ] Przycisk "+" przy grupach
- [ ] Emituje add-group, edit-group, edit-entry
- [ ] Responsywność: ukryty na mobile
- [ ] Scroll na całym panelu

## Powiązane Zadania

- [TASK-012: Group List](../TASK-012-GroupList/TASK.md)
- [TASK-013: Entry List](../TASK-013-EntryList/TASK.md)
- [TASK-014: Search Input](../TASK-014-SearchInput/TASK.md)

## Scenariusze Testowe

1. Panel renderuje 3 sekcje
2. Wpisanie tekstu filtruje wpisy
3. Kliknięcie "+" emituje add-group
4. Panel ukryty na szerokości < 768px

## Notatki

- width: 300px (stała szerokość)
- max-height z overflow-y dla scrolla
- confirm() dla usuwania (lepsze: custom modal)
