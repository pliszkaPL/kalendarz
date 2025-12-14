# TASK-025: Recurrence Calculator

## Metadane

- **ID**: `TASK-025`
- **Typ**: `task`
- **Tytuł**: Recurrence Calculator
- **Status**: `new`
- **Story**: [STORY-008: Recurrence Rules](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Serwis do obliczania dat wystąpień wpisów powtarzających się.

**Lokalizacja pliku**: `frontend/src/services/RecurrenceCalculator.ts`

## Kontrakt (Service)

```typescript
// frontend/src/services/RecurrenceCalculator.ts

import type { RecurrenceRule, Entry } from '@/types';

/**
 * Kalkulator wystąpień powtarzających się wpisów
 */
export class RecurrenceCalculator {
  /**
   * Sprawdź czy wpis występuje w danym dniu
   */
  occursOn(entry: Entry, date: Date): boolean {
    if (!entry.recurrence) {
      // Dokładny dzień
      return this.isSameDay(new Date(entry.date), date);
    }

    return this.matchesRule(entry.date, entry.recurrence, date);
  }

  /**
   * Pobierz wszystkie wystąpienia wpisu w zakresie dat
   */
  getOccurrences(entry: Entry, startDate: Date, endDate: Date): Date[] {
    if (!entry.recurrence) {
      const entryDate = new Date(entry.date);
      if (entryDate >= startDate && entryDate <= endDate) {
        return [entryDate];
      }
      return [];
    }

    return this.calculateOccurrences(entry.date, entry.recurrence, startDate, endDate);
  }

  /**
   * Pobierz następne N wystąpień
   */
  getNextOccurrences(entry: Entry, count: number, fromDate: Date = new Date()): Date[] {
    const occurrences: Date[] = [];
    const maxIterations = 365 * 5; // Max 5 lat
    let currentDate = new Date(fromDate);
    let iterations = 0;

    while (occurrences.length < count && iterations < maxIterations) {
      if (this.occursOn(entry, currentDate)) {
        occurrences.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
      iterations++;
    }

    return occurrences;
  }

  private matchesRule(baseDate: string, rule: RecurrenceRule, targetDate: Date): boolean {
    const base = new Date(baseDate);

    // Check date range
    if (rule.startDate && targetDate < new Date(rule.startDate)) return false;
    if (rule.endDate && targetDate > new Date(rule.endDate)) return false;

    switch (rule.type) {
      case 'exact':
        return this.isSameDay(base, targetDate);

      case 'yearly':
        return this.matchesYearly(base, targetDate);

      case 'custom':
        return this.matchesCustom(base, rule, targetDate);

      default:
        return false;
    }
  }

  private matchesYearly(base: Date, target: Date): boolean {
    return base.getMonth() === target.getMonth() &&
           base.getDate() === target.getDate();
  }

  private matchesCustom(base: Date, rule: RecurrenceRule, target: Date): boolean {
    // Selected dates
    if (rule.selectedDates?.length) {
      const targetStr = this.formatDate(target);
      return rule.selectedDates.includes(targetStr);
    }

    // Nth weekday of month
    if (rule.weekOfMonth !== undefined && rule.dayOfWeekInMonth !== undefined) {
      return this.matchesNthWeekday(rule.weekOfMonth, rule.dayOfWeekInMonth, target);
    }

    // Interval-based
    if (rule.interval && rule.unit) {
      return this.matchesInterval(base, rule.interval, rule.unit, target, rule);
    }

    return false;
  }

  private matchesInterval(
    base: Date,
    interval: number,
    unit: string,
    target: Date,
    rule: RecurrenceRule
  ): boolean {
    const startDate = rule.startDate ? new Date(rule.startDate) : base;

    switch (unit) {
      case 'day': {
        const diffDays = Math.floor(
          (target.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diffDays >= 0 && diffDays % interval === 0;
      }

      case 'week': {
        const diffDays = Math.floor(
          (target.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays < 0) return false;

        // Check if in correct week
        const weekNum = Math.floor(diffDays / 7);
        if (weekNum % interval !== 0) return false;

        // Check day of week
        if (rule.daysOfWeek?.length) {
          return rule.daysOfWeek.includes(target.getDay() as any);
        }
        return target.getDay() === startDate.getDay();
      }

      case 'month': {
        const monthDiff =
          (target.getFullYear() - startDate.getFullYear()) * 12 +
          (target.getMonth() - startDate.getMonth());
        if (monthDiff < 0 || monthDiff % interval !== 0) return false;

        // Check day of month
        if (rule.dayOfMonth) {
          return target.getDate() === rule.dayOfMonth;
        }
        return target.getDate() === startDate.getDate();
      }

      default:
        return false;
    }
  }

  private matchesNthWeekday(week: number, dayOfWeek: number, target: Date): boolean {
    const targetWeek = this.getWeekOfMonth(target);
    const isLastWeek = week === -1 && this.isLastWeekOfMonth(target);

    return target.getDay() === dayOfWeek &&
           (targetWeek === week || isLastWeek);
  }

  private getWeekOfMonth(date: Date): number {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay();
    return Math.ceil((date.getDate() + firstDayOfWeek) / 7);
  }

  private isLastWeekOfMonth(date: Date): boolean {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return date.getDate() > lastDay.getDate() - 7;
  }

  private calculateOccurrences(
    baseDate: string,
    rule: RecurrenceRule,
    startDate: Date,
    endDate: Date
  ): Date[] {
    const occurrences: Date[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      if (this.matchesRule(baseDate, rule, current)) {
        occurrences.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    return occurrences;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

// Singleton
export const recurrenceCalculator = new RecurrenceCalculator();
```

## Kryteria Akceptacji

- [ ] occursOn sprawdza czy wpis występuje w dniu
- [ ] getOccurrences zwraca daty w zakresie
- [ ] Yearly: ten sam dzień/miesiąc
- [ ] Interval: co X dni/tygodni/miesięcy
- [ ] nthWeekday: N-ty dzień tygodnia
- [ ] selectedDates: ręcznie wybrane daty
- [ ] Respektuje startDate/endDate

## Powiązane Zadania

- [TASK-003: Recurrence Types](../../STORY-001-DomainTypes/TASK-003-RecurrenceTypes/TASK.md)
- [TASK-008: Calendar Grid](../../STORY-003-CalendarGrid/TASK-008-CalendarGrid/TASK.md)

## Scenariusze Testowe

1. Yearly: wpis 15.01 występuje 15.01.2025, 15.01.2026
2. Interval week: co 2 tygodnie od poniedziałku
3. nthWeekday: 2-ga sobota miesiąca
4. selectedDates: dokładnie te daty

## Notatki

- Performance: iteracja dzień po dniu dla zakresu
- Można optymalizować dla dużych zakresów
- getWeekOfMonth: 1-indexed
