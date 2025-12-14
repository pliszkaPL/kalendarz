/**
 * Typy dla reguł powtarzania wpisów
 * TASK-003: Recurrence Types
 */

/**
 * Typ powtarzania
 */
export type RecurrenceType = 'exact' | 'yearly' | 'custom'

/**
 * Jednostka interwału
 */
export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year'

/**
 * Dzień tygodnia (0 = niedziela, 6 = sobota)
 */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Tydzień w miesiącu
 */
export type WeekOfMonth = 1 | 2 | 3 | 4 | -1 // -1 = ostatni

/**
 * Reguła powtarzania
 */
export interface RecurrenceRule {
  /** Typ powtarzania */
  type: RecurrenceType

  // Dla type === 'custom':

  /** Interwał (co ile jednostek) */
  interval?: number
  /** Jednostka interwału */
  unit?: RecurrenceUnit

  /** Konkretne dni tygodnia (dla unit === 'week') */
  daysOfWeek?: DayOfWeek[]

  /** Konkretny dzień miesiąca (dla unit === 'month', np. 15 = 15-ty dzień) */
  dayOfMonth?: number

  /** Tydzień miesiąca + dzień (np. 2-ga sobota miesiąca) */
  weekOfMonth?: WeekOfMonth
  dayOfWeekInMonth?: DayOfWeek

  /** Ręcznie wybrane daty (format ISO YYYY-MM-DD) */
  selectedDates?: string[]

  /** Data rozpoczęcia powtarzania */
  startDate?: string
  /** Data zakończenia powtarzania (null = bez końca) */
  endDate?: string | null
  /** Maksymalna liczba wystąpień */
  occurrences?: number
}

/**
 * Helper: Tworzenie reguły "Dokładny dzień"
 */
export function createExactRule(): RecurrenceRule {
  return { type: 'exact' }
}

/**
 * Helper: Tworzenie reguły "Co rok"
 */
export function createYearlyRule(): RecurrenceRule {
  return { type: 'yearly' }
}

/**
 * Helper: Tworzenie reguły "Co X dni"
 */
export function createIntervalRule(interval: number, unit: RecurrenceUnit): RecurrenceRule {
  return {
    type: 'custom',
    interval,
    unit
  }
}

/**
 * Helper: Tworzenie reguły z ręcznie wybranymi datami
 */
export function createSelectedDatesRule(dates: string[]): RecurrenceRule {
  return {
    type: 'custom',
    selectedDates: dates
  }
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
  }
}

/**
 * Etykiety dla UI (PL)
 */
export const RECURRENCE_TYPE_LABELS: Record<RecurrenceType, string> = {
  exact: 'Dokładny dzień',
  yearly: 'Powtarzaj co rok',
  custom: 'Niestandardowe powtarzanie'
}

export const RECURRENCE_UNIT_LABELS: Record<RecurrenceUnit, string> = {
  day: 'dni',
  week: 'tygodni',
  month: 'miesięcy',
  year: 'lat'
}

export const DAY_OF_WEEK_LABELS: string[] = [
  'Niedziela',
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota'
]
