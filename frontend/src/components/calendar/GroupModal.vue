<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay group-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">{{ isEditMode ? 'Edytuj grupę' : 'Nowa grupa' }}</h2>
          <button class="modal-close" @click="closeModal" aria-label="Zamknij">×</button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="modal-body">
          <!-- Nazwa grupy -->
          <div class="form-group">
            <label for="group-name" class="form-label">Nazwa grupy *</label>
            <input 
              id="group-name"
              v-model="form.name" 
              type="text" 
              class="form-input"
              placeholder="np. Rodzina"
              required
            />
          </div>
          
          <!-- Kolor -->
          <div class="form-group">
            <label for="group-color" class="form-label">Kolor</label>
            <div class="color-input-wrapper">
              <input 
                id="group-color"
                v-model="form.color" 
                type="color" 
                class="form-input color-input"
              />
              <span class="color-value">{{ form.color }}</span>
            </div>
            <div class="color-presets">
              <button
                v-for="color in colorPresets"
                :key="color"
                type="button"
                class="color-preset"
                :class="{ active: form.color === color }"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
                :aria-label="`Wybierz kolor ${color}`"
              ></button>
            </div>
          </div>
          
          <!-- Podgląd -->
          <div class="form-group">
            <label class="form-label">Podgląd</label>
            <div 
              class="group-preview"
              :style="{ borderLeftColor: form.color }"
            >
              <span class="group-preview-name">{{ form.name || 'Nazwa grupy' }}</span>
              <span class="group-preview-count">0</span>
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
import { useGroupsStore } from '../../stores/groups'
import type { Group } from '../../types'

const props = defineProps<{
  modelValue: boolean
  group?: Group | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'saved': []
  'deleted': []
}>()

const groupsStore = useGroupsStore()

const isEditMode = computed(() => !!props.group)

const colorPresets = [
  '#ff6b6b', // red
  '#4ecdc4', // teal
  '#45b7d1', // blue
  '#96ceb4', // green
  '#ffeaa7', // yellow
  '#dfe6e9', // gray
  '#fd79a8', // pink
  '#a29bfe', // purple
  '#fab1a0', // peach
  '#74b9ff'  // light blue
]

const defaultForm = {
  name: '',
  color: '#4ecdc4'
}

const form = ref({ ...defaultForm })

// Initialize form
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.group) {
      // Edit mode
      form.value = {
        name: props.group.name,
        color: props.group.color
      }
    } else {
      // Create mode
      form.value = { ...defaultForm }
    }
  }
}, { immediate: true })

function closeModal() {
  emit('update:modelValue', false)
}

function handleSubmit() {
  // Validation
  if (!form.value.name) {
    return
  }
  
  if (isEditMode.value && props.group) {
    // Update existing group
    groupsStore.updateGroup(props.group.id, {
      name: form.value.name,
      color: form.value.color
    })
  } else {
    // Create new group
    groupsStore.addGroup({
      name: form.value.name,
      color: form.value.color,
      tags: [],
      description: ''
    })
  }
  
  emit('saved')
  closeModal()
}

function handleDelete() {
  if (props.group && confirm('Czy na pewno chcesz usunąć tę grupę? Wpisy przypisane do niej nie zostaną usunięte.')) {
    groupsStore.deleteGroup(props.group.id)
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
  max-width: 500px;
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

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
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

.color-presets {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 0.5rem;
}

.color-preset {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid #e5e7eb;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.color-preset:hover {
  border-color: #d1d5db;
  transform: scale(1.1);
}

.color-preset.active {
  border-color: #3b82f6;
  transform: scale(1.15);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.group-preview {
  padding: 0.75rem 1rem;
  border-left: 3px solid;
  background: #f9fafb;
  border-radius: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-preview-name {
  font-weight: 500;
  color: #374151;
}

.group-preview-count {
  font-size: 0.875rem;
  color: #6b7280;
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
</style>
