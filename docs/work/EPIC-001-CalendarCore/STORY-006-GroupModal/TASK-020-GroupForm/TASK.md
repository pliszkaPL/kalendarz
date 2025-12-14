# TASK-020: Group Form Logic

## Metadane

- **ID**: `TASK-020`
- **Typ**: `task`
- **Tytuł**: Group Form Logic
- **Status**: `new`
- **Story**: [STORY-006: Group Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Logika formularza grupy - walidacja i submit. Większość w TASK-019.

## Kontrakt (Behaviors)

```typescript
// Group form validation
interface GroupFormValidation {
  name: { required: true, minLength: 1, maxLength: 100 };
  color: { required: true, format: 'hex' };
  description: { required: false, maxLength: 500 };
  tags: { required: false, maxItems: 10 };
}

// Preset change -> update color
function onPresetChange(preset: TemplatePreset): void {
  form.color = TEMPLATE_PRESETS[preset].color;
}

// Submit creates/updates group + creates entries
async function handleSubmit(): Promise<void> {
  // 1. Validate
  if (!validate()) return;

  // 2. Save group
  const group = await saveGroup(form);

  // 3. Create entries from GroupEntriesSection
  for (const entry of form.entries) {
    await createEntryForGroup(group.id, entry);
  }

  // 4. Close
  emit('close');
}
```

## Kryteria Akceptacji

- [ ] Walidacja: name required
- [ ] Preset change -> color change
- [ ] Submit saves group
- [ ] Submit creates entries from form.entries

## Powiązane Zadania

- [TASK-019: Group Modal UI](../TASK-019-GroupModalUI/TASK.md)

## Notatki

- Logika głównie w TASK-019
- form.entries z GroupEntriesSection
