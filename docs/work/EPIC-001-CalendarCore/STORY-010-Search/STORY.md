# STORY-010: Search & Filter

## Metadane

- **ID**: `STORY-010`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Search & Filter
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** wyszukiwać wpisy po nazwie, dacie i tagach
**Aby** szybko znajdować potrzebne informacje

## Opis

Implementacja wyszukiwania i filtrowania wpisów:
- Wyszukiwanie tekstowe (nazwa, opis, tagi)
- Filtrowanie po grupie
- Filtrowanie po dacie

## Kryteria Akceptacji

- [ ] SearchService z metodą search()
- [ ] Wyszukiwanie po nazwie i opisie
- [ ] Wyszukiwanie po tagach
- [ ] Filtrowanie po grupie
- [ ] Wyniki sortowane by relevance

## Zadania (Tasks)

- [TASK-030: Search Service](./TASK-030-SearchService/TASK.md)
- [TASK-031: Filter by Group](./TASK-031-FilterByGroup/TASK.md)

## Wymagania Niefunkcjonalne

- Performance: instant search (< 100ms)
- Debounce: 300ms na input

## Zależności

- STORY-002: Storage Layer
- TASK-014: Search Input Component

## Notatki

- Zgodne z PRD FR-6
- Wyszukiwanie client-side (localStorage)
