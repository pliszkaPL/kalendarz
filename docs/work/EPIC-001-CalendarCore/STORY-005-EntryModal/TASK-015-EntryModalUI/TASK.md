# TASK-015: Entry Modal UI

## Metadane

- **ID**: `TASK-015`
- **Typ**: `task`
- **Tytuł**: Entry Modal UI
- **Status**: `new`
- **Story**: [STORY-005: Entry Modal](../STORY.md)
- **Epic**: [EPIC-001: Calendar Core](../../EPIC.md)
- **Bounded Context**: CalendarManagement
- **Owner**: Frontend Agent

## Opis

Implementacja UI modala do dodawania/edycji wpisów.

**Lokalizacja pliku**: `frontend/src/components/modals/EntryModal.vue`

## Kontrakt (Component)

```vue
<!-- frontend/src/components/modals/EntryModal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content entry-modal">
      <div class="modal-header green-bar">
        <h3 class="modal-title">{{ isEditing ? t('editEntry') : t('addEntry') }}</h3>
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

          <!-- Template -->
          <div class="form-group">
            <label>{{ t('template') }}:</label>
            <select v-model="form.templateId" @change="onTemplateChange">
              <option
                v-for="template in activeTemplates"
                :key="template.id"
                :value="template.id"
              >
                {{ template.icon }} {{ template.name }}
              </option>
            </select>
          </div>

          <!-- Date -->
          <div class="form-group">
            <label>{{ t('date') }}:</label>
            <input v-model="form.date" type="date" required />
            <span v-if="errors.date" class="error">{{ errors.date }}</span>
          </div>

          <!-- Recurrence Type -->
          <div class="form-group">
            <label>{{ t('type') }}:</label>
            <select v-model="form.recurrenceType">
              <option value="exact">{{ t('exactDay') }}</option>
              <option value="yearly">{{ t('yearly') }}</option>
              <option value="custom">{{ t('custom') }}</option>
            </select>
          </div>

          <!-- Recurrence Selector (conditional) -->
          <RecurrenceSelector
            v-if="form.recurrenceType === 'custom'"
            v-model="form.recurrence"
          />

          <!-- Description -->
          <div class="form-group">
            <label>{{ t('description') }}:</label>
            <textarea v-model="form.description" rows="3"></textarea>
          </div>

          <!-- Group -->
          <div class="form-group">
            <label>{{ t('group') }}:</label>
            <select v-model="form.groupId">
              <option value="">{{ t('noGroup') }}</option>
              <option
                v-for="group in groups"
                :key="group.id"
                :value="group.id"
              >
                {{ group.name }}
              </option>
            </select>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label>{{ t('tags') }}:</label>
            <TagsInput v-model="form.tags" />
          </div>

          <!-- Color -->
          <div class="form-group">
            <label>{{ t('color') }}:</label>
            <input v-model="form.color" type="color" />
          </div>

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
import { useEntriesStore } from '@/stores/entries';
import { useGroupsStore } from '@/stores/groups';
import { useTemplatesStore } from '@/stores/templates';
import TagsInput from '@/components/common/TagsInput.vue';
import RecurrenceSelector from '@/components/common/RecurrenceSelector.vue';
import type { Entry, RecurrenceRule } from '@/types';

// Props
const props = defineProps<{
  entryId?: string | null;
  initialDate?: string;
}>();

// Emits
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', entry: Entry): void;
}>();

// Stores
const calendarStore = useCalendarStore();
const entriesStore = useEntriesStore();
const groupsStore = useGroupsStore();
const templatesStore = useTemplatesStore();

// State
const isSubmitting = ref(false);
const errors = reactive<Record<string, string>>({});

const form = reactive({
  name: '',
  templateId: '',
  date: props.initialDate || new Date().toISOString().split('T')[0],
  recurrenceType: 'exact' as 'exact' | 'yearly' | 'custom',
  recurrence: null as RecurrenceRule | null,
  description: '',
  groupId: '',
  tags: [] as string[],
  color: '#74b9ff'
});

// Computed
const isEditing = computed(() => !!props.entryId);
const groups = computed(() => groupsStore.groups);
const activeTemplates = computed(() => templatesStore.activeTemplates);

// i18n
const translations = {
  pl: {
    addEntry: 'Dodaj wpis do kalendarza',
    editEntry: 'Edytuj wpis',
    name: 'Nazwa',
    namePlaceholder: 'Nazwa wpisu',
    template: 'Szablon',
    date: 'Data',
    type: 'Typ',
    exactDay: 'Dokładny dzień',
    yearly: 'Powtarzaj co rok',
    custom: 'Niestandardowe powtarzanie',
    description: 'Opis',
    group: 'Grupy',
    noGroup: 'Brak grupy',
    tags: 'Tagi',
    color: 'Kolor grupy',
    cancel: 'Anuluj',
    save: 'Zapisz wpis',
    saving: 'Zapisywanie...',
    nameRequired: 'Nazwa jest wymagana',
    dateRequired: 'Data jest wymagana'
  },
  en: {
    addEntry: 'Add calendar entry',
    editEntry: 'Edit entry',
    name: 'Name',
    namePlaceholder: 'Entry name',
    template: 'Template',
    date: 'Date',
    type: 'Type',
    exactDay: 'Exact day',
    yearly: 'Repeat yearly',
    custom: 'Custom repeat',
    description: 'Description',
    group: 'Group',
    noGroup: 'No group',
    tags: 'Tags',
    color: 'Group color',
    cancel: 'Cancel',
    save: 'Save entry',
    saving: 'Saving...',
    nameRequired: 'Name is required',
    dateRequired: 'Date is required'
  }
};

function t(key: string) {
  return translations[calendarStore.language][key] || key;
}

// Methods
function close() {
  emit('close');
}

function onTemplateChange() {
  const template = templatesStore.getTemplateById(form.templateId);
  if (template) {
    form.color = template.backgroundColor;
  }
}

function validate(): boolean {
  errors.name = '';
  errors.date = '';

  if (!form.name.trim()) {
    errors.name = t('nameRequired');
  }
  if (!form.date) {
    errors.date = t('dateRequired');
  }

  return !errors.name && !errors.date;
}

async function handleSubmit() {
  if (!validate()) return;

  isSubmitting.value = true;

  try {
    const recurrence: RecurrenceRule | null =
      form.recurrenceType === 'exact'
        ? null
        : form.recurrenceType === 'yearly'
          ? { type: 'yearly' }
          : form.recurrence;

    const entryData = {
      name: form.name.trim(),
      templateId: form.templateId,
      date: form.date,
      recurrence,
      description: form.description,
      groupId: form.groupId || null,
      tags: form.tags,
      customData: {},
      isArchived: false
    };

    let saved: Entry;
    if (isEditing.value && props.entryId) {
      const existing = await entriesStore.entries.find(e => e.id === props.entryId);
      saved = await entriesStore.updateEntry({
        ...existing!,
        ...entryData
      });
    } else {
      saved = await entriesStore.addEntry(entryData);
    }

    emit('saved', saved);
    close();
  } finally {
    isSubmitting.value = false;
  }
}

// Keyboard handler
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close();
  }
}

// Load existing entry for editing
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);

  // Set default template
  if (activeTemplates.value.length > 0 && !form.templateId) {
    form.templateId = activeTemplates.value[0].id;
  }

  // Load existing entry
  if (props.entryId) {
    const entry = entriesStore.entries.find(e => e.id === props.entryId);
    if (entry) {
      form.name = entry.name;
      form.templateId = entry.templateId;
      form.date = entry.date;
      form.description = entry.description;
      form.groupId = entry.groupId || '';
      form.tags = [...entry.tags];

      if (!entry.recurrence) {
        form.recurrenceType = 'exact';
      } else if (entry.recurrence.type === 'yearly') {
        form.recurrenceType = 'yearly';
      } else {
        form.recurrenceType = 'custom';
        form.recurrence = entry.recurrence;
      }
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
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
  border-bottom: 1px solid #eee;
}

.modal-header.green-bar {
  background: #4caf50;
  color: white;
  border-radius: 8px 8px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
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
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4caf50;
}

.form-group .error {
  color: #f44336;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.cancel-btn,
.save-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.cancel-btn {
  background: #f5f5f5;
  border: 1px solid #ddd;
}

.save-btn {
  background: #4caf50;
  border: none;
  color: white;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
```

## Kryteria Akceptacji

- [ ] Modal overlay z kliknięciem poza = zamknięcie
- [ ] Header z tytułem i przyciskiem X
- [ ] Wszystkie pola formularza
- [ ] Walidacja (name, date required)
- [ ] Tryb dodawania i edycji
- [ ] Escape zamyka modal
- [ ] Submit zapisuje do store

## Powiązane Zadania

- [TASK-016: Entry Form Logic](../TASK-016-EntryForm/TASK.md)
- [TASK-017: Tags Input](../TASK-017-TagsInput/TASK.md)
- [TASK-018: Recurrence Selector](../TASK-018-RecurrenceSelector/TASK.md)

## Scenariusze Testowe

1. Otwarcie bez entryId = tryb dodawania
2. Otwarcie z entryId = tryb edycji, pola wypełnione
3. Submit bez nazwy pokazuje błąd
4. Escape zamyka modal
5. Submit dodaje/aktualizuje wpis

## Notatki

- green-bar header zgodnie z mockup
- RecurrenceSelector pokazywany tylko dla type=custom
- Color picker dla niestandardowego koloru
