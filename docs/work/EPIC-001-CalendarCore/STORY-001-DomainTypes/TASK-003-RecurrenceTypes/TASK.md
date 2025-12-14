# TASK-003: Recurrence Types

## Metadane

- **ID**: `TASK-003`
- **Typ**: `task`
- **Tytuł**: Recurrence Types - Reguły powtarzania
- **Status**: `new`
- **Story**: [STORY-001: Domain Types](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja typów TypeScript dla reguł powtarzania wpisów zgodnie z PRD FR-4.

**Lokalizacja pliku**: `frontend/src/types/recurrence.ts`

## Kontrakt (Interface)

```typescript
// frontend/src/types/recurrence.ts

/**
 * Typ powtarzania
 */
export type RecurrenceType =
  | 'exact'   // Dokładny dzień (bez powtarzania)
  | 'yearly'  // Powtarzaj co rok (ta sama data)
  | 'custom'; // Niestandardowe powtarzanie

/**
 * Jednostka interwału
 */
export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year';

/**
 * Dzień tygodnia (0 = niedziela, 6 = sobota)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Tydzień w miesiącu
 */
export type WeekOfMonth = 1 | 2 | 3 | 4 | -1; // -1 = ostatni

/**
 * Reguła powtarzania
 */
export interface RecurrenceRule {
  /** Typ powtarzania */
  type: RecurrenceType;

  // Dla type === 'custom':

  /** Interwał (co ile jednostek) */
  interval?: number;
  /** Jednostka interwału */
  unit?: RecurrenceUnit;

  /** Konkretne dni tygodnia (dla unit === 'week') */
  daysOfWeek?: DayOfWeek[];

  /** Konkretny dzień miesiąca (dla unit === 'month', np. 15 = 15-ty dzień) */
  dayOfMonth?: number;

  /** Tydzień miesiąca + dzień (np. 2-ga sobota miesiąca) */
  weekOfMonth?: WeekOfMonth;
  dayOfWeekInMonth?: DayOfWeek;

  /** Ręcznie wybrane daty (format ISO YYYY-MM-DD) */
  selectedDates?: string[];

  /** Data rozpoczęcia powtarzania */
  startDate?: string;
  /** Data zakończenia powtarzania (null = bez końca) */
  endDate?: string | null;
  /** Maksymalna liczba wystąpień */
  occurrences?: number;
}

/**
 * Helper: Tworzenie reguły "Dokładny dzień"
 */
export function createExactRule(): RecurrenceRule {
  return { type: 'exact' };
}

/**
 * Helper: Tworzenie reguły "Co rok"
 */
export function createYearlyRule(): RecurrenceRule {
  return { type: 'yearly' };
}

/**
 * Helper: Tworzenie reguły "Co X dni"
 */
export function createIntervalRule(interval: number, unit: RecurrenceUnit): RecurrenceRule {
  return {
    type: 'custom',
    interval,
    unit
  };
}

/**
 * Helper: Tworzenie reguły z ręcznie wybranymi datami
 */
export function createSelectedDatesRule(dates: string[]): RecurrenceRule {
  return {
    type: 'custom',
    selectedDates: dates
  };
}

/**
 * Helper: Tworzenie reguły "N-ty dzień tygodnia miesiąca"
 * np. 2-ga sobota miesiąca: createNthWeekdayRule(2, 6)
 */
export function createNthWeekdayRule(week: WeekOfMonth, day: DayOfWeek): RecurrenceRule {
  return {
    type: 'custom',
    unit: 'month',
    interval: 1,
    weekOfMonth: week,
    dayOfWeekInMonth: day
  };
}

/**
 * Etykiety dla UI
 */
export const RECURRENCE_TYPE_LABELS: Record<RecurrenceType, string> = {
  exact: 'Dokładny dzień',
  yearly: 'Powtarzaj co rok',
  custom: 'Niestandardowe powtarzanie'
};

export const RECURRENCE_UNIT_LABELS: Record<RecurrenceUnit, string> = {
  day: 'dni',
  week: 'tygodni',
  month: 'miesięcy',
  year: 'lat'
};

export const DAY_OF_WEEK_LABELS: string[] = [
  'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa',
  'Czwartek', 'Piątek', 'Sobota'
];
```

## Kryteria Akceptacji

- [ ] RecurrenceRule obsługuje: exact, yearly, custom
- [ ] Custom obsługuje: interval + unit (co X dni/tygodni/miesięcy)
- [ ] Custom obsługuje: konkretne dni tygodnia
- [ ] Custom obsługuje: N-ty dzień tygodnia miesiąca (np. 2-ga sobota)
- [ ] Custom obsługuje: ręcznie wybrane daty
- [ ] Helper functions dla częstych przypadków
- [ ] Etykiety PL dla UI
- [ ] JSDoc comments

## Powiązane Zadania

- [TASK-001: Core Interfaces](../TASK-001-CoreInterfaces/TASK.md)
- [TASK-025: Recurrence Calculator](../../STORY-008-RecurrenceRules/TASK-025-RecurrenceCalculator/TASK.md)

## Scenariusze Testowe

1. createYearlyRule() zwraca { type: 'yearly' }
2. createIntervalRule(2, 'week') zwraca { type: 'custom', interval: 2, unit: 'week' }
3. createNthWeekdayRule(2, 6) dla "2-ga sobota"
4. RecurrenceRule z selectedDates

## Notatki

- Zgodne z PRD FR-4.1, FR-4.2, FR-4.3
- Obliczanie dat wystąpień w TASK-025 (RecurrenceCalculator)
- DayOfWeek: 0 = niedziela (zgodne z JavaScript Date.getDay())
- WeekOfMonth: -1 = ostatni tydzień miesiąca
