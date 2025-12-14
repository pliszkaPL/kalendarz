# EPIC-001: Calendar Core

## Metadane

- **ID**: `EPIC-001`
- **Tytuł**: Calendar Core - Podstawowa funkcjonalność kalendarza
- **Bounded Context**: CalendarManagement
- **Status**: `new`
- **Owner**: Frontend Team
- **Timeline**: Milestone MVP 1.0

## Cel Biznesowy

Dostarczenie podstawowej funkcjonalności kalendarza umożliwiającej użytkownikom zarządzanie wydarzeniami, grupami i szablonami. Aplikacja działa offline (localStorage) z opcjonalną synchronizacją do API.

## Opis

Epic obejmuje kompletną implementację widoku kalendarza z PRD:

1. **Domain Types**: TypeScript interfaces dla Entry, Group, Template, RecurrenceRule
2. **Storage Layer**: localStorage + interfejs dla przyszłego API
3. **Calendar UI**: Siatka miesięczna, panel boczny, nawigacja
4. **Modals**: Dodawanie/edycja wpisów i grup
5. **Templates**: System szablonów z zmiennymi i logiką wyświetlania
6. **Recurrence**: Powtarzalne wpisy (yearly, custom rules)
7. **Import/Export**: Interfejs z implementacjami (Strategy pattern)

## User Stories

| ID | Tytuł | TASK | Status |
|----|-------|------|--------|
| [STORY-001](./STORY-001-DomainTypes/STORY.md) | Domain Types & Contracts | 3 | `new` |
| [STORY-002](./STORY-002-StorageLayer/STORY.md) | Storage Layer (localStorage) | 3 | `new` |
| [STORY-003](./STORY-003-CalendarGrid/STORY.md) | Calendar Grid UI | 4 | `new` |
| [STORY-004](./STORY-004-SidePanel/STORY.md) | Side Panel (Groups & Entries) | 4 | `new` |
| [STORY-005](./STORY-005-EntryModal/STORY.md) | Entry Modal | 4 | `new` |
| [STORY-006](./STORY-006-GroupModal/STORY.md) | Group Modal | 3 | `new` |
| [STORY-007](./STORY-007-TemplateSystem/STORY.md) | Template System | 3 | `new` |
| [STORY-008](./STORY-008-RecurrenceRules/STORY.md) | Recurrence Rules | 2 | `new` |
| [STORY-009](./STORY-009-ImportExport/STORY.md) | Import/Export | 3 | `new` |
| [STORY-010](./STORY-010-Search/STORY.md) | Search & Filter | 2 | `new` |

**Razem: 10 STORY, 31 TASK**

### Kolejność implementacji (sugerowana)

1. **STORY-001** - Domain Types (fundamenty)
2. **STORY-002** - Storage Layer (persystencja)
3. **STORY-007** - Template System (predefiniowane szablony)
4. **STORY-003** - Calendar Grid UI (główny widok)
5. **STORY-004** - Side Panel
6. **STORY-005** - Entry Modal
7. **STORY-006** - Group Modal
8. **STORY-008** - Recurrence Rules
9. **STORY-010** - Search & Filter
10. **STORY-009** - Import/Export

## Metryki Sukcesu

- 100% funkcjonalności z mockup HTML zaimplementowane
- Kalendarz działa offline (localStorage)
- Testy E2E pokrywają wszystkie krytyczne ścieżki
- TypeScript strict mode bez błędów

## Wymagania Techniczne

**Frontend (Vue 3 + TypeScript)**:
- Composition API
- Pinia (state management)
- TypeScript strict mode
- Scoped CSS

**Storage**:
- localStorage (primary, offline)
- REST API interface (future sync)

**Testing**:
- Vitest (unit tests)
- Playwright (E2E tests)

## Zależności

- Vue Router configured
- Pinia installed
- TypeScript configured
- Existing auth system (Login.vue, Dashboard.vue)

## Bounded Context

**CalendarManagement** - Zarządzanie kalendarzem, wpisami, grupami i szablonami

**Entities**:
- Entry (id, name, date, templateId, groupId, tags, recurrence)
- Group (id, name, color, tags, description)
- Template (id, name, icon, colors, fields, displayFormat, operations)

**Value Objects**:
- RecurrenceRule (type, interval, unit, selectedDates)
- TemplateField (name, type, operation)
- Tag (string)

**Services**:
- StorageService (localStorage, API)
- ImportExportService (JSON, iCal)
- RecurrenceCalculator

## Ryzyka i Mitigacja

| Ryzyko | P | I | Mitigacja |
|--------|---|---|-----------|
| localStorage limit (5MB) | M | M | Kompresja JSON, cleanup starych danych |
| Complexity of template system | H | H | Iteracyjna implementacja, uproszenia w MVP |
| Recurrence edge cases | M | M | Comprehensive test suite, date-fns library |

## Notatki

- Implementacja zgodna z HTML mockup dostarczonym przez użytkownika
- Priorytet: działający kalendarz offline > sync z API
- Szablony: pełna implementacja z PRD (zmienne, logika)
- Powtarzanie: pełne reguły (co X dni/tygodni, konkretny dzień)
