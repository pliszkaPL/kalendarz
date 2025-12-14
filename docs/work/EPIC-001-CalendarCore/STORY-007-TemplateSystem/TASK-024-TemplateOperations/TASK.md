# TASK-024: Template Operations

## Metadane

- **ID**: `TASK-024`
- **Typ**: `task`
- **Tytuł**: Template Operations - Predefiniowane szablony
- **Status**: `new`
- **Story**: [STORY-007: Template System](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Definicja 20 predefiniowanych szablonów zgodnie z PRD FR-3.9.

**Lokalizacja pliku**: `frontend/src/data/predefinedTemplates.ts`

## Kontrakt (Data)

```typescript
// frontend/src/data/predefinedTemplates.ts

import type { Template } from '@/types';

export const PREDEFINED_TEMPLATES: Template[] = [
  // 1. Urodziny
  {
    id: 'tpl-birthday',
    name: 'Urodziny',
    preset: 'birthday',
    icon: '🎂',
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff',
    fields: [
      { name: 'person', label: 'Imię', type: 'text', required: true },
      { name: 'birthDate', label: 'Data urodzenia', type: 'date', required: true }
    ],
    displayFormat: 'Urodziny {person} ({age} lat)',
    operations: [
      { type: 'calculateAge', sourceField: 'birthDate', outputVariable: 'age' }
    ],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 2. Rocznica
  {
    id: 'tpl-anniversary',
    name: 'Rocznica',
    preset: 'anniversary',
    icon: '💕',
    backgroundColor: '#ff69b4',
    textColor: '#ffffff',
    fields: [
      { name: 'event', label: 'Wydarzenie', type: 'text', required: true },
      { name: 'startDate', label: 'Data początku', type: 'date', required: true }
    ],
    displayFormat: '{event} ({years} rocznica)',
    operations: [
      { type: 'calculateAge', sourceField: 'startDate', outputVariable: 'years' }
    ],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 3. Święto
  {
    id: 'tpl-holiday',
    name: 'Święto',
    preset: 'holiday',
    icon: '🎉',
    backgroundColor: '#45b7d1',
    textColor: '#ffffff',
    fields: [
      { name: 'holidayName', label: 'Nazwa święta', type: 'text', required: true }
    ],
    displayFormat: '{holidayName}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 4. Spotkanie
  {
    id: 'tpl-meeting',
    name: 'Spotkanie',
    preset: 'meeting',
    icon: '📅',
    backgroundColor: '#96ceb4',
    textColor: '#ffffff',
    fields: [
      { name: 'title', label: 'Tytuł', type: 'text', required: true },
      { name: 'location', label: 'Miejsce', type: 'text', required: false }
    ],
    displayFormat: '{title}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 5. Przypomnienie
  {
    id: 'tpl-reminder',
    name: 'Przypomnienie',
    preset: 'reminder',
    icon: '⏰',
    backgroundColor: '#ffeaa7',
    textColor: '#2d3436',
    fields: [
      { name: 'reminder', label: 'Przypomnienie', type: 'text', required: true }
    ],
    displayFormat: '{reminder}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 6. Pamięć (śmierć)
  {
    id: 'tpl-memorial',
    name: 'Pamięć',
    preset: 'death',
    icon: '🕊️',
    backgroundColor: '#636e72',
    textColor: '#ffffff',
    fields: [
      { name: 'person', label: 'Imię', type: 'text', required: true },
      { name: 'deathDate', label: 'Data śmierci', type: 'date', required: true }
    ],
    displayFormat: 'Pamięć: {person} ({years} lat temu)',
    operations: [
      { type: 'calculateAge', sourceField: 'deathDate', outputVariable: 'years' }
    ],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 7-20: Dodatkowe szablony
  // ... (Podatki, Opłaty, Imieniny, Wizyta lekarska, Przegląd auta, etc.)

  // 7. Podatki
  {
    id: 'tpl-taxes',
    name: 'Podatki',
    preset: 'reminder',
    icon: '💰',
    backgroundColor: '#e17055',
    textColor: '#ffffff',
    fields: [
      { name: 'taxType', label: 'Rodzaj podatku', type: 'text', required: true },
      { name: 'amount', label: 'Kwota', type: 'number', required: false }
    ],
    displayFormat: '{taxType}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 8. Opłata
  {
    id: 'tpl-payment',
    name: 'Opłata',
    preset: 'reminder',
    icon: '💳',
    backgroundColor: '#00b894',
    textColor: '#ffffff',
    fields: [
      { name: 'paymentName', label: 'Nazwa opłaty', type: 'text', required: true },
      { name: 'amount', label: 'Kwota', type: 'number', required: false }
    ],
    displayFormat: '{paymentName}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 9. Imieniny
  {
    id: 'tpl-nameday',
    name: 'Imieniny',
    preset: 'birthday',
    icon: '🎊',
    backgroundColor: '#a29bfe',
    textColor: '#ffffff',
    fields: [
      { name: 'person', label: 'Imię', type: 'text', required: true }
    ],
    displayFormat: 'Imieniny: {person}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // 10. Wizyta lekarska
  {
    id: 'tpl-doctor',
    name: 'Wizyta lekarska',
    preset: 'meeting',
    icon: '🏥',
    backgroundColor: '#74b9ff',
    textColor: '#ffffff',
    fields: [
      { name: 'doctor', label: 'Lekarz/Specjalista', type: 'text', required: true },
      { name: 'location', label: 'Miejsce', type: 'text', required: false }
    ],
    displayFormat: 'Wizyta: {doctor}',
    operations: [],
    isArchived: false,
    isSystem: true,
    userId: null,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  // ... pozostałe szablony (11-20) analogicznie
];
```

## Kryteria Akceptacji

- [ ] Minimum 10 predefiniowanych szablonów (docelowo 20)
- [ ] Szablony mają isSystem: true
- [ ] Urodziny ma calculateAge operation
- [ ] Każdy szablon ma unikalne id
- [ ] Kolory i ikony zgodne z mockup

## Powiązane Zadania

- [TASK-022: Template Engine](../TASK-022-TemplateEngine/TASK.md)
- [TASK-005: LocalStorage Implementation](../../STORY-002-StorageLayer/TASK-005-LocalStorageImpl/TASK.md)

## Scenariusze Testowe

1. PREDEFINED_TEMPLATES ma >= 10 elementów
2. Każdy szablon ma wymagane pola
3. Template "Urodziny" ma operację calculateAge

## Notatki

- Szablony zgodne z PRD FR-3.9
- Ładowane przy pierwszym uruchomieniu (LocalStorageService)
- isSystem: true - nie można usunąć, tylko archiwizować
