# TASK-006: Pinia Stores

## Metadane

- **ID**: `TASK-006`
- **Typ**: `task`
- **Tytuł**: Pinia Stores - State Management
- **Status**: `new`
- **Story**: [STORY-002: Storage Layer](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja Pinia stores dla zarządzania stanem aplikacji. Stores używają StorageService do persystencji.

**Lokalizacja plików**:
- `frontend/src/stores/entries.ts`
- `frontend/src/stores/groups.ts`
- `frontend/src/stores/templates.ts`
- `frontend/src/stores/calendar.ts`

## Kontrakt (Stores)

```typescript
// frontend/src/stores/entries.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Entry } from '@/types';
import { localStorageService } from '@/services/storage/LocalStorageService';

export const useEntriesStore = defineStore('entries', () => {
  // State
  const entries = ref<Entry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeEntries = computed(() =>
    entries.value.filter(e => !e.isArchived)
  );

  const archivedEntries = computed(() =>
    entries.value.filter(e => e.isArchived)
  );

  const getEntriesByDate = computed(() => (date: string) =>
    entries.value.filter(e => e.date === date && !e.isArchived)
  );

  const getEntriesByGroup = computed(() => (groupId: string) =>
    entries.value.filter(e => e.groupId === groupId && !e.isArchived)
  );

  // Actions
  async function fetchEntries() {
    loading.value = true;
    error.value = null;
    try {
      entries.value = await localStorageService.getEntries();
    } catch (e) {
      error.value = 'Nie udało się pobrać wpisów';
    } finally {
      loading.value = false;
    }
  }

  async function addEntry(entry: Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>) {
    const newEntry: Entry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const saved = await localStorageService.saveEntry(newEntry);
    entries.value.push(saved);
    return saved;
  }

  async function updateEntry(entry: Entry) {
    const saved = await localStorageService.saveEntry(entry);
    const index = entries.value.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      entries.value[index] = saved;
    }
    return saved;
  }

  async function deleteEntry(id: string) {
    await localStorageService.deleteEntry(id);
    entries.value = entries.value.filter(e => e.id !== id);
  }

  async function archiveEntry(id: string) {
    const entry = entries.value.find(e => e.id === id);
    if (entry) {
      await updateEntry({ ...entry, isArchived: true });
    }
  }

  return {
    // State
    entries,
    loading,
    error,
    // Getters
    activeEntries,
    archivedEntries,
    getEntriesByDate,
    getEntriesByGroup,
    // Actions
    fetchEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    archiveEntry
  };
});
```

```typescript
// frontend/src/stores/groups.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Group } from '@/types';
import { localStorageService } from '@/services/storage/LocalStorageService';

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<Group[]>([]);
  const loading = ref(false);

  const getGroupById = computed(() => (id: string) =>
    groups.value.find(g => g.id === id)
  );

  async function fetchGroups() {
    loading.value = true;
    try {
      groups.value = await localStorageService.getGroups();
    } finally {
      loading.value = false;
    }
  }

  async function addGroup(group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) {
    const newGroup: Group = {
      ...group,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const saved = await localStorageService.saveGroup(newGroup);
    groups.value.push(saved);
    return saved;
  }

  async function updateGroup(group: Group) {
    const saved = await localStorageService.saveGroup(group);
    const index = groups.value.findIndex(g => g.id === group.id);
    if (index >= 0) {
      groups.value[index] = saved;
    }
    return saved;
  }

  async function deleteGroup(id: string) {
    await localStorageService.deleteGroup(id);
    groups.value = groups.value.filter(g => g.id !== id);
  }

  return {
    groups,
    loading,
    getGroupById,
    fetchGroups,
    addGroup,
    updateGroup,
    deleteGroup
  };
});
```

```typescript
// frontend/src/stores/templates.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Template } from '@/types';
import { localStorageService } from '@/services/storage/LocalStorageService';

export const useTemplatesStore = defineStore('templates', () => {
  const templates = ref<Template[]>([]);
  const loading = ref(false);

  const activeTemplates = computed(() =>
    templates.value.filter(t => !t.isArchived)
  );

  const systemTemplates = computed(() =>
    templates.value.filter(t => t.isSystem)
  );

  const userTemplates = computed(() =>
    templates.value.filter(t => !t.isSystem)
  );

  const getTemplateById = computed(() => (id: string) =>
    templates.value.find(t => t.id === id)
  );

  async function fetchTemplates() {
    loading.value = true;
    try {
      templates.value = await localStorageService.getTemplates();
    } finally {
      loading.value = false;
    }
  }

  async function addTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) {
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const saved = await localStorageService.saveTemplate(newTemplate);
    templates.value.push(saved);
    return saved;
  }

  async function updateTemplate(template: Template) {
    const saved = await localStorageService.saveTemplate(template);
    const index = templates.value.findIndex(t => t.id === template.id);
    if (index >= 0) {
      templates.value[index] = saved;
    }
    return saved;
  }

  async function archiveTemplate(id: string) {
    await localStorageService.archiveTemplate(id);
    const index = templates.value.findIndex(t => t.id === id);
    if (index >= 0) {
      templates.value[index].isArchived = true;
    }
  }

  return {
    templates,
    loading,
    activeTemplates,
    systemTemplates,
    userTemplates,
    getTemplateById,
    fetchTemplates,
    addTemplate,
    updateTemplate,
    archiveTemplate
  };
});
```

```typescript
// frontend/src/stores/calendar.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export type WeekStart = 'sunday' | 'monday';
export type Language = 'pl' | 'en';

export const useCalendarStore = defineStore('calendar', () => {
  // State
  const currentYear = ref(new Date().getFullYear());
  const currentMonth = ref(new Date().getMonth()); // 0-indexed
  const weekStart = ref<WeekStart>('monday');
  const language = ref<Language>('pl');

  // Getters
  const currentDate = computed(() =>
    new Date(currentYear.value, currentMonth.value, 1)
  );

  const monthName = computed(() => {
    const formatter = new Intl.DateTimeFormat(
      language.value === 'pl' ? 'pl-PL' : 'en-US',
      { month: 'long' }
    );
    return formatter.format(currentDate.value);
  });

  // Actions
  function nextMonth() {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
  }

  function prevMonth() {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
  }

  function setMonth(month: number) {
    currentMonth.value = month;
  }

  function setYear(year: number) {
    currentYear.value = year;
  }

  function setWeekStart(start: WeekStart) {
    weekStart.value = start;
    localStorage.setItem('kalendarz_weekStart', start);
  }

  function setLanguage(lang: Language) {
    language.value = lang;
    localStorage.setItem('kalendarz_language', lang);
  }

  function loadSettings() {
    const savedWeekStart = localStorage.getItem('kalendarz_weekStart') as WeekStart;
    const savedLanguage = localStorage.getItem('kalendarz_language') as Language;
    if (savedWeekStart) weekStart.value = savedWeekStart;
    if (savedLanguage) language.value = savedLanguage;
  }

  return {
    currentYear,
    currentMonth,
    weekStart,
    language,
    currentDate,
    monthName,
    nextMonth,
    prevMonth,
    setMonth,
    setYear,
    setWeekStart,
    setLanguage,
    loadSettings
  };
});
```

## Kryteria Akceptacji

- [ ] useEntriesStore: CRUD + archiwizacja + filtrowanie
- [ ] useGroupsStore: CRUD
- [ ] useTemplatesStore: CRUD + archiwizacja + filtrowanie (system/user)
- [ ] useCalendarStore: nawigacja miesiąc/rok, ustawienia (weekStart, language)
- [ ] Composition API (setup stores)
- [ ] Loading states
- [ ] Persystencja przez LocalStorageService

## Powiązane Zadania

- [TASK-005: LocalStorage Implementation](../TASK-005-LocalStorageImpl/TASK.md)
- [TASK-007: Calendar View](../../STORY-003-CalendarGrid/TASK-007-CalendarView/TASK.md)

## Scenariusze Testowe

1. fetchEntries ładuje dane z localStorage
2. addEntry dodaje wpis i zapisuje
3. deleteEntry usuwa wpis
4. nextMonth/prevMonth zmienia miesiąc
5. setWeekStart persystuje ustawienie

## Notatki

- Composition API stores (nie Options API)
- crypto.randomUUID() dla generowania ID
- currentMonth jest 0-indexed (jak JavaScript Date)
- Settings persystowane osobno (nie w StorageService)
