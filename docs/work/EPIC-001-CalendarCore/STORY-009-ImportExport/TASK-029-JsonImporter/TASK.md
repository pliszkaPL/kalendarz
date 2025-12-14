# TASK-029: JSON Importer

## Metadane

- **ID**: `TASK-029`
- **Typ**: `task`
- **Tytuł**: JSON Importer
- **Status**: `new`
- **Story**: [STORY-009: Import/Export](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja importera z formatu JSON.

**Lokalizacja pliku**: `frontend/src/services/importExport/JsonImporter.ts`

## Kontrakt (Implementation)

```typescript
// frontend/src/services/importExport/JsonImporter.ts

import type { Importer, ImportOptions, ImportResult, ExportFormat } from './types';
import type { CalendarData } from '@/services/storage/StorageService';
import type { Entry, Group, Template } from '@/types';

const SUPPORTED_VERSIONS = ['1.0'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export class JsonImporter implements Importer {
  readonly format: ExportFormat = 'json';
  readonly supportedExtensions = ['.json'];

  async import(file: File, options: ImportOptions = { mode: 'merge' }): Promise<ImportResult> {
    // Validate first
    const validation = await this.validate(file);
    if (!validation.success) {
      return validation;
    }

    return {
      success: true,
      data: validation.data,
      stats: {
        entriesCount: validation.data!.entries.length,
        groupsCount: validation.data!.groups.length,
        templatesCount: validation.data!.templates.length
      }
    };
  }

  async validate(file: File): Promise<ImportResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Plik jest za duży (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
      return { success: false, errors };
    }

    // Check extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.supportedExtensions.includes(extension)) {
      errors.push(`Nieobsługiwane rozszerzenie: ${extension}`);
      return { success: false, errors };
    }

    // Parse JSON
    let json: unknown;
    try {
      const text = await file.text();
      json = JSON.parse(text);
    } catch (e) {
      errors.push('Nieprawidłowy format JSON');
      return { success: false, errors };
    }

    // Validate structure
    const data = json as Record<string, unknown>;

    // Check version
    if (data.version && !SUPPORTED_VERSIONS.includes(data.version as string)) {
      warnings.push(`Nieznana wersja: ${data.version}`);
    }

    // Validate entries
    if (!Array.isArray(data.entries)) {
      errors.push('Brak tablicy entries');
    } else {
      for (let i = 0; i < data.entries.length; i++) {
        const entryErrors = this.validateEntry(data.entries[i], i);
        errors.push(...entryErrors);
      }
    }

    // Validate groups
    if (!Array.isArray(data.groups)) {
      data.groups = [];
      warnings.push('Brak tablicy groups, użyto pustej');
    }

    // Validate templates
    if (!Array.isArray(data.templates)) {
      data.templates = [];
      warnings.push('Brak tablicy templates, użyto pustej');
    }

    if (errors.length > 0) {
      return { success: false, errors, warnings };
    }

    return {
      success: true,
      data: {
        version: (data.version as string) || '1.0',
        exportedAt: (data.exportedAt as string) || new Date().toISOString(),
        entries: data.entries as Entry[],
        groups: data.groups as Group[],
        templates: data.templates as Template[]
      },
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }

  private validateEntry(entry: unknown, index: number): string[] {
    const errors: string[] = [];
    const e = entry as Record<string, unknown>;

    if (!e.id) errors.push(`Entry[${index}]: brak id`);
    if (!e.name) errors.push(`Entry[${index}]: brak name`);
    if (!e.date) errors.push(`Entry[${index}]: brak date`);

    // Validate date format
    if (e.date && typeof e.date === 'string') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(e.date)) {
        errors.push(`Entry[${index}]: nieprawidłowy format daty (wymagany YYYY-MM-DD)`);
      }
    }

    return errors;
  }
}

// Factory function
export function createJsonImporter(): JsonImporter {
  return new JsonImporter();
}
```

## Kryteria Akceptacji

- [ ] Waliduje rozmiar pliku (max 10MB)
- [ ] Waliduje rozszerzenie
- [ ] Parsuje JSON
- [ ] Waliduje strukturę (entries, groups, templates)
- [ ] Waliduje wymagane pola w entries
- [ ] Zwraca errors i warnings

## Powiązane Zadania

- [TASK-027: Interface](../TASK-027-ImportExportInterface/TASK.md)
- [TASK-028: JSON Exporter](../TASK-028-JsonExporter/TASK.md)

## Scenariusze Testowe

1. Plik > 10MB zwraca błąd
2. Nieprawidłowy JSON zwraca błąd
3. Entry bez name zwraca błąd
4. Brak groups array dodaje warning
5. Prawidłowy plik zwraca success z data

## Notatki

- SUPPORTED_VERSIONS dla kompatybilności
- Warnings nie blokują importu
- validateEntry sprawdza każdy wpis osobno
