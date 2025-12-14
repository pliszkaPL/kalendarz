# STORY-009: Import/Export

## Metadane

- **ID**: `STORY-009`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Import/Export (Strategy pattern)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** eksportować i importować dane kalendarza
**Aby** móc tworzyć kopie zapasowe i przenosić dane

## Opis

Implementacja importu/eksportu z interfejsem i różnymi implementacjami (Strategy pattern):
- ImportExportService interface
- JsonExporter/JsonImporter
- (przyszłość) iCalExporter

## Kryteria Akceptacji

- [ ] ImportExportService interface zdefiniowany
- [ ] JsonExporter eksportuje do .json
- [ ] JsonImporter importuje z .json
- [ ] UI do importu/eksportu
- [ ] Walidacja importowanych danych

## Zadania (Tasks)

- [TASK-027: Import/Export Interface](./TASK-027-ImportExportInterface/TASK.md)
- [TASK-028: JSON Exporter](./TASK-028-JsonExporter/TASK.md)
- [TASK-029: JSON Importer](./TASK-029-JsonImporter/TASK.md)

## Wymagania Niefunkcjonalne

- Max file size: 10MB
- Walidacja schematu przy imporcie
- Progress indicator dla dużych plików

## Zależności

- STORY-002: Storage Layer (CalendarData type)

## Notatki

- Strategy pattern dla łatwego dodawania formatów
- iCalendar jako przyszłe rozszerzenie
