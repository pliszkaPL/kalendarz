# STORY-002: Storage Layer

## Metadane

- **ID**: `STORY-002`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Storage Layer (localStorage + API interface)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** aby moje dane były zapisywane lokalnie i opcjonalnie synchronizowane z serwerem
**Aby** móc korzystać z kalendarza offline i nie stracić danych

## Opis

Implementacja warstwy persystencji danych:
1. **StorageService interface** - abstrakcja nad storage
2. **LocalStorageService** - implementacja dla localStorage
3. **Pinia Stores** - state management dla Vue

Architektura:
- Strategy pattern dla storage (localStorage / API)
- Pinia stores używają StorageService
- Reaktywność Vue przez Pinia

## Kryteria Akceptacji

- [ ] StorageService interface zdefiniowany
- [ ] LocalStorageService implementuje interface
- [ ] Pinia store dla Entries (CRUD)
- [ ] Pinia store dla Groups (CRUD)
- [ ] Pinia store dla Templates (CRUD + predefiniowane)
- [ ] Dane persystują po odświeżeniu strony
- [ ] Testy jednostkowe dla storage

## Zadania (Tasks)

- [TASK-004: Storage Interface](./TASK-004-StorageInterface/TASK.md)
- [TASK-005: LocalStorage Implementation](./TASK-005-LocalStorageImpl/TASK.md)
- [TASK-006: Pinia Stores](./TASK-006-PiniaStores/TASK.md)

## Wymagania Niefunkcjonalne

- localStorage limit: 5MB (kompresja opcjonalna)
- Atomic operations (nie zostawiaj danych w niespójnym stanie)
- Obsługa błędów (QuotaExceededError)

## Zależności

- STORY-001: Domain Types (typy Entry, Group, Template)
- Pinia zainstalowana w projekcie

## Notatki

- API sync będzie dodane później (osobna implementacja StorageService)
- Predefiniowane szablony ładowane przy pierwszym uruchomieniu
- UUID generowane przez crypto.randomUUID()
