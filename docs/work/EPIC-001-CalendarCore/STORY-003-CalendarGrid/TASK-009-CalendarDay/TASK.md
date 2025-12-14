# TASK-009: Calendar Day Component

## Metadane

- **ID**: `TASK-009`
- **Typ**: `task`
- **Tytuł**: Calendar Day - Pojedynczy dzień
- **Status**: `new`
- **Story**: [STORY-003: Calendar Grid UI](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja komponentu pojedynczego dnia w kalendarzu.

**Lokalizacja pliku**: `frontend/src/components/calendar/CalendarDay.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/CalendarDay.vue -->
<template>
  <div
    class="calendar-day"
    :class="{
      'other-month': isOtherMonth,
      'is-today': isToday,
      'has-entries': entries.length > 0
    }"
    @click="$emit('click')"
  >
    <div class="day-number">{{ dayNumber }}</div>
    <div class="day-entries">
      <div
        v-for="entry in visibleEntries"
        :key="entry.id"
        class="day-entry"
        :style="{ backgroundColor: getEntryColor(entry) }"
        :title="entry.name"
        @click.stop="$emit('entry-click', entry.id)"
      >
        {{ getEntryIcon(entry) }} {{ entry.name }}
      </div>
      <div
        v-if="hiddenCount > 0"
        class="more-entries"
        @click.stop="$emit('show-more')"
      >
        +{{ hiddenCount }} {{ hiddenCount === 1 ? 'więcej' : 'więcej' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTemplatesStore } from '@/stores/templates';
import { useGroupsStore } from '@/stores/groups';
import type { Entry } from '@/types';

// Props
const props = defineProps<{
  date: Date;
  dateString: string;
  isOtherMonth: boolean;
  isToday: boolean;
  entries: Entry[];
}>();

// Emits
defineEmits<{
  (e: 'click'): void;
  (e: 'entry-click', id: string): void;
  (e: 'show-more'): void;
}>();

// Stores
const templatesStore = useTemplatesStore();
const groupsStore = useGroupsStore();

// Constants
const MAX_VISIBLE_ENTRIES = 3;

// Computed
const dayNumber = computed(() => props.date.getDate());

const visibleEntries = computed(() =>
  props.entries.slice(0, MAX_VISIBLE_ENTRIES)
);

const hiddenCount = computed(() =>
  Math.max(0, props.entries.length - MAX_VISIBLE_ENTRIES)
);

// Methods
function getEntryColor(entry: Entry): string {
  // First try group color
  if (entry.groupId) {
    const group = groupsStore.getGroupById(entry.groupId);
    if (group) return group.color;
  }

  // Then try template color
  if (entry.templateId) {
    const template = templatesStore.getTemplateById(entry.templateId);
    if (template) return template.backgroundColor;
  }

  // Default color
  return '#74b9ff';
}

function getEntryIcon(entry: Entry): string {
  if (entry.templateId) {
    const template = templatesStore.getTemplateById(entry.templateId);
    if (template) return template.icon;
  }
  return '📅';
}
</script>

<style scoped>
.calendar-day {
  background-color: #fff;
  min-height: 100px;
  padding: 0.25rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background-color: #f8f9fa;
}

.calendar-day.other-month {
  background-color: #fafafa;
}

.calendar-day.other-month .day-number {
  color: #aaa;
}

.calendar-day.is-today {
  background-color: #e3f2fd;
}

.calendar-day.is-today .day-number {
  background-color: #2196f3;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.day-entries {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.day-entry {
  font-size: 0.75rem;
  padding: 2px 4px;
  border-radius: 3px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.day-entry:hover {
  filter: brightness(0.9);
}

.more-entries {
  font-size: 0.7rem;
  color: #666;
  padding: 2px 4px;
  cursor: pointer;
}

.more-entries:hover {
  color: #333;
  text-decoration: underline;
}
</style>
```

## Kryteria Akceptacji

- [ ] Wyświetla numer dnia
- [ ] Klasa other-month dla dni z innych miesięcy
- [ ] Klasa is-today dla dzisiejszego dnia
- [ ] Wyświetla max 3 wpisy + "+X więcej"
- [ ] Kolor wpisu z grupy lub szablonu
- [ ] Ikona wpisu z szablonu
- [ ] Emituje click, entry-click, show-more

## Powiązane Zadania

- [TASK-008: Calendar Grid](../TASK-008-CalendarGrid/TASK.md)

## Scenariusze Testowe

1. Dzień z isOtherMonth ma przyciemniony tekst
2. Dzień z isToday ma niebieski marker
3. 5 wpisów pokazuje 3 + "+2 więcej"
4. Kliknięcie wpisu emituje entry-click z ID

## Notatki

- MAX_VISIBLE_ENTRIES = 3 (można konfigurować)
- Kolor: grupa > szablon > domyślny
- Ikona: szablon > domyślna
- text-overflow: ellipsis dla długich nazw
