# STORY-007: Template System

## Metadane

- **ID**: `STORY-007`
- **Epic**: [EPIC-001: Calendar Core](../EPIC.md)
- **Tytuł**: Template System (Zmienne i logika)
- **Status**: `new`
- **Owner**: Frontend Team

## User Story

**Jako** użytkownik
**Chcę** używać szablonów z zmiennymi i logiką
**Aby** automatycznie wyświetlać obliczone wartości (np. wiek)

## Opis

Implementacja systemu szablonów zgodnie z PRD FR-3:
- Predefiniowane szablony (20 sztuk)
- Zmienne w displayFormat (np. `{imie}`, `{wiek}`)
- Operacje: calculateAge, daysUntil, insertText
- Dynamiczne formularze na podstawie fields

## Kryteria Akceptacji

- [ ] 20 predefiniowanych szablonów
- [ ] TemplateEngine parsuje displayFormat
- [ ] Zmienne interpolowane z customData
- [ ] Operacje obliczają wartości (wiek, dni do)
- [ ] Formularz wpisu generowany dynamicznie z template.fields

## Zadania (Tasks)

- [TASK-022: Template Engine](./TASK-022-TemplateEngine/TASK.md)
- [TASK-023: Template Variables](./TASK-023-TemplateVariables/TASK.md)
- [TASK-024: Template Operations](./TASK-024-TemplateOperations/TASK.md)

## Wymagania Niefunkcjonalne

- Performance: operacje wykonywane przy renderowaniu
- Caching: wyniki operacji cachowane per render

## Zależności

- STORY-001: Domain Types (Template, TemplateField, TemplateOperation)

## Notatki

- Zgodne z PRD FR-3.1 - FR-3.9
- calculateAge: lata od daty urodzenia
- daysUntil: dni do następnego wystąpienia
