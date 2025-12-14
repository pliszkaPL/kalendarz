# TASK-031: Filter by Group

## Metadane

- **ID**: `TASK-031`
- **Typ**: `task`
- **Tytuł**: Filter by Group
- **Status**: `new`
- **Story**: [STORY-010: Search & Filter](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

UI do filtrowania wpisów po grupie w panelu bocznym.

**Modyfikacja pliku**: `frontend/src/components/calendar/SidePanel.vue`

## Kontrakt (Component Update)

```vue
<!-- Dodaj do SidePanel.vue -->
<template>
  <!-- ... existing code ... -->

  <!-- Group filter (add to groups-section) -->
  <div class="filter-controls">
    <button
      :class="{ active: selectedGroupId === null }"
      @click="selectedGroupId = null"
    >
      {{ t('allGroups') }}
    </button>
    <button
      v-for="group in groups"
      :key="group.id"
      :class="{ active: selectedGroupId === group.id }"
      :style="{ borderColor: group.color }"
      @click="selectedGroupId = group.id"
    >
      {{ group.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
// Add to existing script
const selectedGroupId = ref<string | null>(null);

const filteredEntries = computed(() => {
  let entries = entriesStore.activeEntries;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const results = searchService.search(entries, searchQuery.value);
    entries = results.map(r => r.entry);
  }

  // Filter by group
  if (selectedGroupId.value) {
    entries = entries.filter(e => e.groupId === selectedGroupId.value);
  }

  return entries;
});
</script>

<style scoped>
.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.filter-controls button {
  padding: 0.25rem 0.5rem;
  border: 2px solid transparent;
  border-radius: 16px;
  background: #f0f0f0;
  font-size: 0.75rem;
  cursor: pointer;
}

.filter-controls button.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.filter-controls button:not(.active):hover {
  background: #e8e8e8;
}
</style>
```

## Kryteria Akceptacji

- [ ] Przyciski filtrów dla każdej grupy
- [ ] "Wszystkie grupy" przycisk
- [ ] Aktywny filtr podświetlony
- [ ] Filtrowanie wpisów w liście
- [ ] Kombinacja z wyszukiwaniem tekstowym

## Powiązane Zadania

- [TASK-011: Side Panel Layout](../../STORY-004-SidePanel/TASK-011-SidePanelLayout/TASK.md)
- [TASK-030: Search Service](../TASK-030-SearchService/TASK.md)

## Scenariusze Testowe

1. Kliknięcie grupy filtruje wpisy
2. Kliknięcie "Wszystkie" pokazuje wszystkie
3. Filtr + search łączą się (AND)
4. Aktywny filtr ma style active

## Notatki

- Filter buttons jako chip buttons
- Kombinacja search + filter = AND logic
- Kolor grupy jako border-color
