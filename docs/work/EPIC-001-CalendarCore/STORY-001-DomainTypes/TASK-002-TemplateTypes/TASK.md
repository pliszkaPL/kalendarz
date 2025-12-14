# TASK-002: Template Types

## Metadane

- **ID**: `TASK-002`
- **Typ**: `task`
- **Tytuł**: Template Types - System szablonów
- **Status**: `new`
- **Story**: [STORY-001: Domain Types](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja typów TypeScript dla systemu szablonów zgodnie z PRD FR-3.

**Lokalizacja pliku**: `frontend/src/types/template.ts`

## Kontrakt (Interface)

```typescript
// frontend/src/types/template.ts

/**
 * Typ operacji szablonu
 */
export type TemplateOperationType =
  | 'insertText'      // Wstaw tekst
  | 'calculateAge'    // Oblicz wiek (lata od daty)
  | 'daysUntil'       // Dni do daty
  | 'daysSince'       // Dni od daty
  | 'formatDate';     // Formatuj datę

/**
 * Typ pola szablonu
 */
export type TemplateFieldType =
  | 'text'      // Tekst
  | 'date'      // Data
  | 'number'    // Liczba
  | 'select';   // Wybór z listy

/**
 * Predefiniowany typ szablonu (ikona + domyślne kolory)
 */
export type TemplatePreset =
  | 'birthday'    // Urodziny
  | 'anniversary' // Rocznica
  | 'holiday'     // Święto
  | 'meeting'     // Spotkanie
  | 'reminder'    // Przypomnienie
  | 'death'       // Pamięć
  | 'custom';     // Niestandardowy

/**
 * Pole szablonu (zmienna)
 */
export interface TemplateField {
  /** Nazwa pola (używana w displayFormat jako {nazwa}) */
  name: string;
  /** Etykieta wyświetlana w formularzu */
  label: string;
  /** Typ pola */
  type: TemplateFieldType;
  /** Czy pole jest wymagane */
  required: boolean;
  /** Wartość domyślna */
  defaultValue?: string | number;
  /** Opcje dla pola typu 'select' */
  options?: string[];
}

/**
 * Operacja szablonu (logika)
 */
export interface TemplateOperation {
  /** Typ operacji */
  type: TemplateOperationType;
  /** Nazwa pola źródłowego */
  sourceField: string;
  /** Nazwa zmiennej wynikowej (używana w displayFormat) */
  outputVariable: string;
  /** Dodatkowe parametry operacji */
  params?: Record<string, unknown>;
}

/**
 * Szablon wpisu
 */
export interface Template {
  /** Unikalny identyfikator (UUID) */
  id: string;
  /** Nazwa szablonu */
  name: string;
  /** Preset (definiuje ikonę) */
  preset: TemplatePreset;
  /** Ikona (emoji lub URL) */
  icon: string;
  /** Kolor tła */
  backgroundColor: string;
  /** Kolor tekstu */
  textColor: string;
  /** Pola (zmienne) szablonu */
  fields: TemplateField[];
  /** Format wyświetlania (np. "Urodziny {imie} ({wiek})") */
  displayFormat: string;
  /** Operacje logiczne */
  operations: TemplateOperation[];
  /** Czy szablon jest zarchiwizowany */
  isArchived: boolean;
  /** Czy to szablon systemowy (predefiniowany) */
  isSystem: boolean;
  /** ID użytkownika (null dla systemowych) */
  userId: string | null;
  /** Data utworzenia */
  createdAt: string;
  /** Data ostatniej modyfikacji */
  updatedAt: string;
}

/**
 * Predefiniowane szablony (konfiguracja)
 */
export const TEMPLATE_PRESETS: Record<TemplatePreset, { icon: string; color: string }> = {
  birthday: { icon: '🎂', color: '#ff6b6b' },
  anniversary: { icon: '💕', color: '#ff69b4' },
  holiday: { icon: '🎉', color: '#45b7d1' },
  meeting: { icon: '📅', color: '#96ceb4' },
  reminder: { icon: '⏰', color: '#ffeaa7' },
  death: { icon: '🕊️', color: '#636e72' },
  custom: { icon: '📝', color: '#74b9ff' }
};
```

## Kryteria Akceptacji

- [ ] Interfejs Template z wszystkimi polami z PRD FR-3
- [ ] TemplateField definiuje zmienne szablonu
- [ ] TemplateOperation definiuje logikę (calculateAge, daysUntil, etc.)
- [ ] TemplatePreset mapuje presety na ikony i kolory
- [ ] Typy eksportowane
- [ ] JSDoc comments

## Powiązane Zadania

- [TASK-001: Core Interfaces](../TASK-001-CoreInterfaces/TASK.md)
- [TASK-022: Template Engine](../../STORY-007-TemplateSystem/TASK-022-TemplateEngine/TASK.md)

## Scenariusze Testowe

1. Tworzenie Template z polami fields i operations
2. TEMPLATE_PRESETS zawiera wszystkie presety z mockup
3. displayFormat może zawierać {zmienne}

## Notatki

- displayFormat parsowany przez TemplateEngine (TASK-022)
- operations wykonywane przy renderowaniu wpisu
- Presety zgodne z HTML mockup: birthday, anniversary, holiday, meeting, reminder, death, custom
