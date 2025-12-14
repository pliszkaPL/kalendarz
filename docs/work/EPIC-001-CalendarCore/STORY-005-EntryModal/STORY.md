# STORY-005: Entry Modal

## Metadane

- **ID**: `STORY-005`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Entry Modal (Dodawanie/Edycja wpisu)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** dodawać i edytować wpisy przez modal
**Aby** zarządzać moimi wydarzeniami w kalendarzu

## Opis

Implementacja modala do dodawania/edycji wpisów zgodnie z HTML mockup:
- Nazwa wpisu
- Szablon (preset)
- Data
- Typ powtarzania
- Opis
- Grupa
- Tagi
- Kolor

## Kryteria Akceptacji

- [ ] Modal overlay z zamykaniem
- [ ] Formularz z wszystkimi polami z mockup
- [ ] Select szablonu (predefiniowane)
- [ ] Date picker
- [ ] Select typu powtarzania
- [ ] Textarea dla opisu
- [ ] Select grupy
- [ ] Tagi input z chipami
- [ ] Color picker
- [ ] Walidacja (nazwa, data required)
- [ ] Tryb dodawania i edycji
- [ ] Zapisanie aktualizuje store

## Zadania (Tasks)

- [TASK-015: Entry Modal UI](./TASK-015-EntryModalUI/TASK.md)
- [TASK-016: Entry Form Logic](./TASK-016-EntryForm/TASK.md)
- [TASK-017: Tags Input Component](./TASK-017-TagsInput/TASK.md)
- [TASK-018: Recurrence Selector](./TASK-018-RecurrenceSelector/TASK.md)

## Wymagania Niefunkcjonalne

- Modal zamyka się klawiszem Escape
- Focus trap w modalu
- Animacja otwarcia/zamknięcia

## Zależności

- STORY-001: Domain Types (Entry, RecurrenceRule)
- STORY-002: Storage Layer (stores)

## Notatki

- Zgodne z HTML mockup modala
- Szablon zmienia ikonę i sugeruje kolor
- RecurrenceSelector osobny komponent (TASK-018)
