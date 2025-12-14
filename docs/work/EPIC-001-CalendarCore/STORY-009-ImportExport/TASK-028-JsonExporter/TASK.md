# TASK-028: JSON Exporter

## Metadane

- **ID**: `TASK-028`
- **Typ**: `task`
- **Tytuł**: JSON Exporter
- **Status**: `new`
- **Story**: [STORY-009: Import/Export](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja eksportera do formatu JSON.

**Lokalizacja pliku**: `frontend/src/services/importExport/JsonExporter.ts`

## Kontrakt (Implementation)

```typescript
// frontend/src/services/importExport/JsonExporter.ts

import type { Exporter, ExportOptions, ExportFormat } from './types';
import type { CalendarData } from '@/services/storage/StorageService';

const EXPORT_VERSION = '1.0';

export class JsonExporter implements Exporter {
  readonly format: ExportFormat = 'json';
  readonly fileExtension = '.json';
  readonly mimeType = 'application/json';

  async export(data: CalendarData, options: ExportOptions = {}): Promise<Blob> {
    const filteredData = this.filterData(data, options);

    const exportData = {
      version: EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      generator: 'Kalendarz MVP',
      ...filteredData
    };

    const json = JSON.stringify(exportData, null, 2);
    return new Blob([json], { type: this.mimeType });
  }

  private filterData(data: CalendarData, options: ExportOptions): CalendarData {
    let entries = [...data.entries];
    let templates = [...data.templates];

    // Filter archived entries
    if (!options.includeArchived) {
      entries = entries.filter(e => !e.isArchived);
    }

    // Filter system templates
    if (!options.includeSystemTemplates) {
      templates = templates.filter(t => !t.isSystem);
    }

    // Filter by date range
    if (options.dateRange) {
      const { start, end } = options.dateRange;
      entries = entries.filter(e => {
        const date = e.date;
        return date >= start && date <= end;
      });
    }

    return {
      ...data,
      entries,
      templates
    };
  }
}

// Helper function for download
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Factory function
export function createJsonExporter(): JsonExporter {
  return new JsonExporter();
}
```

## Kryteria Akceptacji

- [ ] Eksportuje CalendarData do JSON
- [ ] Filtruje archived entries
- [ ] Filtruje system templates
- [ ] Filtruje po date range
- [ ] Zwraca Blob z proper mimeType
- [ ] downloadBlob helper

## Powiązane Zadania

- [TASK-027: Interface](../TASK-027-ImportExportInterface/TASK.md)

## Scenariusze Testowe

1. Export z includeArchived=false nie zawiera archived
2. Export z dateRange filtruje wpisy
3. Blob ma correct mimeType
4. downloadBlob tworzy download

## Notatki

- JSON.stringify z indent 2 dla czytelności
- version dla kompatybilności wstecznej
- generator dla identyfikacji źródła
