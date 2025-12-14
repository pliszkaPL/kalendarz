# TASK-023: Template Variables

## Metadane

- **ID**: `TASK-023`
- **Typ**: `task`
- **Tytuł**: Template Variables - Dynamiczny formularz
- **Status**: `new`
- **Story**: [STORY-007: Template System](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Dynamiczne generowanie pól formularza na podstawie template.fields.

**Lokalizacja pliku**: `frontend/src/components/common/TemplateFields.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/common/TemplateFields.vue -->
<template>
  <div class="template-fields">
    <div
      v-for="field in fields"
      :key="field.name"
      class="form-group"
    >
      <label>
        {{ field.label }}
        <span v-if="field.required" class="required">*</span>
      </label>

      <!-- Text field -->
      <input
        v-if="field.type === 'text'"
        :value="modelValue[field.name]"
        type="text"
        :required="field.required"
        @input="updateField(field.name, ($event.target as HTMLInputElement).value)"
      />

      <!-- Date field -->
      <input
        v-else-if="field.type === 'date'"
        :value="modelValue[field.name]"
        type="date"
        :required="field.required"
        @input="updateField(field.name, ($event.target as HTMLInputElement).value)"
      />

      <!-- Number field -->
      <input
        v-else-if="field.type === 'number'"
        :value="modelValue[field.name]"
        type="number"
        :required="field.required"
        @input="updateField(field.name, Number(($event.target as HTMLInputElement).value))"
      />

      <!-- Select field -->
      <select
        v-else-if="field.type === 'select'"
        :value="modelValue[field.name]"
        :required="field.required"
        @change="updateField(field.name, ($event.target as HTMLSelectElement).value)"
      >
        <option value="">-- Wybierz --</option>
        <option
          v-for="option in field.options"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>

    <div v-if="fields.length === 0" class="no-fields">
      {{ t('noCustomFields') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalendarStore } from '@/stores/calendar';
import type { TemplateField } from '@/types';

// Props
const props = defineProps<{
  fields: TemplateField[];
  modelValue: Record<string, unknown>;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, unknown>): void;
}>();

// Store
const calendarStore = useCalendarStore();

// i18n
const translations = {
  pl: { noCustomFields: 'Brak niestandardowych pól' },
  en: { noCustomFields: 'No custom fields' }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function updateField(name: string, value: unknown) {
  emit('update:modelValue', {
    ...props.modelValue,
    [name]: value
  });
}
</script>

<style scoped>
.template-fields {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.required {
  color: #f44336;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-fields {
  color: #999;
  font-size: 0.875rem;
  text-align: center;
}
</style>
```

## Kryteria Akceptacji

- [ ] Renderuje pola na podstawie template.fields
- [ ] Obsługuje typy: text, date, number, select
- [ ] Required fields oznaczone *
- [ ] v-model binding z customData
- [ ] Select z opcjami

## Powiązane Zadania

- [TASK-015: Entry Modal UI](../../STORY-005-EntryModal/TASK-015-EntryModalUI/TASK.md)
- [TASK-002: Template Types](../../STORY-001-DomainTypes/TASK-002-TemplateTypes/TASK.md)

## Scenariusze Testowe

1. Template z 2 polami renderuje 2 inputy
2. Pole typu select pokazuje opcje
3. Zmiana wartości emituje update:modelValue
4. Required pole ma * przy etykiecie

## Notatki

- Używany w EntryModal gdy szablon ma fields
- customData przechowuje wartości pól
- defaultValue z field używany jako initial value
