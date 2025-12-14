# TASK-014: Search Input Component

## Metadane

- **ID**: `TASK-014`
- **Typ**: `task`
- **Tytuł**: Search Input Component
- **Status**: `new`
- **Story**: [STORY-004: Side Panel](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja pola wyszukiwania z debounce.

**Lokalizacja pliku**: `frontend/src/components/calendar/SearchInput.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/calendar/SearchInput.vue -->
<template>
  <div class="search-wrapper">
    <span class="search-icon">🔍</span>
    <input
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      class="search-input"
      @input="onInput"
    />
    <button
      v-if="modelValue"
      class="clear-btn"
      @click="clear"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Props
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

// Debounce
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 300;

function onInput(event: Event) {
  const target = event.target as HTMLInputElement;
  const value = target.value;

  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Set new timer
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value);
  }, DEBOUNCE_MS);
}

function clear() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  emit('update:modelValue', '');
}
</script>

<style scoped>
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  font-size: 0.875rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 2rem 0.625rem 2.25rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
}

.search-input::placeholder {
  color: #999;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #999;
  cursor: pointer;
  padding: 0 0.25rem;
}

.clear-btn:hover {
  color: #666;
}
</style>
```

## Kryteria Akceptacji

- [ ] Input z ikoną wyszukiwania
- [ ] Placeholder text
- [ ] v-model binding
- [ ] Debounce 300ms
- [ ] Przycisk clear (X) gdy jest wartość
- [ ] Focus styles

## Powiązane Zadania

- [TASK-011: Side Panel Layout](../TASK-011-SidePanelLayout/TASK.md)

## Scenariusze Testowe

1. Wpisanie tekstu emituje update:modelValue po 300ms
2. Szybkie wpisywanie nie emituje przy każdym keystroke
3. Przycisk X czyści pole
4. Focus pokazuje blue border

## Notatki

- Debounce 300ms dla wydajności
- Clear button widoczny tylko gdy modelValue nie jest pusty
- Ikona 🔍 jako span (można zamienić na SVG)
