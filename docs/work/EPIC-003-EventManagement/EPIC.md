# EPIC-003: Event Management

## Metadata

| Field | Value |
|-------|-------|
| ID | EPIC-003 |
| Bounded Context | EventManagement |
| Status | new |
| Owner | TBD |

## Business Goal

Enable users to create, edit, and manage calendar events. Events use templates for appearance and can be recurring (repeating on multiple dates).

## Description

Events are the core data in the calendar:
- Each event is linked to a template
- Events can have single or multiple dates (recurring)
- Template fields are filled when creating event
- Display in calendar uses template's display_format

## User Stories

| ID | Title | Status |
|----|-------|--------|
| STORY-001 | Create single event | new |
| STORY-002 | Create recurring event | new |
| STORY-003 | Edit event (all occurrences) | new |
| STORY-004 | Delete event | new |
| STORY-005 | Calendar month view | new |
| STORY-006 | Search events | new |

## Technical Requirements

| Layer | Components |
|-------|------------|
| Backend | Event, EventDate models, EventController |
| Frontend | CalendarGrid.vue, EventTile.vue, EventForm.vue |
| Database | events, event_dates tables |

## API Endpoints (Planned)

```
GET    /api/events                    # List with filters
POST   /api/events                    # Create
GET    /api/events/{id}               # Get one
PUT    /api/events/{id}               # Update (all occurrences)
DELETE /api/events/{id}               # Delete
GET    /api/events/search?q=          # Search
GET    /api/calendar/{year}/{month}   # Month view
```

## Event Structure

```json
{
  "id": 1,
  "user_id": 1,
  "template_id": 1,
  "title": "Mom's Birthday",
  "description": "Don't forget the gift!",
  "data": {
    "person_name": "Mom",
    "birth_date": "1960-03-15"
  },
  "dates": ["2025-03-15", "2026-03-15"]
}
```

## Recurring Events

Recurrence options:
- Every X days/weeks/months
- Specific day of week/month
- Manual date selection

For MVP: editing any occurrence updates all.

## Dependencies

- EPIC-001 (UserManagement) - completed
- EPIC-002 (TemplateManagement) - required

## Success Criteria

- [ ] Users can create events with templates
- [ ] Recurring events work
- [ ] Calendar month view displays events
- [ ] Search finds events by content/date
- [ ] Events update when template changes
