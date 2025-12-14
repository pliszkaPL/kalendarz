/**
 * Seed data for development/testing
 * Initializes localStorage with sample entries and groups
 */

import { useEntriesStore } from '../stores/entries'
import { useGroupsStore } from '../stores/groups'
import { useTemplatesStore } from '../stores/templates'

export function seedData() {
  const entriesStore = useEntriesStore()
  const groupsStore = useGroupsStore()
  const templatesStore = useTemplatesStore()
  
  // Check if already seeded
  if (entriesStore.allEntries.length > 0) {
    console.log('Data already seeded, skipping...')
    return
  }
  
  console.log('Seeding data...')
  
  // Get template IDs
  const templates = templatesStore.allTemplates
  const birthdayTemplate = templates.find(t => t.preset === 'birthday')
  const anniversaryTemplate = templates.find(t => t.preset === 'anniversary')
  const reminderTemplate = templates.find(t => t.preset === 'reminder')
  
  if (!birthdayTemplate || !anniversaryTemplate || !reminderTemplate) {
    console.error('Templates not found!')
    return
  }
  
  // Create groups
  const familyGroup = groupsStore.addGroup({
    name: 'Rodzina',
    color: '#ff6b6b',
    tags: ['osobiste', 'rodzina'],
    description: 'Wydarzenia rodzinne'
  })
  
  const workGroup = groupsStore.addGroup({
    name: 'Praca',
    color: '#4ecdc4',
    tags: ['praca', 'zawodowe'],
    description: 'Wydarzenia związane z pracą'
  })
  
  const friendsGroup = groupsStore.addGroup({
    name: 'Przyjaciele',
    color: '#95e1d3',
    tags: ['towarzyskie', 'znajomi'],
    description: 'Wydarzenia towarzyskie'
  })
  
  // Get current date
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  
  // Helper to create date string
  const createDate = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const dayStr = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }
  
  // Add sample entries
  
  // Birthdays
  entriesStore.addEntry({
    name: 'Urodziny Mamy',
    date: createDate(15),
    icon: birthdayTemplate.icon,
    backgroundColor: birthdayTemplate.backgroundColor,
    textColor: birthdayTemplate.textColor,
    templateId: birthdayTemplate.id,
    groupId: familyGroup.id,
    tags: ['urodziny', 'ważne'],
    description: 'Urodziny mamy - pamiętać o prezencie!',
    recurrence: { type: 'yearly' },
    customData: {
      imie: 'Mama',
      rok_urodzenia: 1965
    },
    isArchived: false
  })
  
  entriesStore.addEntry({
    name: 'Urodziny Jana',
    date: createDate(22),
    icon: birthdayTemplate.icon,
    backgroundColor: birthdayTemplate.backgroundColor,
    textColor: birthdayTemplate.textColor,
    templateId: birthdayTemplate.id,
    groupId: friendsGroup.id,
    tags: ['urodziny'],
    description: 'Urodziny Jana - spotkanie o 18:00',
    recurrence: { type: 'yearly' },
    customData: {
      imie: 'Jan',
      rok_urodzenia: 1990
    },
    isArchived: false
  })
  
  entriesStore.addEntry({
    name: 'Urodziny Asi',
    date: createDate(8, 1), // next month
    icon: birthdayTemplate.icon,
    backgroundColor: birthdayTemplate.backgroundColor,
    textColor: birthdayTemplate.textColor,
    templateId: birthdayTemplate.id,
    groupId: friendsGroup.id,
    tags: ['urodziny'],
    description: '',
    recurrence: { type: 'yearly' },
    customData: {
      imie: 'Asia',
      rok_urodzenia: 1995
    },
    isArchived: false
  })
  
  // Anniversaries
  entriesStore.addEntry({
    name: 'Rocznica ślubu',
    date: createDate(10),
    icon: anniversaryTemplate.icon,
    backgroundColor: anniversaryTemplate.backgroundColor,
    textColor: anniversaryTemplate.textColor,
    templateId: anniversaryTemplate.id,
    groupId: familyGroup.id,
    tags: ['rocznica', 'ważne'],
    description: 'Nasza 10. rocznica ślubu',
    recurrence: { type: 'yearly' },
    customData: {
      wydarzenie: 'Rocznica ślubu'
    },
    isArchived: false
  })
  
  // Reminders
  entriesStore.addEntry({
    name: 'Spotkanie zespołu',
    date: createDate(18),
    icon: reminderTemplate.icon,
    backgroundColor: reminderTemplate.backgroundColor,
    textColor: reminderTemplate.textColor,
    templateId: reminderTemplate.id,
    groupId: workGroup.id,
    tags: ['praca', 'spotkanie'],
    description: 'Cotygodniowe spotkanie zespołu o 10:00',
    recurrence: null,
    customData: {
      opis: 'Spotkanie zespołu'
    },
    isArchived: false
  })
  
  entriesStore.addEntry({
    name: 'Wizyta u dentysty',
    date: createDate(25),
    icon: reminderTemplate.icon,
    backgroundColor: reminderTemplate.backgroundColor,
    textColor: reminderTemplate.textColor,
    templateId: reminderTemplate.id,
    groupId: null,
    tags: ['zdrowie'],
    description: 'Kontrola u dentysty - dr Kowalski, 15:00',
    recurrence: null,
    customData: {
      opis: 'Wizyta u dentysty'
    },
    isArchived: false
  })
  
  entriesStore.addEntry({
    name: 'Płatność rachunków',
    date: createDate(1, 1), // next month
    icon: reminderTemplate.icon,
    backgroundColor: reminderTemplate.backgroundColor,
    textColor: reminderTemplate.textColor,
    templateId: reminderTemplate.id,
    groupId: null,
    tags: ['finanse', 'ważne'],
    description: 'Opłacić rachunki za prąd i internet',
    recurrence: {
      type: 'custom',
      interval: 1,
      unit: 'month'
    },
    customData: {
      opis: 'Płatność rachunków'
    },
    isArchived: false
  })
  
  entriesStore.addEntry({
    name: 'Dzień Dziecka',
    date: createDate(1, 5), // June 1st
    icon: reminderTemplate.icon,
    backgroundColor: reminderTemplate.backgroundColor,
    textColor: reminderTemplate.textColor,
    templateId: reminderTemplate.id,
    groupId: familyGroup.id,
    tags: ['święto'],
    description: 'Święto dzieci',
    recurrence: { type: 'yearly' },
    customData: {
      opis: 'Dzień Dziecka'
    },
    isArchived: false
  })
  
  console.log('Data seeded successfully!')
  console.log(`Created ${groupsStore.allGroups.length} groups`)
  console.log(`Created ${entriesStore.allEntries.length} entries`)
}
