# TASK-010: Month Navigation Component

## Metadane

- **ID**: `TASK-010`
- **Typ**: `task`
- **Tytuł**: Month Navigation - Nawigacja miesiąc/rok
- **Status**: `new`
- **Story**: [STORY-003: Calendar Grid UI](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja nawigacji po miesiącach z możliwością szybkiego wyboru miesiąca i roku.

**Lokalizacja pliku**: `frontend/src/components/calendar/MonthNavigation.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/MonthNavigation.vue -->
<template>
  <div class="month-navigation">
    <button
      class="nav-btn"
      :title="t('prevMonth')"
      @click="calendarStore.prevMonth()"
    >
      ‹
    </button>

    <div class="month-year-display">
      <span
        class="clickable-month"
        @click="showMonthPicker = true"
      >
        {{ monthName }}
      </span>
      <span
        class="clickable-year"
        @click="showYearPicker = true"
      >
        {{ year }}
      </span>
    </div>

    <button
      class="nav-btn"
      :title="t('nextMonth')"
      @click="calendarStore.nextMonth()"
    >
      ›
    </button>

    <!-- Month Picker Modal -->
    <div v-if="showMonthPicker" class="picker-overlay" @click.self="showMonthPicker = false">
      <div class="picker-content month-picker">
        <div class="picker-header">
          <h3>{{ t('selectMonth') }}</h3>
          <button class="close-btn" @click="showMonthPicker = false">×</button>
        </div>
        <div class="months-grid">
          <button
            v-for="(name, index) in monthNames"
            :key="index"
            class="month-btn"
            :class="{ active: index === month }"
            @click="selectMonth(index)"
          >
            {{ name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Year Picker Modal -->
    <div v-if="showYearPicker" class="picker-overlay" @click.self="showYearPicker = false">
      <div class="picker-content year-picker">
        <div class="picker-header">
          <button class="nav-btn" @click="yearRangeStart -= 12">‹</button>
          <h3>{{ yearRangeStart }} - {{ yearRangeStart + 11 }}</h3>
          <button class="nav-btn" @click="yearRangeStart += 12">›</button>
          <button class="close-btn" @click="showYearPicker = false">×</button>
        </div>
        <div class="years-grid">
          <button
            v-for="y in yearRange"
            :key="y"
            class="year-btn"
            :class="{ active: y === year }"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCalendarStore } from '@/stores/calendar';

// Store
const calendarStore = useCalendarStore();

// State
const showMonthPicker = ref(false);
const showYearPicker = ref(false);
const yearRangeStart = ref(Math.floor(calendarStore.currentYear / 12) * 12);

// Computed
const month = computed(() => calendarStore.currentMonth);
const year = computed(() => calendarStore.currentYear);
const monthName = computed(() => calendarStore.monthName);

const monthNames = computed(() => {
  const formatter = new Intl.DateTimeFormat(
    calendarStore.language === 'pl' ? 'pl-PL' : 'en-US',
    { month: 'long' }
  );
  return Array.from({ length: 12 }, (_, i) =>
    formatter.format(new Date(2024, i, 1))
  );
});

const yearRange = computed(() =>
  Array.from({ length: 12 }, (_, i) => yearRangeStart.value + i)
);

// i18n
const translations = {
  pl: {
    prevMonth: 'Poprzedni miesiąc',
    nextMonth: 'Następny miesiąc',
    selectMonth: 'Wybierz miesiąc',
    selectYear: 'Wybierz rok'
  },
  en: {
    prevMonth: 'Previous month',
    nextMonth: 'Next month',
    selectMonth: 'Select month',
    selectYear: 'Select year'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function selectMonth(index: number) {
  calendarStore.setMonth(index);
  showMonthPicker.value = false;
}

function selectYear(y: number) {
  calendarStore.setYear(y);
  showYearPicker.value = false;
}
</script>

<style scoped>
.month-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  position: relative;
}

.nav-btn {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background-color: #f0f0f0;
}

.month-year-display {
  display: flex;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.clickable-month,
.clickable-year {
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.clickable-month:hover,
.clickable-year:hover {
  background-color: #f0f0f0;
}

/* Picker overlay */
.picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.picker-content {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  min-width: 280px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.picker-header h3 {
  margin: 0;
  font-size: 1rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.months-grid,
.years-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.month-btn,
.year-btn {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.month-btn:hover,
.year-btn:hover {
  background-color: #f0f0f0;
}

.month-btn.active,
.year-btn.active {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}
</style>
```

## Kryteria Akceptacji

- [ ] Przyciski poprzedni/następny miesiąc
- [ ] Wyświetla nazwę miesiąca (lokalizowana)
- [ ] Wyświetla rok
- [ ] Kliknięcie miesiąca otwiera month picker
- [ ] Kliknięcie roku otwiera year picker
- [ ] Month picker: siatka 3x4 miesięcy
- [ ] Year picker: siatka 3x4 lat z nawigacją dekad
- [ ] Aktualny miesiąc/rok podświetlony

## Powiązane Zadania

- [TASK-007: Calendar View](../TASK-007-CalendarView/TASK.md)

## Scenariusze Testowe

1. prevMonth z Stycznia przechodzi do Grudnia poprzedniego roku
2. nextMonth z Grudnia przechodzi do Stycznia następnego roku
3. Month picker pokazuje 12 miesięcy
4. Year picker nawiguje po dekadach
5. Wybór miesiąca zamyka picker i aktualizuje widok

## Notatki

- Intl.DateTimeFormat dla lokalizowanych nazw miesięcy
- yearRangeStart dla nawigacji dekad (12 lat na stronę)
- Picker overlay zamyka się klikając poza modal
