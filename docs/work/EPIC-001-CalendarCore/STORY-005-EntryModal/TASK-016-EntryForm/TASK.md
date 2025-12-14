# TASK-016: Entry Form Logic

## Metadane

- **ID**: `TASK-016`
- **Typ**: `task`
- **Tytuł**: Entry Form Logic
- **Status**: `new`
- **Story**: [STORY-005: Entry Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Logika formularza wpisu (walidacja, submit, template change). Większość logiki jest w TASK-015, ten task doprecyzowuje zachowania.

## Kontrakt (Behaviors)

```typescript
// Behaviors for Entry Form

/**
 * Walidacja formularza
 */
interface FormValidation {
  // Required fields
  name: { required: true, minLength: 1 };
  date: { required: true, format: 'YYYY-MM-DD' };

  // Optional fields
  templateId: { required: false };
  groupId: { required: false };
  description: { required: false, maxLength: 1000 };
  tags: { required: false, maxItems: 10 };
}

/**
 * Template change behavior
 * Gdy użytkownik zmienia szablon:
 * 1. Zmień kolor na kolor szablonu
 * 2. Zachowaj pozostałe pola
 */
function onTemplateChange(templateId: string): void {
  const template = getTemplate(templateId);
  if (template) {
    form.color = template.backgroundColor;
    // NIE zmieniaj innych pól
  }
}

/**
 * Submit behavior
 */
async function handleSubmit(): Promise<void> {
  // 1. Waliduj
  if (!validate()) return;

  // 2. Buduj RecurrenceRule
  const recurrence = buildRecurrence(form.recurrenceType, form.recurrence);

  // 3. Buduj Entry
  const entry = buildEntry(form, recurrence);

  // 4. Zapisz (add lub update)
  if (isEditing) {
    await entriesStore.updateEntry(entry);
  } else {
    await entriesStore.addEntry(entry);
  }

  // 5. Zamknij modal
  emit('close');
}

/**
 * Budowanie RecurrenceRule
 */
function buildRecurrence(
  type: 'exact' | 'yearly' | 'custom',
  customRule: RecurrenceRule | null
): RecurrenceRule | null {
  switch (type) {
    case 'exact':
      return null; // Brak powtarzania
    case 'yearly':
      return { type: 'yearly' };
    case 'custom':
      return customRule; // Z RecurrenceSelector
  }
}

/**
 * Load entry for editing
 */
function loadEntry(entryId: string): void {
  const entry = entriesStore.entries.find(e => e.id === entryId);
  if (!entry) return;

  form.name = entry.name;
  form.templateId = entry.templateId;
  form.date = entry.date;
  form.description = entry.description;
  form.groupId = entry.groupId || '';
  form.tags = [...entry.tags];

  // Determine recurrence type
  if (!entry.recurrence) {
    form.recurrenceType = 'exact';
  } else if (entry.recurrence.type === 'yearly') {
    form.recurrenceType = 'yearly';
  } else {
    form.recurrenceType = 'custom';
    form.recurrence = entry.recurrence;
  }
}
```

## Kryteria Akceptacji

- [ ] Walidacja: name i date required
- [ ] Template change aktualizuje kolor
- [ ] Submit buduje poprawny RecurrenceRule
- [ ] Edit mode ładuje istniejące dane
- [ ] Submit zapisuje do store

## Powiązane Zadania

- [TASK-015: Entry Modal UI](../TASK-015-EntryModalUI/TASK.md)

## Scenariusze Testowe

1. Pusty name -> błąd walidacji
2. Zmiana template -> zmiana koloru
3. type=exact -> recurrence=null
4. type=yearly -> recurrence={type:'yearly'}
5. Edit mode ładuje wszystkie pola

## Notatki

- Logika głównie w TASK-015
- Ten task dokumentuje behaviors
- customData będzie używane w STORY-007 (Templates)
