<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay entry-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? 'Edytuj wpis' : 'Nowy wpis' }}</h2>
          <button class="modal-close" @click="closeModal" aria-label="Zamknij">×</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-body">
          <!-- Nazwa wpisu -->
          <div class="form-group">
            <label for="entry-name" class="form-label">Nazwa wpisu *</label>
            <input 
              id="entry-name"
              v-model="form.name" 
              type="text" 
              class="form-input"
              placeholder="np. Urodziny Mamy"
              required
            />
          </div>
          
          <!-- Data -->
          <div class="form-group">
            <label for="entry-date" class="form-label">Data *</label>
            <input 
              id="entry-date"
              v-model="form.date" 
              type="date" 
              class="form-input"
              required
            />
          </div>
          
          <!-- Opis (opcjonalny) -->
          <div class="form-group">
            <label for="entry-description" class="form-label">Opis</label>
            <textarea 
              id="entry-description"
              v-model="form.description" 
              class="form-input form-textarea"
              placeholder="Opcjonalny opis..."
              rows="3"
            ></textarea>
          </div>
          
          <!-- Ikona -->
          <div class="form-group">
            <label for="entry-icon" class="form-label">Ikona</label>
            <div class="icon-selector">
              <input 
                id="entry-icon"
                v-model="form.icon" 
                type="text" 
                class="form-input icon-input"
                placeholder="🎂"
                maxlength="2"
              />
              <div class="icon-presets">
                <button 
                  v-for="icon in iconPresets" 
                  :key="icon"
                  type="button"
                  class="icon-preset"
                  :class="{ active: form.icon === icon }"
                  @click="form.icon = icon"
                >
                  {{ icon }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Szablon (opcjonalnie) -->
          <div class="form-group">
            <label for="entry-template" class="form-label">Szablon</label>
            <select 
              id="entry-template"
              v-model="selectedTemplateId" 
              class="form-input"
              @change="applyTemplate"
            >
              <option :value="null">Bez szablonu</option>
              <option 
                v-for="template in templates" 
                :key="template.id"
                :value="template.id"
              >
                {{ template.icon }} {{ template.name }}
              </option>
            </select>
          </div>
          
          <!-- Grupa -->
          <div class="form-group">
            <label for="entry-group" class="form-label">Grupa</label>
            <select 
              id="entry-group"
              v-model="form.groupId" 
              class="form-input"
            >
              <option :value="null">Bez grupy</option>
              <option 
                v-for="group in groups" 
                :key="group.id"
                :value="group.id"
              >
                {{ group.name }}
              </option>
            </select>
          </div>
          
          <!-- Kolory -->
          <div class="form-row">
            <div class="form-group">
              <label for="entry-bg-color" class="form-label">Kolor tła</label>
              <div class="color-input-wrapper">
                <input 
                  id="entry-bg-color"
                  v-model="form.backgroundColor" 
                  type="color" 
                  class="form-input color-input"
                />
                <span class="color-value">{{ form.backgroundColor }}</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="entry-text-color" class="form-label">Kolor tekstu</label>
              <div class="color-input-wrapper">
                <input 
                  id="entry-text-color"
                  v-model="form.textColor" 
                  type="color" 
                  class="form-input color-input"
                />
                <span class="color-value">{{ form.textColor }}</span>
              </div>
            </div>
          </div>
          
          <!-- Podgląd -->
          <div class="form-group">
            <label class="form-label">Podgląd</label>
            <div 
              class="entry-preview"
              :style="{ 
                backgroundColor: form.backgroundColor, 
                color: form.textColor 
              }"
            >
              <span class="entry-preview-icon">{{ form.icon || '📝' }}</span>
              <span class="entry-preview-name">{{ form.name || 'Nazwa wpisu' }}</span>
            </div>
          </div>
          
          <!-- Przyciski -->
          <div class="modal-actions">
            <button 
              v-if="isEditMode"
              type="button" 
              class="btn btn-danger"
              @click="handleDelete"
            >
              Usuń
            </button>
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Anuluj
            </button>
            <button type="submit" class="btn btn-primary">
              {{ isEditMode ? 'Zapisz' : 'Dodaj' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useEntriesStore } from '../../stores/entries'
import { useGroupsStore } from '../../stores/groups'
import { useTemplatesStore } from '../../stores/templates'
import type { Entry } from '../../types'

const props = defineProps<{
  modelValue: boolean
  entry?: Entry | null
  initialDate?: string
  initialTemplateId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': []
  'deleted': []
}>()

const entriesStore = useEntriesStore()
const groupsStore = useGroupsStore()
const templatesStore = useTemplatesStore()

const groups = computed(() => groupsStore.allGroups)
const templates = computed(() => templatesStore.allTemplates)

const isEditMode = computed(() => !!props.entry)

const iconPresets = ['🎂', '💕', '⏰', '🎉', '📅', '⭐', '❤️', '🎁', '🎊', '🔔', '📌', '✨']

const defaultForm = {
  name: '',
  date: '',
  description: '',
  icon: '📝',
  groupId: null as string | null,
  templateId: null as string | null,
  backgroundColor: '#3b82f6',
  textColor: '#ffffff'
}

const form = ref({ ...defaultForm })
const selectedTemplateId = ref<string | null>(null)

// Initialize form
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.entry) {
      // Edit mode
      form.value = {
        name: props.entry.name,
        date: props.entry.date,
        description: props.entry.description || '',
        icon: props.entry.icon,
        groupId: props.entry.groupId || null,
        templateId: props.entry.templateId || null,
        backgroundColor: props.entry.backgroundColor,
        textColor: props.entry.textColor
      }
      selectedTemplateId.value = props.entry.templateId || null
    } else {
      // Create mode
      form.value = { ...defaultForm }
      
      // Set initial date if provided
      if (props.initialDate) {
        form.value.date = props.initialDate
      }
      
      // Apply initial template if provided
      if (props.initialTemplateId) {
        selectedTemplateId.value = props.initialTemplateId
        applyTemplate()
      }
    }
  }
}, { immediate: true })

function applyTemplate() {
  if (!selectedTemplateId.value) {
    form.value.templateId = null
    return
  }
  
  const template = templatesStore.getTemplateById(selectedTemplateId.value)
  if (template) {
    form.value.templateId = template.id
    form.value.icon = template.icon
    form.value.backgroundColor = template.backgroundColor
    form.value.textColor = template.textColor
  }
}

function closeModal() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  // Validation
  if (!form.value.name || !form.value.date) {
    return
  }
  
  if (isEditMode.value && props.entry) {
    // Update existing entry
    entriesStore.updateEntry(props.entry.id, {
      name: form.value.name,
      date: form.value.date,
      description: form.value.description || undefined,
      icon: form.value.icon,
      groupId: form.value.groupId || undefined,
      templateId: form.value.templateId || undefined,
      backgroundColor: form.value.backgroundColor,
      textColor: form.value.textColor
    })
  } else {
    // Create new entry
    entriesStore.addEntry({
      name: form.value.name,
      date: form.value.date,
      description: form.value.description || undefined,
      icon: form.value.icon,
      groupId: form.value.groupId || undefined,
      templateId: form.value.templateId || undefined,
      backgroundColor: form.value.backgroundColor,
      textColor: form.value.textColor,
      tags: [],
      recurrence: null,
      customData: {},
      isArchived: false
    })
  }
  
  emit('saved')
  closeModal()
}

function handleDelete() {
  if (props.entry && confirm('Czy na pewno chcesz usunąć ten wpis?')) {
    entriesStore.deleteEntry(props.entry.id)
    emit('deleted')
    closeModal()
  }
}
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
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.icon-selector {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.icon-input {
  font-size: 1.5rem;
  text-align: center;
}

.icon-presets {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(3rem, 1fr));
  gap: 0.5rem;
}

.icon-preset {
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
}

.icon-preset:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.icon-preset.active {
  background: #3b82f6;
  border-color: #3b82f6;
  transform: scale(1.1);
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 4rem;
  height: 2.5rem;
  padding: 0.25rem;
  cursor: pointer;
}

.color-value {
  font-size: 0.875rem;
  color: #6b7280;
  font-family: monospace;
}

.entry-preview {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.entry-preview-icon {
  font-size: 1.25rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 1rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
  margin-right: auto;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
