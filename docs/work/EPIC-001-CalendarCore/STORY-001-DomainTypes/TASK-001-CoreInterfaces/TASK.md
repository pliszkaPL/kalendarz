# TASK-001: Core Interfaces (Entry, Group)

## Metadane

- **ID**: `TASK-001`
- **Typ**: `task`
- **Tytuł**: Core Interfaces - Entry i Group
- **Status**: `new`
- **Story**: [STORY-001: Domain Types](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja podstawowych interfejsów TypeScript dla Entry (wpis w kalendarzu) i Group (grupa wpisów).

**Lokalizacja pliku**: `frontend/src/types/calendar.ts`

## Kontrakt (Interface)

```typescript
// frontend/src/types/calendar.ts

/**
 * Wpis w kalendarzu
 */
export interface Entry {
  /** Unikalny identyfikator (UUID) */
  id: string;
  /** Nazwa wpisu */
  name: string;
  /** Data wpisu w formacie ISO (YYYY-MM-DD) */
  date: string;
  /** ID szablonu używanego przez wpis */
  templateId: string;
  /** ID grupy (null jeśli bez grupy) */
  groupId: string | null;
  /** Lista tagów */
  tags: string[];
  /** Opis wpisu */
  description: string;
  /** Reguła powtarzania (null dla pojedynczych wpisów) */
  recurrence: RecurrenceRule | null;
  /** Dane niestandardowe dla zmiennych szablonu */
  customData: Record<string, unknown>;
  /** Czy wpis jest zarchiwizowany */
  isArchived: boolean;
  /** Data utworzenia */
  createdAt: string;
  /** Data ostatniej modyfikacji */
  updatedAt: string;
}

/**
 * Grupa wpisów
 */
export interface Group {
  /** Unikalny identyfikator (UUID) */
  id: string;
  /** Nazwa grupy */
  name: string;
  /** Kolor grupy (hex, np. #ff6b6b) */
  color: string;
  /** Lista tagów grupy */
  tags: string[];
  /** Opis grupy */
  description: string;
  /** Data utworzenia */
  createdAt: string;
  /** Data ostatniej modyfikacji */
  updatedAt: string;
}
```

## Kryteria Akceptacji

- [ ] Interfejs Entry zdefiniowany z wszystkimi polami z mockup HTML
- [ ] Interfejs Group zdefiniowany z wszystkimi polami
- [ ] JSDoc comments dla każdego pola
- [ ] Typy eksportowane
- [ ] TypeScript kompiluje się bez błędów

## Powiązane Zadania

- [TASK-002: Template Types](../TASK-002-TemplateTypes/TASK.md)
- [TASK-003: Recurrence Types](../TASK-003-RecurrenceTypes/TASK.md)

## Scenariusze Testowe

1. Import Entry z types/calendar.ts kompiluje się
2. Tworzenie obiektu Entry z wymaganymi polami działa
3. TypeScript wychwytuje błędne typy pól

## Notatki

- RecurrenceRule będzie zdefiniowany w TASK-003
- customData używane przez system szablonów (TASK-002)
- Format daty: ISO 8601 (YYYY-MM-DD) dla kompatybilności z input[type="date"]
