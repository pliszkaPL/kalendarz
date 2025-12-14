# TASK-030: Search Service

## Metadane

- **ID**: `TASK-030`
- **Typ**: `task`
- **Tytuł**: Search Service
- **Status**: `new`
- **Story**: [STORY-010: Search & Filter](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Serwis do wyszukiwania wpisów.

**Lokalizacja pliku**: `frontend/src/services/SearchService.ts`

## Kontrakt (Service)

```typescript
// frontend/src/services/SearchService.ts

import type { Entry, Group } from '@/types';

/**
 * Opcje wyszukiwania
 */
export interface SearchOptions {
  /** Szukaj w nazwie */
  searchName?: boolean;
  /** Szukaj w opisie */
  searchDescription?: boolean;
  /** Szukaj w tagach */
  searchTags?: boolean;
  /** Filtruj po grupie */
  groupId?: string | null;
  /** Filtruj po dacie (zakres) */
  dateRange?: {
    start?: string;
    end?: string;
  };
  /** Uwzględnij zarchiwizowane */
  includeArchived?: boolean;
  /** Limit wyników */
  limit?: number;
}

/**
 * Wynik wyszukiwania
 */
export interface SearchResult {
  entry: Entry;
  score: number;
  matches: {
    field: 'name' | 'description' | 'tags';
    value: string;
  }[];
}

/**
 * Serwis wyszukiwania
 */
export class SearchService {
  /**
   * Wyszukaj wpisy
   */
  search(
    entries: Entry[],
    query: string,
    options: SearchOptions = {}
  ): SearchResult[] {
    const {
      searchName = true,
      searchDescription = true,
      searchTags = true,
      groupId = null,
      dateRange,
      includeArchived = false,
      limit = 50
    } = options;

    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery && !groupId && !dateRange) {
      return [];
    }

    let results = entries
      .filter(entry => {
        // Exclude archived
        if (!includeArchived && entry.isArchived) return false;

        // Filter by group
        if (groupId && entry.groupId !== groupId) return false;

        // Filter by date range
        if (dateRange) {
          if (dateRange.start && entry.date < dateRange.start) return false;
          if (dateRange.end && entry.date > dateRange.end) return false;
        }

        return true;
      })
      .map(entry => this.scoreEntry(entry, normalizedQuery, {
        searchName,
        searchDescription,
        searchTags
      }))
      .filter(result => result.score > 0 || !normalizedQuery)
      .sort((a, b) => b.score - a.score);

    if (limit > 0) {
      results = results.slice(0, limit);
    }

    return results;
  }

  /**
   * Oblicz score dla wpisu
   */
  private scoreEntry(
    entry: Entry,
    query: string,
    options: { searchName: boolean; searchDescription: boolean; searchTags: boolean }
  ): SearchResult {
    const matches: SearchResult['matches'] = [];
    let score = 0;

    if (!query) {
      return { entry, score: 1, matches };
    }

    // Search in name (highest weight)
    if (options.searchName) {
      const name = entry.name.toLowerCase();
      if (name.includes(query)) {
        score += name === query ? 100 : name.startsWith(query) ? 50 : 25;
        matches.push({ field: 'name', value: entry.name });
      }
    }

    // Search in description
    if (options.searchDescription && entry.description) {
      const desc = entry.description.toLowerCase();
      if (desc.includes(query)) {
        score += 10;
        matches.push({ field: 'description', value: entry.description });
      }
    }

    // Search in tags
    if (options.searchTags) {
      for (const tag of entry.tags) {
        if (tag.toLowerCase().includes(query)) {
          score += 15;
          matches.push({ field: 'tags', value: tag });
        }
      }
    }

    return { entry, score, matches };
  }

  /**
   * Pobierz sugestie tagów
   */
  getTagSuggestions(entries: Entry[], prefix: string): string[] {
    const allTags = new Set<string>();
    const normalizedPrefix = prefix.toLowerCase();

    for (const entry of entries) {
      for (const tag of entry.tags) {
        if (tag.toLowerCase().startsWith(normalizedPrefix)) {
          allTags.add(tag);
        }
      }
    }

    return Array.from(allTags).sort();
  }
}

// Singleton
export const searchService = new SearchService();
```

## Kryteria Akceptacji

- [ ] search() zwraca posortowane wyniki
- [ ] Scoring: name > tags > description
- [ ] Filtrowanie po groupId
- [ ] Filtrowanie po dateRange
- [ ] Limit wyników
- [ ] getTagSuggestions dla autocomplete

## Powiązane Zadania

- [TASK-014: Search Input](../../STORY-004-SidePanel/TASK-014-SearchInput/TASK.md)

## Scenariusze Testowe

1. Query "test" znajduje entry z name "Test entry"
2. Entry z exact match ma wyższy score
3. groupId filtruje tylko tę grupę
4. dateRange filtruje po datach
5. limit=10 zwraca max 10 wyników

## Notatki

- Scoring: exact=100, startsWith=50, contains=25
- Tags mają wyższy weight niż description
- getTagSuggestions dla #tag autocomplete
