# TASK-019: Group Modal UI

## Metadane

- **ID**: `TASK-019`
- **Typ**: `task`
- **Tytuł**: Group Modal UI
- **Status**: `new`
- **Story**: [STORY-006: Group Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja UI modala do dodawania/edycji grup.

**Lokalizacja pliku**: `frontend/src/components/modals/GroupModal.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/modals/GroupModal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content group-modal">
      <div class="modal-header green-bar">
        <h3 class="modal-title">{{ isEditing ? t('editGroup') : t('addGroup') }}</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- Name -->
          <div class="form-group">
            <label>{{ t('name') }}:</label>
            <input
              v-model="form.name"
              type="text"
              required
              :placeholder="t('namePlaceholder')"
            />
            <span v-if="errors.name" class="error">{{ errors.name }}</span>
          </div>

          <!-- Template/Preset -->
          <div class="form-group">
            <label>{{ t('template') }}:</label>
            <select v-model="form.preset" @change="onPresetChange">
              <option value="birthday">🎂 {{ t('birthday') }}</option>
              <option value="anniversary">💕 {{ t('anniversary') }}</option>
              <option value="holiday">🎉 {{ t('holiday') }}</option>
              <option value="meeting">📅 {{ t('meeting') }}</option>
              <option value="reminder">⏰ {{ t('reminder') }}</option>
              <option value="death">🕊️ {{ t('death') }}</option>
              <option value="custom">📝 {{ t('custom') }}</option>
            </select>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label>{{ t('description') }}:</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>

          <!-- Color -->
          <div class="form-group">
            <label>{{ t('color') }}:</label>
            <input v-model="form.color" type="color" />
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label>{{ t('tags') }}:</label>
            <TagsInput v-model="form.tags" />
          </div>

          <!-- Group Entries Section -->
          <GroupEntriesSection
            v-model="form.entries"
            :group-id="groupId"
          />

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="close">
              {{ t('cancel') }}
            </button>
            <button type="submit" class="save-btn" :disabled="isSubmitting">
              {{ isSubmitting ? t('saving') : t('save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useCalendarStore } from '@/stores/calendar';
import { useGroupsStore } from '@/stores/groups';
import { useEntriesStore } from '@/stores/entries';
import TagsInput from '@/components/common/TagsInput.vue';
import GroupEntriesSection from './GroupEntriesSection.vue';
import type { Group, TemplatePreset } from '@/types';
import { TEMPLATE_PRESETS } from '@/types/template';

// Props
const props = defineProps<{
  groupId?: string | null;
}>();

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', group: Group): void;
}>();

// Stores
const calendarStore = useCalendarStore();
const groupsStore = useGroupsStore();
const entriesStore = useEntriesStore();

// State
const isSubmitting = ref(false);
const errors = reactive<Record<string, string>>({});

const form = reactive({
  name: '',
  preset: 'custom' as TemplatePreset,
  description: '',
  color: '#74b9ff',
  tags: [] as string[],
  entries: [] as { date: string; recurrenceType: string }[]
});

// Computed
const isEditing = computed(() => !!props.groupId);

// i18n
const translations = {
  pl: {
    addGroup: 'Dodaj grupę',
    editGroup: 'Edytuj grupę',
    name: 'Nazwa grupy',
    namePlaceholder: 'Nazwa grupy',
    template: 'Szablon',
    birthday: 'Urodziny',
    anniversary: 'Rocznica',
    holiday: 'Święto',
    meeting: 'Spotkanie',
    reminder: 'Przypomnienie',
    death: 'Pamięć',
    custom: 'Niestandardowy',
    description: 'Opis',
    color: 'Kolor grupy',
    tags: 'Tagi',
    cancel: 'Anuluj',
    save: 'Zapisz wpis',
    saving: 'Zapisywanie...',
    nameRequired: 'Nazwa jest wymagana'
  },
  en: {
    addGroup: 'Add group',
    editGroup: 'Edit group',
    name: 'Group name',
    namePlaceholder: 'Group name',
    template: 'Template',
    birthday: 'Birthday',
    anniversary: 'Anniversary',
    holiday: 'Holiday',
    meeting: 'Meeting',
    reminder: 'Reminder',
    death: 'Memorial',
    custom: 'Custom',
    description: 'Description',
    color: 'Group color',
    tags: 'Tags',
    cancel: 'Cancel',
    save: 'Save group',
    saving: 'Saving...',
    nameRequired: 'Name is required'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function close() {
  emit('close');
}

function onPresetChange() {
  const preset = TEMPLATE_PRESETS[form.preset];
  if (preset) {
    form.color = preset.color;
  }
}

function validate(): boolean {
  errors.name = '';
  if (!form.name.trim()) {
    errors.name = t('nameRequired');
  }
  return !errors.name;
}

async function handleSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;

  try {
    const groupData = {
      name: form.name.trim(),
      color: form.color,
      tags: form.tags,
      description: form.description
    };

    let saved: Group;
    if (isEditing.value && props.groupId) {
      const existing = groupsStore.groups.find(g => g.id === props.groupId);
      saved = await groupsStore.updateGroup({
        ...existing!,
        ...groupData
      });
    } else {
      saved = await groupsStore.addGroup(groupData);
    }

    // Create entries for new group
    for (const entryData of form.entries) {
      await entriesStore.addEntry({
        name: form.name,
        templateId: '', // TODO: get from preset
        date: entryData.date,
        recurrence: entryData.recurrenceType === 'yearly'
          ? { type: 'yearly' }
          : null,
        groupId: saved.id,
        tags: [],
        description: '',
        customData: {},
        isArchived: false
      });
    }

    emit('saved', saved);
    close();
  } finally {
    isSubmitting.value = false;
  }
}

// Keyboard
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);

  if (props.groupId) {
    const group = groupsStore.groups.find(g => g.id === props.groupId);
    if (group) {
      form.name = group.name;
      form.color = group.color;
      form.tags = [...group.tags];
      form.description = group.description;
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Same styles as EntryModal - see TASK-015 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.modal-header.green-bar {
  background: #4caf50;
  color: white;
  border-radius: 8px 8px 0 0;
}

.modal-body {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error {
  color: #f44336;
  font-size: 0.75rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
</style>
```

## Kryteria Akceptacji

- [ ] Modal z formularzem grupy
- [ ] Preset zmienia kolor
- [ ] TagsInput reused z TASK-017
- [ ] GroupEntriesSection dla dodawania wpisów
- [ ] Walidacja nazwy
- [ ] Tryb add/edit

## Powiązane Zadania

- [TASK-017: Tags Input](../../STORY-005-EntryModal/TASK-017-TagsInput/TASK.md)
- [TASK-021: Group Entries Section](../TASK-021-GroupEntries/TASK.md)

## Notatki

- Struktura podobna do EntryModal
- Preset -> kolor (jak template)
- GroupEntriesSection osobny komponent
