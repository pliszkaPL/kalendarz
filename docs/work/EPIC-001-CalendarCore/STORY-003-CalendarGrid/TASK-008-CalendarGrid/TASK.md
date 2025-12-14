# TASK-008: Calendar Grid Component

## Metadane

- **ID**: `TASK-008`
- **Typ**: `task`
- **Tytuł**: Calendar Grid - Siatka kalendarza
- **Status**: `new`
- **Story**: [STORY-003: Calendar Grid UI](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja siatki kalendarza (7 kolumn x 6 wierszy) z nagłówkami dni tygodnia.

**Lokalizacja pliku**: `frontend/src/components/calendar/CalendarGrid.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/CalendarGrid.vue -->
<template>
  <div class="calendar-grid">
    <!-- Weekday headers -->
    <div
      v-for="day in weekdayHeaders"
      :key="day"
      class="weekday-header"
    >
      {{ day }}
    </div>

    <!-- Calendar days -->
    <CalendarDay
      v-for="dayInfo in calendarDays"
      :key="dayInfo.dateString"
      :date="dayInfo.date"
      :date-string="dayInfo.dateString"
      :is-other-month="dayInfo.isOtherMonth"
      :is-today="dayInfo.isToday"
      :entries="dayInfo.entries"
      @click="$emit('day-click', dayInfo.dateString)"
      @entry-click="(id) => $emit('entry-click', id)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { useEntriesStore } from '@/stores/entries';
import CalendarDay from './CalendarDay.vue';
import type { Entry } from '@/types';

// Emits
defineEmits<{
  (e: 'day-click', date: string): void;
  (e: 'entry-click', id: string): void;
}>();

// Stores
const calendarStore = useCalendarStore();
const entriesStore = useEntriesStore();

// Weekday labels
const weekdaysPolish = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb', 'Nd'];
const weekdaysEnglish = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekdaysPolishSunday = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb'];
const weekdaysEnglishSunday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const weekdayHeaders = computed(() => {
  const isPolish = calendarStore.language === 'pl';
  const startsSunday = calendarStore.weekStart === 'sunday';

  if (isPolish) {
    return startsSunday ? weekdaysPolishSunday : weekdaysPolish;
  }
  return startsSunday ? weekdaysEnglishSunday : weekdaysEnglish;
});

// Calendar days calculation
interface DayInfo {
  date: Date;
  dateString: string;
  isOtherMonth: boolean;
  isToday: boolean;
  entries: Entry[];
}

const calendarDays = computed<DayInfo[]>(() => {
  const year = calendarStore.currentYear;
  const month = calendarStore.currentMonth;
  const weekStart = calendarStore.weekStart;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Get day of week for first day (0 = Sunday, 6 = Saturday)
  let firstDayOfWeek = firstDayOfMonth.getDay();

  // Adjust for Monday start
  if (weekStart === 'monday') {
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  }

  const days: DayInfo[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Days from previous month
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month - 1, prevMonthLastDay - i);
    days.push(createDayInfo(date, true, today));
  }

  // Days of current month
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    days.push(createDayInfo(date, false, today));
  }

  // Days from next month (fill to 42 days = 6 weeks)
  const remainingDays = 42 - days.length;
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    days.push(createDayInfo(date, true, today));
  }

  return days;
});

function createDayInfo(date: Date, isOtherMonth: boolean, today: Date): DayInfo {
  const dateString = formatDateString(date);
  return {
    date,
    dateString,
    isOtherMonth,
    isToday: date.getTime() === today.getTime(),
    entries: getEntriesForDate(dateString)
  };
}

function formatDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getEntriesForDate(dateString: string): Entry[] {
  return entriesStore.activeEntries.filter(entry => {
    // Exact date match
    if (entry.date === dateString) return true;

    // TODO: Handle recurring entries (TASK-025)
    return false;
  });
}
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.weekday-header {
  background-color: #f5f5f5;
  padding: 0.5rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  color: #666;
}
</style>
```

## Kryteria Akceptacji

- [ ] Grid 7 kolumn (dni tygodnia)
- [ ] Nagłówki dni zależne od weekStart i language
- [ ] 42 dni wyświetlane (6 tygodni)
- [ ] Dni z innych miesięcy oznaczone isOtherMonth
- [ ] Dzień dzisiejszy oznaczony isToday
- [ ] Entries przypisane do odpowiednich dni
- [ ] Emituje day-click i entry-click

## Powiązane Zadania

- [TASK-009: Calendar Day](../TASK-009-CalendarDay/TASK.md)
- [TASK-025: Recurrence Calculator](../../STORY-008-RecurrenceRules/TASK-025-RecurrenceCalculator/TASK.md)

## Scenariusze Testowe

1. Grid renderuje 49 elementów (7 headers + 42 days)
2. Zmiana weekStart zmienia kolejność nagłówków
3. Grudzień 2025 zaczyna się w poniedziałek (dzień 1)
4. Wpisy wyświetlane w odpowiednich dniach

## Notatki

- formatDateString zwraca YYYY-MM-DD (ISO format)
- getEntriesForDate będzie rozszerzony o recurrence w TASK-025
- 42 dni = zawsze 6 wierszy (konsystentny layout)
