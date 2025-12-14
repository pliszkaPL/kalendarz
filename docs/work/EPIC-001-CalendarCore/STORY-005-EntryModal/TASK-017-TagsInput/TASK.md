# TASK-017: Tags Input Component

## Metadane

- **ID**: `TASK-017`
- **Typ**: `task`
- **Tytuł**: Tags Input Component
- **Status**: `new`
- **Story**: [STORY-005: Entry Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja komponentu do wprowadzania tagów z chipami.

**Lokalizacja pliku**: `frontend/src/components/common/TagsInput.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/common/TagsInput.vue -->
<template>
  <div class="tags-input">
    <div class="input-row">
      <input
        v-model="newTag"
        type="text"
        :placeholder="placeholder"
        @keydown.enter.prevent="addTag"
        @keydown.comma.prevent="addTag"
      />
      <button type="button" @click="addTag">+</button>
    </div>

    <div v-if="modelValue.length > 0" class="selected-tags">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="tag"
      >
        #{{ tag }}
        <button type="button" class="remove-btn" @click="removeTag(tag)">×</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCalendarStore } from '@/stores/calendar';

// Props
const props = withDefaults(defineProps<{
  modelValue: string[];
  placeholder?: string;
  maxTags?: number;
}>(), {
  placeholder: undefined,
  maxTags: 10
});

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

// Store
const calendarStore = useCalendarStore();

// State
const newTag = ref('');

// Default placeholder
const defaultPlaceholder = calendarStore.language === 'pl' ? 'Dodaj tag' : 'Add tag';

// Methods
function addTag() {
  const tag = newTag.value.trim().toLowerCase().replace(/^#/, '');

  if (!tag) return;
  if (props.modelValue.includes(tag)) {
    newTag.value = '';
    return;
  }
  if (props.modelValue.length >= props.maxTags) {
    return;
  }

  emit('update:modelValue', [...props.modelValue, tag]);
  newTag.value = '';
}

function removeTag(tag: string) {
  emit('update:modelValue', props.modelValue.filter(t => t !== tag));
}
</script>

<style scoped>
.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-row {
  display: flex;
  gap: 0.5rem;
}

.input-row input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.input-row button {
  padding: 0.5rem 0.75rem;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-row button:hover {
  background: #43a047;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 16px;
  font-size: 0.875rem;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #1976d2;
  padding: 0;
  line-height: 1;
}

.remove-btn:hover {
  color: #f44336;
}
</style>
```

## Kryteria Akceptacji

- [ ] Input z przyciskiem "+"
- [ ] Enter lub przecinek dodaje tag
- [ ] Tagi wyświetlane jako chipy z #
- [ ] Przycisk X usuwa tag
- [ ] Brak duplikatów
- [ ] Max 10 tagów (konfigurowalny)
- [ ] v-model binding

## Powiązane Zadania

- [TASK-015: Entry Modal UI](../TASK-015-EntryModalUI/TASK.md)

## Scenariusze Testowe

1. Wpisanie "test" + Enter dodaje #test
2. Wpisanie "#test" + Enter dodaje #test (bez podwójnego #)
3. Dodanie istniejącego tagu nie dodaje duplikatu
4. Kliknięcie X usuwa tag
5. Po 10 tagach nie można dodać więcej

## Notatki

- Tag lowercase i trim
- Usuń # z początku jeśli użytkownik wpisał
- Przecinek jako alternatywa dla Enter
- Reusable component (używany też w GroupModal)
