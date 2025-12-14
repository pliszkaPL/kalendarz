# TASK-005: LocalStorage Implementation

## Metadane

- **ID**: `TASK-005`
- **Typ**: `task`
- **Tytuł**: LocalStorage Implementation
- **Status**: `new`
- **Story**: [STORY-002: Storage Layer](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja StorageService używająca localStorage jako backend.

**Lokalizacja pliku**: `frontend/src/services/storage/LocalStorageService.ts`

## Kontrakt (Implementation)

```typescript
// frontend/src/services/storage/LocalStorageService.ts

import type { StorageService, StorageOptions, CalendarData } from './StorageService';
import type { Entry, Group, Template } from '@/types';
import { PREDEFINED_TEMPLATES } from '@/data/predefinedTemplates';

const DEFAULT_PREFIX = 'kalendarz_';
const STORAGE_VERSION = '1.0';

/**
 * Implementacja StorageService dla localStorage
 */
export class LocalStorageService implements StorageService {
  private prefix: string;

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix ?? DEFAULT_PREFIX;
    this.initializeIfEmpty();
  }

  private getKey(name: string): string {
    return `${this.prefix}${name}`;
  }

  private read<T>(key: string): T[] {
    const data = localStorage.getItem(this.getKey(key));
    return data ? JSON.parse(data) : [];
  }

  private write<T>(key: string, data: T[]): void {
    localStorage.setItem(this.getKey(key), JSON.stringify(data));
  }

  private initializeIfEmpty(): void {
    // Załaduj predefiniowane szablony jeśli brak
    const templates = this.read<Template>('templates');
    if (templates.length === 0) {
      this.write('templates', PREDEFINED_TEMPLATES);
    }
  }

  // === Entries ===

  async getEntries(): Promise<Entry[]> {
    return this.read<Entry>('entries');
  }

  async getEntry(id: string): Promise<Entry | null> {
    const entries = await this.getEntries();
    return entries.find(e => e.id === id) ?? null;
  }

  async saveEntry(entry: Entry): Promise<Entry> {
    const entries = await this.getEntries();
    const index = entries.findIndex(e => e.id === entry.id);

    const now = new Date().toISOString();
    const updatedEntry = {
      ...entry,
      updatedAt: now,
      createdAt: entry.createdAt || now
    };

    if (index >= 0) {
      entries[index] = updatedEntry;
    } else {
      entries.push(updatedEntry);
    }

    this.write('entries', entries);
    return updatedEntry;
  }

  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getEntries();
    this.write('entries', entries.filter(e => e.id !== id));
  }

  async getEntriesByMonth(year: number, month: number): Promise<Entry[]> {
    const entries = await this.getEntries();
    return entries.filter(entry => {
      const date = new Date(entry.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });
  }

  async getEntriesByGroup(groupId: string): Promise<Entry[]> {
    const entries = await this.getEntries();
    return entries.filter(e => e.groupId === groupId);
  }

  // === Groups ===

  async getGroups(): Promise<Group[]> {
    return this.read<Group>('groups');
  }

  async getGroup(id: string): Promise<Group | null> {
    const groups = await this.getGroups();
    return groups.find(g => g.id === id) ?? null;
  }

  async saveGroup(group: Group): Promise<Group> {
    const groups = await this.getGroups();
    const index = groups.findIndex(g => g.id === group.id);

    const now = new Date().toISOString();
    const updatedGroup = {
      ...group,
      updatedAt: now,
      createdAt: group.createdAt || now
    };

    if (index >= 0) {
      groups[index] = updatedGroup;
    } else {
      groups.push(updatedGroup);
    }

    this.write('groups', groups);
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<void> {
    const groups = await this.getGroups();
    this.write('groups', groups.filter(g => g.id !== id));

    // Usuń powiązanie z wpisów
    const entries = await this.getEntries();
    const updated = entries.map(e =>
      e.groupId === id ? { ...e, groupId: null } : e
    );
    this.write('entries', updated);
  }

  // === Templates ===

  async getTemplates(): Promise<Template[]> {
    return this.read<Template>('templates');
  }

  async getTemplate(id: string): Promise<Template | null> {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === id) ?? null;
  }

  async saveTemplate(template: Template): Promise<Template> {
    const templates = await this.getTemplates();
    const index = templates.findIndex(t => t.id === template.id);

    const now = new Date().toISOString();
    const updatedTemplate = {
      ...template,
      updatedAt: now,
      createdAt: template.createdAt || now
    };

    if (index >= 0) {
      templates[index] = updatedTemplate;
    } else {
      templates.push(updatedTemplate);
    }

    this.write('templates', templates);
    return updatedTemplate;
  }

  async archiveTemplate(id: string): Promise<void> {
    const template = await this.getTemplate(id);
    if (template) {
      await this.saveTemplate({ ...template, isArchived: true });
    }
  }

  // === Bulk ===

  async exportAll(): Promise<CalendarData> {
    return {
      version: STORAGE_VERSION,
      exportedAt: new Date().toISOString(),
      entries: await this.getEntries(),
      groups: await this.getGroups(),
      templates: (await this.getTemplates()).filter(t => !t.isSystem)
    };
  }

  async importAll(data: CalendarData, mode: 'merge' | 'replace'): Promise<void> {
    if (mode === 'replace') {
      await this.clearAll();
    }

    for (const entry of data.entries) {
      await this.saveEntry(entry);
    }
    for (const group of data.groups) {
      await this.saveGroup(group);
    }
    for (const template of data.templates) {
      await this.saveTemplate(template);
    }
  }

  async clearAll(): Promise<void> {
    this.write('entries', []);
    this.write('groups', []);
    // Zachowaj predefiniowane szablony
    const templates = await this.getTemplates();
    this.write('templates', templates.filter(t => t.isSystem));
  }
}

// Singleton instance
export const localStorageService = new LocalStorageService();
```

## Kryteria Akceptacji

- [ ] Implementuje wszystkie metody StorageService
- [ ] Dane persystują w localStorage
- [ ] Predefiniowane szablony ładowane przy pierwszym uruchomieniu
- [ ] deleteGroup usuwa powiązanie z wpisów
- [ ] exportAll nie eksportuje systemowych szablonów
- [ ] clearAll zachowuje systemowe szablony
- [ ] Singleton export

## Powiązane Zadania

- [TASK-004: Storage Interface](../TASK-004-StorageInterface/TASK.md)
- [TASK-006: Pinia Stores](../TASK-006-PiniaStores/TASK.md)

## Scenariusze Testowe

1. saveEntry zapisuje do localStorage
2. getEntry zwraca zapisany wpis
3. deleteEntry usuwa wpis
4. deleteGroup ustawia groupId=null na wpisach
5. exportAll -> importAll przywraca dane
6. clearAll zachowuje systemowe szablony

## Notatki

- Klucze localStorage: `kalendarz_entries`, `kalendarz_groups`, `kalendarz_templates`
- createdAt/updatedAt ustawiane automatycznie
- getEntriesByMonth używa JavaScript Date (month 0-indexed)
- PREDEFINED_TEMPLATES z osobnego pliku (TASK-022)
