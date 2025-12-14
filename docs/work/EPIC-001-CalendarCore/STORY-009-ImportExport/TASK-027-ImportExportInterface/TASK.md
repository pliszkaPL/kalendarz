# TASK-027: Import/Export Interface

## Metadane

- **ID**: `TASK-027`
- **Typ**: `task`
- **Tytuł**: Import/Export Interface
- **Status**: `new`
- **Story**: [STORY-009: Import/Export](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Definicja interfejsu dla serwisów importu/eksportu (Strategy pattern).

**Lokalizacja pliku**: `frontend/src/services/importExport/types.ts`

## Kontrakt (Interface)

```typescript
// frontend/src/services/importExport/types.ts

import type { CalendarData } from '@/services/storage/StorageService';

/**
 * Format eksportu/importu
 */
export type ExportFormat = 'json' | 'ical';

/**
 * Wynik importu
 */
export interface ImportResult {
  success: boolean;
  data?: CalendarData;
  errors?: string[];
  warnings?: string[];
  stats?: {
    entriesCount: number;
    groupsCount: number;
    templatesCount: number;
  };
}

/**
 * Opcje eksportu
 */
export interface ExportOptions {
  /** Czy uwzględnić zarchiwizowane wpisy */
  includeArchived?: boolean;
  /** Czy uwzględnić systemowe szablony */
  includeSystemTemplates?: boolean;
  /** Zakres dat (null = wszystkie) */
  dateRange?: {
    start: string;
    end: string;
  } | null;
}

/**
 * Opcje importu
 */
export interface ImportOptions {
  /** Tryb importu */
  mode: 'merge' | 'replace';
  /** Czy nadpisywać istniejące dane o tym samym ID */
  overwriteExisting?: boolean;
}

/**
 * Interfejs eksportera
 */
export interface Exporter {
  /** Format obsługiwany przez eksporter */
  readonly format: ExportFormat;

  /** Rozszerzenie pliku */
  readonly fileExtension: string;

  /** MIME type */
  readonly mimeType: string;

  /** Eksportuj dane do Blob */
  export(data: CalendarData, options?: ExportOptions): Promise<Blob>;
}

/**
 * Interfejs importera
 */
export interface Importer {
  /** Format obsługiwany przez importer */
  readonly format: ExportFormat;

  /** Obsługiwane rozszerzenia */
  readonly supportedExtensions: string[];

  /** Importuj dane z pliku */
  import(file: File, options?: ImportOptions): Promise<ImportResult>;

  /** Waliduj plik bez importowania */
  validate(file: File): Promise<ImportResult>;
}

/**
 * Factory dla eksporterów/importerów
 */
export interface ImportExportFactory {
  getExporter(format: ExportFormat): Exporter;
  getImporter(format: ExportFormat): Importer;
  getSupportedFormats(): ExportFormat[];
}
```

## Kryteria Akceptacji

- [ ] Exporter interface z export() method
- [ ] Importer interface z import() i validate()
- [ ] ImportResult z success, errors, stats
- [ ] ExportOptions dla filtrowania
- [ ] ImportOptions dla merge/replace

## Powiązane Zadania

- [TASK-028: JSON Exporter](../TASK-028-JsonExporter/TASK.md)
- [TASK-029: JSON Importer](../TASK-029-JsonImporter/TASK.md)

## Scenariusze Testowe

1. Interface kompiluje się bez błędów
2. Implementacje spełniają interface

## Notatki

- Strategy pattern dla różnych formatów
- Factory pattern dla tworzenia instancji
- ImportResult zawiera stats dla UI
