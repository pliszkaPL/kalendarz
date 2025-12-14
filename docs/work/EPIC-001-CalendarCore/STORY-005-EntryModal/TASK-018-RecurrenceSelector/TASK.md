# TASK-018: Recurrence Selector Component

## Metadane

- **ID**: `TASK-018`
- **Typ**: `task`
- **Tytuł**: Recurrence Selector Component
- **Status**: `new`
- **Story**: [STORY-005: Entry Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja selektora reguł powtarzania dla trybu "custom".

**Lokalizacja pliku**: `frontend/src/components/common/RecurrenceSelector.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/common/RecurrenceSelector.vue -->
<template>
  <div class="recurrence-selector">
    <!-- Mode selector -->
    <div class="form-group">
      <label>{{ t('repeatMode') }}:</label>
      <select v-model="mode" @change="onModeChange">
        <option value="interval">{{ t('everyX') }}</option>
        <option value="nthWeekday">{{ t('nthWeekday') }}</option>
        <option value="selectedDates">{{ t('selectDates') }}</option>
      </select>
    </div>

    <!-- Interval mode -->
    <div v-if="mode === 'interval'" class="interval-config">
      <div class="form-row">
        <label>{{ t('every') }}</label>
        <input
          v-model.number="interval"
          type="number"
          min="1"
          max="365"
          @change="updateRule"
        />
        <select v-model="unit" @change="updateRule">
          <option value="day">{{ t('days') }}</option>
          <option value="week">{{ t('weeks') }}</option>
          <option value="month">{{ t('months') }}</option>
        </select>
      </div>

      <!-- Days of week for weekly -->
      <div v-if="unit === 'week'" class="days-of-week">
        <label>{{ t('onDays') }}:</label>
        <div class="day-buttons">
          <button
            v-for="(label, index) in dayLabels"
            :key="index"
            type="button"
            :class="{ active: daysOfWeek.includes(index) }"
            @click="toggleDay(index)"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <!-- Day of month for monthly -->
      <div v-if="unit === 'month'" class="day-of-month">
        <label>{{ t('onDay') }}:</label>
        <input
          v-model.number="dayOfMonth"
          type="number"
          min="1"
          max="31"
          @change="updateRule"
        />
      </div>
    </div>

    <!-- Nth weekday mode -->
    <div v-if="mode === 'nthWeekday'" class="nth-weekday-config">
      <div class="form-row">
        <select v-model.number="weekOfMonth" @change="updateRule">
          <option :value="1">{{ t('first') }}</option>
          <option :value="2">{{ t('second') }}</option>
          <option :value="3">{{ t('third') }}</option>
          <option :value="4">{{ t('fourth') }}</option>
          <option :value="-1">{{ t('last') }}</option>
        </select>
        <select v-model.number="dayOfWeekInMonth" @change="updateRule">
          <option v-for="(label, index) in fullDayLabels" :key="index" :value="index">
            {{ label }}
          </option>
        </select>
        <span>{{ t('ofMonth') }}</span>
      </div>
    </div>

    <!-- Selected dates mode -->
    <div v-if="mode === 'selectedDates'" class="selected-dates-config">
      <div class="date-picker">
        <input type="date" v-model="newDate" />
        <button type="button" @click="addDate">+</button>
      </div>
      <div class="dates-list">
        <span v-for="date in selectedDates" :key="date" class="date-chip">
          {{ formatDate(date) }}
          <button type="button" @click="removeDate(date)">×</button>
        </span>
      </div>
    </div>

    <!-- Date range -->
    <div class="date-range">
      <div class="form-group">
        <label>{{ t('startDate') }}:</label>
        <input v-model="startDate" type="date" @change="updateRule" />
      </div>
      <div class="form-group">
        <label>{{ t('endDate') }}:</label>
        <input v-model="endDate" type="date" @change="updateRule" />
        <small>{{ t('leaveEmptyForNoEnd') }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import type { RecurrenceRule, RecurrenceUnit, DayOfWeek, WeekOfMonth } from '@/types';

// Props
const props = defineProps<{
  modelValue: RecurrenceRule | null;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: RecurrenceRule): void;
}>();

// Store
const calendarStore = useCalendarStore();

// State
const mode = ref<'interval' | 'nthWeekday' | 'selectedDates'>('interval');
const interval = ref(1);
const unit = ref<RecurrenceUnit>('week');
const daysOfWeek = ref<number[]>([]);
const dayOfMonth = ref(1);
const weekOfMonth = ref<WeekOfMonth>(1);
const dayOfWeekInMonth = ref<DayOfWeek>(1);
const selectedDates = ref<string[]>([]);
const startDate = ref('');
const endDate = ref('');
const newDate = ref('');

// Day labels
const dayLabels = calendarStore.language === 'pl'
  ? ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']
  : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const fullDayLabels = calendarStore.language === 'pl'
  ? ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota']
  : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// i18n
const translations = {
  pl: {
    repeatMode: 'Tryb powtarzania',
    everyX: 'Co X dni/tygodni/miesięcy',
    nthWeekday: 'N-ty dzień tygodnia miesiąca',
    selectDates: 'Wybierz daty ręcznie',
    every: 'Co',
    days: 'dni',
    weeks: 'tygodni',
    months: 'miesięcy',
    onDays: 'W dniach',
    onDay: 'Dnia',
    first: 'Pierwszy',
    second: 'Drugi',
    third: 'Trzeci',
    fourth: 'Czwarty',
    last: 'Ostatni',
    ofMonth: 'miesiąca',
    startDate: 'Data rozpoczęcia',
    endDate: 'Data zakończenia',
    leaveEmptyForNoEnd: '(puste = bez końca)'
  },
  en: {
    repeatMode: 'Repeat mode',
    everyX: 'Every X days/weeks/months',
    nthWeekday: 'Nth weekday of month',
    selectDates: 'Select dates manually',
    every: 'Every',
    days: 'days',
    weeks: 'weeks',
    months: 'months',
    onDays: 'On days',
    onDay: 'On day',
    first: 'First',
    second: 'Second',
    third: 'Third',
    fourth: 'Fourth',
    last: 'Last',
    ofMonth: 'of month',
    startDate: 'Start date',
    endDate: 'End date',
    leaveEmptyForNoEnd: '(empty = no end)'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function onModeChange() {
  updateRule();
}

function toggleDay(day: number) {
  const index = daysOfWeek.value.indexOf(day);
  if (index >= 0) {
    daysOfWeek.value.splice(index, 1);
  } else {
    daysOfWeek.value.push(day);
  }
  updateRule();
}

function addDate() {
  if (newDate.value && !selectedDates.value.includes(newDate.value)) {
    selectedDates.value.push(newDate.value);
    selectedDates.value.sort();
    newDate.value = '';
    updateRule();
  }
}

function removeDate(date: string) {
  selectedDates.value = selectedDates.value.filter(d => d !== date);
  updateRule();
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(
    calendarStore.language === 'pl' ? 'pl-PL' : 'en-US'
  );
}

function updateRule() {
  let rule: RecurrenceRule;

  if (mode.value === 'selectedDates') {
    rule = {
      type: 'custom',
      selectedDates: [...selectedDates.value]
    };
  } else if (mode.value === 'nthWeekday') {
    rule = {
      type: 'custom',
      unit: 'month',
      interval: 1,
      weekOfMonth: weekOfMonth.value,
      dayOfWeekInMonth: dayOfWeekInMonth.value as DayOfWeek
    };
  } else {
    rule = {
      type: 'custom',
      interval: interval.value,
      unit: unit.value
    };

    if (unit.value === 'week' && daysOfWeek.value.length > 0) {
      rule.daysOfWeek = daysOfWeek.value as DayOfWeek[];
    }
    if (unit.value === 'month') {
      rule.dayOfMonth = dayOfMonth.value;
    }
  }

  if (startDate.value) {
    rule.startDate = startDate.value;
  }
  if (endDate.value) {
    rule.endDate = endDate.value;
  }

  emit('update:modelValue', rule);
}

// Load from modelValue
onMounted(() => {
  if (props.modelValue) {
    const rule = props.modelValue;

    if (rule.selectedDates?.length) {
      mode.value = 'selectedDates';
      selectedDates.value = [...rule.selectedDates];
    } else if (rule.weekOfMonth !== undefined) {
      mode.value = 'nthWeekday';
      weekOfMonth.value = rule.weekOfMonth;
      dayOfWeekInMonth.value = rule.dayOfWeekInMonth ?? 1;
    } else {
      mode.value = 'interval';
      interval.value = rule.interval ?? 1;
      unit.value = rule.unit ?? 'week';
      daysOfWeek.value = rule.daysOfWeek ? [...rule.daysOfWeek] : [];
      dayOfMonth.value = rule.dayOfMonth ?? 1;
    }

    startDate.value = rule.startDate ?? '';
    endDate.value = rule.endDate ?? '';
  }
});
</script>

<style scoped>
.recurrence-selector {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.form-group small {
  color: #666;
  font-size: 0.75rem;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.form-row input[type="number"] {
  width: 60px;
}

.day-buttons {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.day-buttons button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.75rem;
}

.day-buttons button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.date-picker {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.dates-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #e3f2fd;
  border-radius: 16px;
  font-size: 0.875rem;
}

.date-chip button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #1976d2;
}

.date-range {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
}
</style>
```

## Kryteria Akceptacji

- [ ] Trzy tryby: interval, nthWeekday, selectedDates
- [ ] Interval: co X dni/tygodni/miesięcy
- [ ] Interval weekly: wybór dni tygodnia
- [ ] Interval monthly: wybór dnia miesiąca
- [ ] nthWeekday: N-ty dzień tygodnia miesiąca
- [ ] selectedDates: ręczny wybór dat
- [ ] Start/end date dla wszystkich trybów
- [ ] v-model binding z RecurrenceRule

## Powiązane Zadania

- [TASK-015: Entry Modal UI](../TASK-015-EntryModalUI/TASK.md)
- [TASK-003: Recurrence Types](../../STORY-001-DomainTypes/TASK-003-RecurrenceTypes/TASK.md)
- [TASK-025: Recurrence Calculator](../../STORY-008-RecurrenceRules/TASK-025-RecurrenceCalculator/TASK.md)

## Scenariusze Testowe

1. Mode interval: "Co 2 tygodnie" generuje {type:'custom', interval:2, unit:'week'}
2. Mode interval weekly + dni: dodaje daysOfWeek
3. Mode nthWeekday: "2-ga sobota" generuje {weekOfMonth:2, dayOfWeekInMonth:6}
4. Mode selectedDates: dodawanie/usuwanie dat
5. Start/end date dodawane do rule

## Notatki

- Zgodne z PRD FR-4.2 (reguły powtarzania)
- DayOfWeek: 0=niedziela (JavaScript standard)
- WeekOfMonth: -1 = ostatni tydzień
