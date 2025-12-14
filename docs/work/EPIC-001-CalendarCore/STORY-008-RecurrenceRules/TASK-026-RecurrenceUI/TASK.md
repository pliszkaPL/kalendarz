# TASK-026: Recurrence UI

## Metadane

- **ID**: `TASK-026`
- **Typ**: `task`
- **Tytuł**: Recurrence UI - Podgląd wystąpień
- **Status**: `new`
- **Story**: [STORY-008: Recurrence Rules](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Komponent do podglądu następnych wystąpień wpisu powtarzającego się.

**Lokalizacja pliku**: `frontend/src/components/common/RecurrencePreview.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/common/RecurrencePreview.vue -->
<template>
  <div class="recurrence-preview">
    <div class="preview-header">
      <span class="icon">🔄</span>
      <span>{{ t('nextOccurrences') }}</span>
    </div>

    <div class="occurrences-list">
      <div
        v-for="(date, index) in nextOccurrences"
        :key="index"
        class="occurrence-item"
      >
        <span class="date">{{ formatDate(date) }}</span>
        <span class="relative">{{ getRelativeTime(date) }}</span>
      </div>
    </div>

    <div v-if="nextOccurrences.length === 0" class="no-occurrences">
      {{ t('noUpcomingOccurrences') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { recurrenceCalculator } from '@/services/RecurrenceCalculator';
import type { Entry } from '@/types';

// Props
const props = withDefaults(defineProps<{
  entry: Entry;
  count?: number;
}>(), {
  count: 5
});

// Store
const calendarStore = useCalendarStore();

// Computed
const nextOccurrences = computed(() => {
  return recurrenceCalculator.getNextOccurrences(props.entry, props.count);
});

// i18n
const translations = {
  pl: {
    nextOccurrences: 'Następne wystąpienia',
    noUpcomingOccurrences: 'Brak nadchodzących wystąpień',
    today: 'Dzisiaj',
    tomorrow: 'Jutro',
    inDays: 'za {n} dni'
  },
  en: {
    nextOccurrences: 'Next occurrences',
    noUpcomingOccurrences: 'No upcoming occurrences',
    today: 'Today',
    tomorrow: 'Tomorrow',
    inDays: 'in {n} days'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function formatDate(date: Date): string {
  return date.toLocaleDateString(
    calendarStore.language === 'pl' ? 'pl-PL' : 'en-US',
    { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }
  );
}

function getRelativeTime(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('today');
  if (diffDays === 1) return t('tomorrow');
  return t('inDays').replace('{n}', String(diffDays));
}
</script>

<style scoped>
.recurrence-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.icon {
  font-size: 1.25rem;
}

.occurrences-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.occurrence-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
}

.date {
  font-size: 0.875rem;
}

.relative {
  font-size: 0.75rem;
  color: #666;
}

.no-occurrences {
  color: #999;
  font-size: 0.875rem;
  text-align: center;
}
</style>
```

## Kryteria Akceptacji

- [ ] Pokazuje następne N wystąpień
- [ ] Formatuje datę lokalizowaną
- [ ] Pokazuje relatywny czas (za X dni)
- [ ] Empty state gdy brak wystąpień

## Powiązane Zadania

- [TASK-025: Recurrence Calculator](../TASK-025-RecurrenceCalculator/TASK.md)
- [TASK-015: Entry Modal UI](../../STORY-005-EntryModal/TASK-015-EntryModalUI/TASK.md)

## Scenariusze Testowe

1. Wpis yearly pokazuje następne 5 rocznic
2. "Dzisiaj" dla dzisiejszej daty
3. "za 30 dni" dla daty za miesiąc

## Notatki

- Używany w EntryModal i detailach wpisu
- Default count: 5
- Integracja z RecurrenceCalculator
