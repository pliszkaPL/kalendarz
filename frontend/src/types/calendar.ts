/**
 * Typy podstawowe dla kalendarza
 * TASK-001: Core Interfaces (Entry, Group)
 */

import type { RecurrenceRule } from './recurrence'

/**
 * Wpis w kalendarzu
 */
export interface Entry {
  /** Unikalny identyfikator (UUID) */
  id: string
  /** Nazwa wpisu */
  name: string
  /** Data wpisu w formacie ISO (YYYY-MM-DD) */
  date: string
  /** Ikona wpisu (emoji) */
  icon: string
  /** Kolor tła wpisu (hex, np. #ff6b6b) */
  backgroundColor: string
  /** Kolor tekstu wpisu (hex, np. #ffffff) */
  textColor: string
  /** ID szablonu używanego przez wpis */
  templateId?: string
  /** ID grupy (null jeśli bez grupy) */
  groupId?: string | null
  /** Lista tagów */
  tags?: string[]
  /** Opis wpisu */
  description?: string
  /** Reguła powtarzania (null dla pojedynczych wpisów) */
  recurrence?: RecurrenceRule | null
  /** Dane niestandardowe dla zmiennych szablonu */
  customData?: Record<string, unknown>
  /** Czy wpis jest zarchiwizowany */
  isArchived?: boolean
  /** Data utworzenia */
  createdAt: string
  /** Data ostatniej modyfikacji */
  updatedAt: string
}

/**
 * Grupa wpisów
 */
export interface Group {
  /** Unikalny identyfikator (UUID) */
  id: string
  /** Nazwa grupy */
  name: string
  /** Kolor grupy (hex, np. #ff6b6b) */
  color: string
  /** Lista tagów grupy */
  tags: string[]
  /** Opis grupy */
  description: string
  /** Data utworzenia */
  createdAt: string
  /** Data ostatniej modyfikacji */
  updatedAt: string
}

/**
 * Typ dla tworzenia nowego wpisu (bez pól generowanych automatycznie)
 */
export type CreateEntryInput = Omit<Entry, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Typ dla tworzenia nowej grupy
 */
export type CreateGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt'>
