# STORY-003: Calendar Grid UI

## Metadane

- **ID**: `STORY-003`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Calendar Grid UI
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** widzieć kalendarz w formie siatki miesięcznej
**Aby** łatwo przeglądać i zarządzać moimi wydarzeniami

## Opis

Implementacja głównego widoku kalendarza zgodnie z HTML mockup:
1. **CalendarView** - główny layout (header + grid + side panel)
2. **CalendarGrid** - siatka 7 kolumn x 6 wierszy
3. **CalendarDay** - pojedynczy dzień z wpisami
4. **MonthNavigation** - nawigacja miesiąc/rok + picker

Funkcjonalności:
- Siatka pokazuje aktualny miesiąc
- Dni z innych miesięcy oznaczone (other-month)
- Wpisy wyświetlane w komórkach dni
- Nawigacja poprzedni/następny miesiąc
- Kliknięcie na miesiąc/rok otwiera picker

## Kryteria Akceptacji

- [ ] CalendarView renderuje header, grid, side panel
- [ ] CalendarGrid pokazuje 7 dni x 6 tygodni
- [ ] Nagłówki dni tygodnia (Pn-Nd lub Nd-Sb)
- [ ] Dni z innych miesięcy mają klasę other-month
- [ ] Wpisy wyświetlane w odpowiednich dniach
- [ ] Nawigacja miesiąc (poprzedni/następny)
- [ ] Kliknięcie na miesiąc otwiera month picker
- [ ] Kliknięcie na rok otwiera year picker
- [ ] Responsywność (mobile-first)

## Zadania (Tasks)

- [TASK-007: Calendar View Component](./TASK-007-CalendarView/TASK.md)
- [TASK-008: Calendar Grid Component](./TASK-008-CalendarGrid/TASK.md)
- [TASK-009: Calendar Day Component](./TASK-009-CalendarDay/TASK.md)
- [TASK-010: Month Navigation Component](./TASK-010-MonthNavigation/TASK.md)

## Wymagania Niefunkcjonalne

- Responsywność: mobile-first design
- Performance: Virtual scrolling nie wymagane (max 42 dni)
- A11y: ARIA labels, keyboard navigation

## Zależności

- STORY-001: Domain Types (Entry, Group)
- STORY-002: Storage Layer (useEntriesStore, useCalendarStore)

## Notatki

- Zgodne z HTML mockup (klasy: calendar-container, calendar-grid, calendar-day, etc.)
- weekStart z useCalendarStore
- Wpisy filtrowane po dacie z useEntriesStore
