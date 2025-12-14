/**
 * Typy dla systemu szablonów
 * TASK-002: Template Types
 */

/**
 * Typ operacji szablonu
 */
export type TemplateOperationType =
  | 'insertText'
  | 'calculateAge'
  | 'daysUntil'
  | 'daysSince'
  | 'formatDate'

/**
 * Typ pola szablonu
 */
export type TemplateFieldType = 'text' | 'date' | 'number' | 'select'

/**
 * Predefiniowany typ szablonu (ikona + domyślne kolory)
 */
export type TemplatePreset =
  | 'birthday'
  | 'anniversary'
  | 'holiday'
  | 'meeting'
  | 'reminder'
  | 'death'
  | 'custom'

/**
 * Pole szablonu (zmienna)
 */
export interface TemplateField {
  /** Nazwa pola (używana w displayFormat jako {nazwa}) */
  name: string
  /** Etykieta wyświetlana w formularzu */
  label: string
  /** Typ pola */
  type: TemplateFieldType
  /** Czy pole jest wymagane */
  required: boolean
  /** Wartość domyślna */
  defaultValue?: string | number
  /** Opcje dla pola typu 'select' */
  options?: string[]
}

/**
 * Operacja szablonu (logika)
 */
export interface TemplateOperation {
  /** Typ operacji */
  type: TemplateOperationType
  /** Nazwa pola źródłowego */
  sourceField: string
  /** Nazwa zmiennej wynikowej (używana w displayFormat) */
  outputVariable: string
  /** Dodatkowe parametry operacji */
  params?: Record<string, unknown>
}

/**
 * Szablon wpisu
 */
export interface Template {
  /** Unikalny identyfikator (UUID) */
  id: string
  /** Nazwa szablonu */
  name: string
  /** Preset (definiuje ikonę) */
  preset: TemplatePreset
  /** Ikona (emoji lub URL) */
  icon: string
  /** Kolor tła */
  backgroundColor: string
  /** Kolor tekstu */
  textColor: string
  /** Pola (zmienne) szablonu */
  fields: TemplateField[]
  /** Format wyświetlania (np. "Urodziny {imie} ({wiek})") */
  displayFormat: string
  /** Operacje logiczne */
  operations: TemplateOperation[]
  /** Czy szablon jest zarchiwizowany */
  isArchived: boolean
  /** Czy to szablon systemowy (predefiniowany) */
  isSystem: boolean
  /** ID użytkownika (null dla systemowych) */
  userId: string | null
  /** Data utworzenia */
  createdAt: string
  /** Data ostatniej modyfikacji */
  updatedAt: string
}

/**
 * Predefiniowane szablony (konfiguracja)
 */
export const TEMPLATE_PRESETS: Record<TemplatePreset, { icon: string; color: string }> = {
  birthday: { icon: '🎂', color: '#ff6b6b' },
  anniversary: { icon: '💕', color: '#ff69b4' },
  holiday: { icon: '🎉', color: '#45b7d1' },
  meeting: { icon: '📅', color: '#96ceb4' },
  reminder: { icon: '⏰', color: '#ffeaa7' },
  death: { icon: '🕊️', color: '#636e72' },
  custom: { icon: '📝', color: '#74b9ff' }
}
