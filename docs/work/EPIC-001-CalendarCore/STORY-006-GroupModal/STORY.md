# STORY-006: Group Modal

## Metadane

- **ID**: `STORY-006`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Group Modal (Dodawanie/Edycja grupy)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** dodawać i edytować grupy przez modal
**Aby** organizować moje wpisy w kategorie

## Opis

Implementacja modala do dodawania/edycji grup zgodnie z HTML mockup:
- Nazwa grupy
- Szablon (preset)
- Opis
- Kolor
- Tagi
- Sekcja dodawania wpisów do grupy

## Kryteria Akceptacji

- [ ] Modal overlay z zamykaniem
- [ ] Formularz z polami z mockup
- [ ] Color picker
- [ ] Tags input
- [ ] Sekcja "Group Entries" - dodawanie wpisów
- [ ] Walidacja (nazwa required)
- [ ] Tryb dodawania i edycji

## Zadania (Tasks)

- [TASK-019: Group Modal UI](./TASK-019-GroupModalUI/TASK.md)
- [TASK-020: Group Form Logic](./TASK-020-GroupForm/TASK.md)
- [TASK-021: Group Entries Section](./TASK-021-GroupEntries/TASK.md)

## Wymagania Niefunkcjonalne

- Modal zamyka się Escape
- Reuse TagsInput z TASK-017

## Zależności

- STORY-001: Domain Types (Group)
- STORY-002: Storage Layer (stores)
- TASK-017: Tags Input Component

## Notatki

- Podobna struktura do EntryModal
- Group Entries pozwala dodawać wpisy bezpośrednio z modala grupy
