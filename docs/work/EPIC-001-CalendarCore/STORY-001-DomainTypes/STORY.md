# STORY-001: Domain Types & Contracts

## Metadane

- **ID**: `STORY-001`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Domain Types & Contracts
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** developer
**Chcę** mieć zdefiniowane TypeScript interfaces dla wszystkich encji kalendarza
**Aby** kod był type-safe i dokumentował się sam

## Opis

Definicja wszystkich typów domenowych dla aplikacji kalendarza:
- Entry (wpis w kalendarzu)
- Group (grupa wpisów)
- Template (szablon z zmiennymi i logiką)
- RecurrenceRule (reguły powtarzania)
- TemplateField, TemplateOperation (składowe szablonu)

Typy muszą być zgodne z:
1. HTML mockup dostarczonym przez użytkownika
2. PRD (pełny system szablonów)
3. Modals (Entry, Group)

## Kryteria Akceptacji

- [ ] Interfejs Entry zawiera: id, name, date, templateId, groupId, tags, description, recurrence, customData
- [ ] Interfejs Group zawiera: id, name, color, tags, description
- [ ] Interfejs Template zawiera: id, name, icon, colors, fields, displayFormat, operations, isArchived
- [ ] Interfejs RecurrenceRule obsługuje: exact, yearly, custom (interval, unit, dayOfWeek, dayOfMonth, selectedDates)
- [ ] Interfejs TemplateField definiuje zmienne szablonu
- [ ] Interfejs TemplateOperation definiuje logikę (calculateAge, daysUntil, insertText)
- [ ] Wszystkie typy eksportowane z jednego pliku index.ts
- [ ] TypeScript strict mode przechodzi bez błędów

## Zadania (Tasks)

- [TASK-001: Core Interfaces (Entry, Group)](./TASK-001-CoreInterfaces/TASK.md)
- [TASK-002: Template Types](./TASK-002-TemplateTypes/TASK.md)
- [TASK-003: Recurrence Types](./TASK-003-RecurrenceTypes/TASK.md)

## Wymagania Niefunkcjonalne

- TypeScript strict mode
- JSDoc comments dla wszystkich interfejsów
- Eksport z barrel file (index.ts)

## Zależności

- TypeScript configured w projekcie Vue
- Brak zależności od innych STORY

## Notatki

- Typy będą używane przez wszystkie komponenty i serwisy
- Priorytet: stabilne API, potem implementacja
- Patrz: PRD FR-2, FR-3, FR-4
