# TASK-022: Template Engine

## Metadane

- **ID**: `TASK-022`
- **Typ**: `task`
- **Tytuł**: Template Engine
- **Status**: `new`
- **Story**: [STORY-007: Template System](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja silnika szablonów do parsowania displayFormat i wykonywania operacji.

**Lokalizacja pliku**: `frontend/src/services/TemplateEngine.ts`

## Kontrakt (Service)

```typescript
// frontend/src/services/TemplateEngine.ts

import type { Template, Entry, TemplateOperation } from '@/types';

/**
 * Kontekst renderowania
 */
interface RenderContext {
  entry: Entry;
  template: Template;
  today: Date;
}

/**
 * Wynik renderowania
 */
interface RenderResult {
  displayText: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
  computedValues: Record<string, unknown>;
}

/**
 * Silnik szablonów
 */
export class TemplateEngine {
  /**
   * Renderuj wpis używając szablonu
   */
  render(entry: Entry, template: Template): RenderResult {
    const context: RenderContext = {
      entry,
      template,
      today: new Date()
    };

    // 1. Wykonaj operacje
    const computedValues = this.executeOperations(context);

    // 2. Połącz z customData
    const allValues = {
      ...entry.customData,
      ...computedValues
    };

    // 3. Interpoluj displayFormat
    const displayText = this.interpolate(template.displayFormat, allValues);

    return {
      displayText,
      icon: template.icon,
      backgroundColor: template.backgroundColor,
      textColor: template.textColor,
      computedValues
    };
  }

  /**
   * Wykonaj operacje szablonu
   */
  private executeOperations(context: RenderContext): Record<string, unknown> {
    const results: Record<string, unknown> = {};

    for (const op of context.template.operations) {
      results[op.outputVariable] = this.executeOperation(op, context);
    }

    return results;
  }

  /**
   * Wykonaj pojedynczą operację
   */
  private executeOperation(op: TemplateOperation, context: RenderContext): unknown {
    const sourceValue = context.entry.customData[op.sourceField];

    switch (op.type) {
      case 'insertText':
        return sourceValue ?? '';

      case 'calculateAge':
        return this.calculateAge(sourceValue as string, context.today);

      case 'daysUntil':
        return this.daysUntil(context.entry.date, context.today);

      case 'daysSince':
        return this.daysSince(sourceValue as string, context.today);

      case 'formatDate':
        return this.formatDate(sourceValue as string, op.params?.format as string);

      default:
        return '';
    }
  }

  /**
   * Interpoluj zmienne w tekście
   * "Urodziny {name} ({age})" -> "Urodziny Jan (30)"
   */
  private interpolate(template: string, values: Record<string, unknown>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      const value = values[key];
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Oblicz wiek (lata od daty)
   */
  private calculateAge(birthDateStr: string, today: Date): number {
    const birthDate = new Date(birthDateStr);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * Dni do daty (dla powtarzających się wydarzeń)
   */
  private daysUntil(dateStr: string, today: Date): number {
    const eventDate = new Date(dateStr);
    // Dla yearly: znajdź następne wystąpienie
    let nextOccurrence = new Date(
      today.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    if (nextOccurrence < today) {
      nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
    }
    const diffTime = nextOccurrence.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Dni od daty
   */
  private daysSince(dateStr: string, today: Date): number {
    const date = new Date(dateStr);
    const diffTime = today.getTime() - date.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Formatuj datę
   */
  private formatDate(dateStr: string, format?: string): string {
    const date = new Date(dateStr);
    // Simple format, can be extended
    return date.toLocaleDateString('pl-PL');
  }
}

// Singleton
export const templateEngine = new TemplateEngine();
```

## Kryteria Akceptacji

- [ ] render() zwraca RenderResult
- [ ] executeOperations wykonuje wszystkie operacje szablonu
- [ ] interpolate() zamienia {zmienne} na wartości
- [ ] calculateAge oblicza wiek poprawnie
- [ ] daysUntil znajduje następne wystąpienie

## Powiązane Zadania

- [TASK-002: Template Types](../../STORY-001-DomainTypes/TASK-002-TemplateTypes/TASK.md)
- [TASK-023: Template Variables](../TASK-023-TemplateVariables/TASK.md)

## Scenariusze Testowe

1. interpolate("Hello {name}", {name: "Jan"}) -> "Hello Jan"
2. calculateAge("1990-01-15", 2025-01-14) -> 34, (2025-01-15) -> 35
3. daysUntil dla 15 stycznia gdy dziś 14 grudnia -> X dni

## Notatki

- Singleton dla globalnego dostępu
- Performance: operacje wykonywane przy każdym render
- daysUntil zakłada yearly dla obliczenia następnego wystąpienia
