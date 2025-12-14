# TASK-004: Storage Interface

## Metadane

- **ID**: `TASK-004`
- **Typ**: `task`
- **Tytuł**: Storage Interface - Abstrakcja nad storage
- **Status**: `new`
- **Story**: [STORY-002: Storage Layer](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Definicja interfejsu StorageService jako abstrakcji nad warstwą persystencji. Umożliwia podmianę implementacji (localStorage, API) bez zmiany logiki aplikacji.

**Lokalizacja pliku**: `frontend/src/services/storage/StorageService.ts`

## Kontrakt (Interface)

```typescript
// frontend/src/services/storage/StorageService.ts

import type { Entry, Group, Template } from '@/types';

/**
 * Interfejs serwisu storage
 * Implementacje: LocalStorageService, ApiStorageService
 */
export interface StorageService {
  // === Entries ===

  /** Pobierz wszystkie wpisy */
  getEntries(): Promise<Entry[]>;

  /** Pobierz wpis po ID */
  getEntry(id: string): Promise<Entry | null>;

  /** Zapisz wpis (create lub update) */
  saveEntry(entry: Entry): Promise<Entry>;

  /** Usuń wpis */
  deleteEntry(id: string): Promise<void>;

  /** Pobierz wpisy dla danego miesiąca */
  getEntriesByMonth(year: number, month: number): Promise<Entry[]>;

  /** Pobierz wpisy dla grupy */
  getEntriesByGroup(groupId: string): Promise<Entry[]>;

  // === Groups ===

  /** Pobierz wszystkie grupy */
  getGroups(): Promise<Group[]>;

  /** Pobierz grupę po ID */
  getGroup(id: string): Promise<Group | null>;

  /** Zapisz grupę (create lub update) */
  saveGroup(group: Group): Promise<Group>;

  /** Usuń grupę */
  deleteGroup(id: string): Promise<void>;

  // === Templates ===

  /** Pobierz wszystkie szablony (user + system) */
  getTemplates(): Promise<Template[]>;

  /** Pobierz szablon po ID */
  getTemplate(id: string): Promise<Template | null>;

  /** Zapisz szablon (create lub update) */
  saveTemplate(template: Template): Promise<Template>;

  /** Archiwizuj szablon */
  archiveTemplate(id: string): Promise<void>;

  // === Bulk Operations ===

  /** Eksportuj wszystkie dane */
  exportAll(): Promise<CalendarData>;

  /** Importuj dane (merge lub replace) */
  importAll(data: CalendarData, mode: 'merge' | 'replace'): Promise<void>;

  /** Wyczyść wszystkie dane */
  clearAll(): Promise<void>;
}

/**
 * Dane kalendarza (dla import/export)
 */
export interface CalendarData {
  version: string;
  exportedAt: string;
  entries: Entry[];
  groups: Group[];
  templates: Template[];
}

/**
 * Opcje storage
 */
export interface StorageOptions {
  /** Prefix dla kluczy localStorage */
  prefix?: string;
  /** Czy kompresować dane */
  compress?: boolean;
}
```

## Kryteria Akceptacji

- [ ] Interface StorageService zdefiniowany
- [ ] Metody CRUD dla Entry, Group, Template
- [ ] Metody bulk: exportAll, importAll, clearAll
- [ ] CalendarData type dla import/export
- [ ] StorageOptions dla konfiguracji
- [ ] JSDoc comments

## Powiązane Zadania

- [TASK-005: LocalStorage Implementation](../TASK-005-LocalStorageImpl/TASK.md)
- [TASK-027: Import/Export Interface](../../STORY-009-ImportExport/TASK-027-ImportExportInterface/TASK.md)

## Scenariusze Testowe

1. Interface kompiluje się bez błędów
2. Można zaimplementować interface (duck typing)

## Notatki

- Promise-based API dla kompatybilności z async API
- getEntriesByMonth filtruje po dacie (nie wszystkie wpisy)
- archiveTemplate nie usuwa, tylko ustawia isArchived=true
- importAll z mode='merge' nie nadpisuje istniejących danych
