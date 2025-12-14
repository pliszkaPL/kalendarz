# STORY-008: Recurrence Rules

## Metadane

- **ID**: `STORY-008`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Recurrence Rules (Obliczanie dat)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** aby wpisy powtarzalne pojawiały się automatycznie
**Aby** nie musieć ręcznie dodawać każdego wystąpienia

## Opis

Implementacja kalkulatora powtarzających się dat:
- Obliczanie wystąpień dla reguł (yearly, interval, nthWeekday)
- Filtrowanie wpisów w kalendarzu na podstawie recurrence
- UI dla podglądu wystąpień

## Kryteria Akceptacji

- [ ] RecurrenceCalculator oblicza daty wystąpień
- [ ] Yearly: ta sama data każdego roku
- [ ] Interval: co X dni/tygodni/miesięcy
- [ ] nthWeekday: N-ty dzień tygodnia miesiąca
- [ ] CalendarGrid pokazuje powtarzające się wpisy
- [ ] UI podgląd następnych wystąpień

## Zadania (Tasks)

- [TASK-025: Recurrence Calculator](./TASK-025-RecurrenceCalculator/TASK.md)
- [TASK-026: Recurrence UI](./TASK-026-RecurrenceUI/TASK.md)

## Wymagania Niefunkcjonalne

- Performance: obliczenia tylko dla widocznego zakresu dat
- Caching: wyniki cachowane per miesiąc

## Zależności

- STORY-001: Domain Types (RecurrenceRule)
- TASK-018: Recurrence Selector

## Notatki

- Zgodne z PRD FR-4
- date-fns opcjonalnie dla obliczeń dat
