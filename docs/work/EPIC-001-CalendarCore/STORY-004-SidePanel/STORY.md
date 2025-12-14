# STORY-004: Side Panel

## Metadane

- **ID**: `STORY-004`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Side Panel (Groups & Entries)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** widzieć panel boczny z grupami i wpisami
**Aby** szybko przeglądać i zarządzać moimi danymi

## Opis

Implementacja panelu bocznego zgodnie z HTML mockup:
1. **SidePanel** - layout panelu
2. **SearchInput** - wyszukiwarka wpisów
3. **GroupList** - lista grup z akcjami
4. **EntryList** - lista wszystkich wpisów

## Kryteria Akceptacji

- [ ] Panel boczny po lewej stronie kalendarza
- [ ] Wyszukiwarka na górze panelu
- [ ] Sekcja "Grupy" z przyciskiem dodawania
- [ ] Lista grup z kolorami, tagami, licznikami
- [ ] Przyciski edycji/usuwania grupy
- [ ] Sekcja "Wszystkie wpisy"
- [ ] Lista wpisów z ikoną, nazwą, datą, tagami
- [ ] Przyciski edycji/archiwizacji wpisu
- [ ] Filtrowanie wpisów po wyszukiwanym tekście

## Zadania (Tasks)

- [TASK-011: Side Panel Layout](./TASK-011-SidePanelLayout/TASK.md)
- [TASK-012: Group List Component](./TASK-012-GroupList/TASK.md)
- [TASK-013: Entry List Component](./TASK-013-EntryList/TASK.md)
- [TASK-014: Search Input Component](./TASK-014-SearchInput/TASK.md)

## Wymagania Niefunkcjonalne

- Responsywność: ukryty na mobile, widoczny na desktop
- Scroll: osobny scroll dla grup i wpisów
- Performance: virtualizacja dla >100 wpisów (opcjonalne)

## Zależności

- STORY-001: Domain Types
- STORY-002: Storage Layer (stores)

## Notatki

- Zgodne z HTML mockup (klasy: side-panel, groups-section, entries-section)
- Kolory grup jako border-left
- Tagi jako chipy
