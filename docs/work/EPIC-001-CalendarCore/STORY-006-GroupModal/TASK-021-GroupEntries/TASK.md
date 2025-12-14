# TASK-021: Group Entries Section

## Metadane

- **ID**: `TASK-021`
- **Typ**: `task`
- **Tytuł**: Group Entries Section
- **Status**: `new`
- **Story**: [STORY-006: Group Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Sekcja w modalu grupy do dodawania wpisów bezpośrednio.

**Lokalizacja pliku**: `frontend/src/components/modals/GroupEntriesSection.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/modals/GroupEntriesSection.vue -->
<template>
  <div class="group-entries-section">
    <div class="section-header">
      <label>{{ t('groupEntries') }}:</label>
    </div>

    <div class="add-entry-form">
      <input
        v-model="newEntry.date"
        type="date"
        :placeholder="t('date')"
      />
      <select v-model="newEntry.recurrenceType">
        <option value="exact">{{ t('exactDay') }}</option>
        <option value="yearly">{{ t('yearly') }}</option>
        <option value="custom">{{ t('custom') }}</option>
      </select>
      <button type="button" @click="addEntry">{{ t('addEntry') }}</button>
    </div>

    <div class="group-entries-list">
      <div
        v-for="(entry, index) in modelValue"
        :key="index"
        class="entry-row"
      >
        <span class="entry-date">{{ formatDate(entry.date) }}</span>
        <span class="entry-type">{{ getTypeLabel(entry.recurrenceType) }}</span>
        <button type="button" class="remove-btn" @click="removeEntry(index)">×</button>
      </div>
    </div>

    <div v-if="modelValue.length === 0" class="empty-state">
      {{ t('noEntries') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useCalendarStore } from '@/stores/calendar';

// Types
interface GroupEntry {
  date: string;
  recurrenceType: 'exact' | 'yearly' | 'custom';
}

// Props
const props = defineProps<{
  modelValue: GroupEntry[];
  groupId?: string | null;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: GroupEntry[]): void;
}>();

// Store
const calendarStore = useCalendarStore();

// State
const newEntry = reactive<GroupEntry>({
  date: '',
  recurrenceType: 'yearly'
});

// i18n
const translations = {
  pl: {
    groupEntries: 'Wpisy grupy',
    date: 'Data',
    exactDay: 'Dokładny dzień',
    yearly: 'Powtarzaj co rok',
    custom: 'Niestandardowe powtarzanie',
    addEntry: 'Dodaj wpis',
    noEntries: 'Brak wpisów'
  },
  en: {
    groupEntries: 'Group Entries',
    date: 'Date',
    exactDay: 'Exact day',
    yearly: 'Repeat yearly',
    custom: 'Custom repeat',
    addEntry: 'Add Entry',
    noEntries: 'No entries'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function addEntry() {
  if (!newEntry.date) return;

  emit('update:modelValue', [
    ...props.modelValue,
    { ...newEntry }
  ]);

  newEntry.date = '';
}

function removeEntry(index: number) {
  const updated = props.modelValue.filter((_, i) => i !== index);
  emit('update:modelValue', updated);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(
    calendarStore.language === 'pl' ? 'pl-PL' : 'en-US'
  );
}

function getTypeLabel(type: string): string {
  return translations[calendarStore.language][type === 'exact' ? 'exactDay' : type === 'yearly' ? 'yearly' : 'custom'];
}
</script>

<style scoped>
.group-entries-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.section-header {
  margin-bottom: 0.5rem;
}

.section-header label {
  font-weight: 500;
}

.add-entry-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.add-entry-form input,
.add-entry-form select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-entry-form input {
  flex: 1;
}

.add-entry-form button {
  padding: 0.5rem 1rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.group-entries-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.entry-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.entry-date {
  flex: 1;
}

.entry-type {
  font-size: 0.875rem;
  color: #666;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  color: #999;
}

.remove-btn:hover {
  color: #f44336;
}

.empty-state {
  color: #999;
  font-size: 0.875rem;
  text-align: center;
  padding: 0.5rem;
}
</style>
```

## Kryteria Akceptacji

- [ ] Formularz dodawania wpisu (date, recurrenceType)
- [ ] Lista dodanych wpisów
- [ ] Usuwanie wpisu z listy
- [ ] v-model binding
- [ ] Empty state

## Powiązane Zadania

- [TASK-019: Group Modal UI](../TASK-019-GroupModalUI/TASK.md)

## Scenariusze Testowe

1. Dodanie wpisu z datą dodaje do listy
2. Dodanie bez daty nie dodaje
3. Usunięcie wpisu aktualizuje listę
4. modelValue zawiera wszystkie dodane wpisy

## Notatki

- Wpisy tworzone w handleSubmit modala grupy
- recurrenceType dla określenia czy yearly
- Zgodne z HTML mockup
