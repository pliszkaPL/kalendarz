# TASK-007: Calendar View Component

## Metadane

- **ID**: `TASK-007`
- **Typ**: `task`
- **Tytuł**: Calendar View - Główny layout
- **Status**: `new`
- **Story**: [STORY-003: Calendar Grid UI](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja głównego widoku kalendarza (CalendarView.vue) - zastępuje obecny Dashboard.vue.

**Lokalizacja pliku**: `frontend/src/views/CalendarView.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/views/CalendarView.vue -->
<template>
  <div class="calendar-container">
    <!-- Header -->
    <div class="calendar-header">
      <h1>Kalendarz</h1>
      <div class="header-controls">
        <!-- Week start selector -->
        <div class="week-start-control">
          <label>{{ t('weekStartLabel') }}</label>
          <select v-model="weekStart" @change="onWeekStartChange">
            <option value="sunday">{{ t('sunday') }}</option>
            <option value="monday">{{ t('monday') }}</option>
          </select>
        </div>

        <!-- Language toggle -->
        <button class="language-btn" @click="toggleLanguage">
          {{ language === 'pl' ? 'EN' : 'PL' }}
        </button>

        <!-- Action buttons -->
        <button class="archive-btn" @click="showArchive">
          {{ t('archivedEntries') }}
        </button>
        <button class="import-btn" @click="showImport">
          {{ t('importEvents') }}
        </button>
        <button class="save-btn" @click="saveCalendar">
          {{ t('saveCalendar') }}
        </button>
        <button class="load-btn" @click="loadCalendar">
          {{ t('loadCalendar') }}
        </button>
        <button class="print-btn" @click="printCalendar">
          {{ t('printCalendar') }}
        </button>
        <button class="add-entry-btn" @click="showEntryModal">
          + {{ t('addEntry') }}
        </button>
      </div>
    </div>

    <!-- Main layout -->
    <div class="calendar-layout">
      <!-- Side panel -->
      <SidePanel
        @edit-entry="editEntry"
        @edit-group="editGroup"
      />

      <!-- Calendar grid -->
      <div class="calendar-main">
        <MonthNavigation />
        <CalendarGrid @day-click="onDayClick" />
      </div>
    </div>

    <!-- Modals (conditional) -->
    <EntryModal v-if="showEntry" @close="closeEntryModal" />
    <GroupModal v-if="showGroup" @close="closeGroupModal" />
    <ArchiveModal v-if="showArchiveModal" @close="closeArchiveModal" />
    <ImportModal v-if="showImportModal" @close="closeImportModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { useEntriesStore } from '@/stores/entries';
import { useGroupsStore } from '@/stores/groups';
import { useTemplatesStore } from '@/stores/templates';

import SidePanel from '@/components/calendar/SidePanel.vue';
import MonthNavigation from '@/components/calendar/MonthNavigation.vue';
import CalendarGrid from '@/components/calendar/CalendarGrid.vue';
import EntryModal from '@/components/modals/EntryModal.vue';
import GroupModal from '@/components/modals/GroupModal.vue';
import ArchiveModal from '@/components/modals/ArchiveModal.vue';
import ImportModal from '@/components/modals/ImportModal.vue';

// Stores
const calendarStore = useCalendarStore();
const entriesStore = useEntriesStore();
const groupsStore = useGroupsStore();
const templatesStore = useTemplatesStore();

// State
const showEntry = ref(false);
const showGroup = ref(false);
const showArchiveModal = ref(false);
const showImportModal = ref(false);
const editingEntryId = ref<string | null>(null);
const editingGroupId = ref<string | null>(null);

// Computed
const weekStart = computed({
  get: () => calendarStore.weekStart,
  set: (val) => calendarStore.setWeekStart(val)
});

const language = computed(() => calendarStore.language);

// i18n helper
const translations = {
  pl: {
    weekStartLabel: 'Tydzień zaczyna się od:',
    sunday: 'Niedzieli',
    monday: 'Poniedziałku',
    archivedEntries: 'Zarchiwizowane wpisy',
    importEvents: 'Importuj wydarzenia',
    saveCalendar: 'Zapisz kalendarz',
    loadCalendar: 'Wczytaj kalendarz',
    printCalendar: 'Drukuj kalendarz',
    addEntry: 'Dodaj wpis'
  },
  en: {
    weekStartLabel: 'Week starts on:',
    sunday: 'Sunday',
    monday: 'Monday',
    archivedEntries: 'Archived entries',
    importEvents: 'Import events',
    saveCalendar: 'Save calendar',
    loadCalendar: 'Load calendar',
    printCalendar: 'Print calendar',
    addEntry: 'Add entry'
  }
};

function t(key: string) {
  return translations[language.value][key] || key;
}

// Methods
function toggleLanguage() {
  calendarStore.setLanguage(language.value === 'pl' ? 'en' : 'pl');
}

function onWeekStartChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  calendarStore.setWeekStart(target.value as 'sunday' | 'monday');
}

function showEntryModal(entryId?: string) {
  editingEntryId.value = entryId || null;
  showEntry.value = true;
}

function closeEntryModal() {
  showEntry.value = false;
  editingEntryId.value = null;
}

function editEntry(id: string) {
  showEntryModal(id);
}

function showGroupModal(groupId?: string) {
  editingGroupId.value = groupId || null;
  showGroup.value = true;
}

function closeGroupModal() {
  showGroup.value = false;
  editingGroupId.value = null;
}

function editGroup(id: string) {
  showGroupModal(id);
}

function showArchive() {
  showArchiveModal.value = true;
}

function closeArchiveModal() {
  showArchiveModal.value = false;
}

function showImport() {
  showImportModal.value = true;
}

function closeImportModal() {
  showImportModal.value = false;
}

async function saveCalendar() {
  // TODO: Implement export to file
}

async function loadCalendar() {
  // TODO: Implement import from file
}

function printCalendar() {
  window.print();
}

function onDayClick(date: string) {
  // Pre-fill date in entry modal
  showEntryModal();
}

// Lifecycle
onMounted(async () => {
  calendarStore.loadSettings();
  await Promise.all([
    entriesStore.fetchEntries(),
    groupsStore.fetchGroups(),
    templatesStore.fetchTemplates()
  ]);
});
</script>

<style scoped>
.calendar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.header-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.calendar-layout {
  display: flex;
  gap: 1rem;
}

.calendar-main {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .calendar-layout {
    flex-direction: column;
  }
}
</style>
```

## Kryteria Akceptacji

- [ ] Layout zgodny z HTML mockup
- [ ] Header z kontrolkami (week start, language, buttons)
- [ ] Side panel + calendar grid layout
- [ ] Modals renderowane warunkowo
- [ ] onMounted ładuje dane ze stores
- [ ] i18n dla PL/EN
- [ ] Responsywność (mobile: column layout)

## Powiązane Zadania

- [TASK-008: Calendar Grid](../TASK-008-CalendarGrid/TASK.md)
- [TASK-011: Side Panel](../../STORY-004-SidePanel/TASK-011-SidePanelLayout/TASK.md)
- [TASK-015: Entry Modal](../../STORY-005-EntryModal/TASK-015-EntryModalUI/TASK.md)

## Scenariusze Testowe

1. CalendarView renderuje się bez błędów
2. Kliknięcie "Dodaj wpis" otwiera EntryModal
3. Zmiana języka aktualizuje teksty
4. onMounted ładuje dane

## Notatki

- Zastępuje Dashboard.vue jako główny widok
- Route: / lub /calendar
- print CSS powinien ukryć side panel
