# EPIC-002: Template Management

## Metadata

| Field | Value |
|-------|-------|
| ID | EPIC-002 |
| Bounded Context | TemplateManagement |
| Status | new |
| Owner | TBD |

## Business Goal

Enable users to create, edit, and manage templates that define the appearance and logic of calendar entries. This is the core differentiating feature of the application.

## Description

Templates define:
- Visual appearance (icon, colors)
- Custom fields (variables like `{name}`, `{amount}`)
- Display format (how entry appears in calendar)
- Operations (age calculation, days countdown)

Users can create own templates or use 20 predefined ones.

## User Stories

| ID | Title | Status |
|----|-------|--------|
| STORY-001 | Create new template | new |
| STORY-002 | Edit existing template | new |
| STORY-003 | Archive template | new |
| STORY-004 | List and filter templates | new |
| STORY-005 | Live preview in editor | new |
| STORY-006 | Predefined templates seeder | new |

## Technical Requirements

| Layer | Components |
|-------|------------|
| Backend | Template model, TemplateController, migrations |
| Frontend | TemplateEditor.vue, TemplateList.vue |
| Database | templates table (JSON fields) |

## API Endpoints (Planned)

```
GET    /api/templates           # List (user + predefined)
POST   /api/templates           # Create
GET    /api/templates/{id}      # Get one
PUT    /api/templates/{id}      # Update
POST   /api/templates/{id}/archive  # Archive
DELETE /api/templates/{id}      # Delete
```

## Template Structure

```json
{
  "id": 1,
  "user_id": null,
  "name": "Birthday",
  "icon": "cake",
  "background_color": "#FFE4E1",
  "text_color": "#333333",
  "fields": [
    {"name": "person_name", "type": "text"},
    {"name": "birth_date", "type": "date", "operation": "calculate_age"}
  ],
  "display_format": "Birthday {person_name} ({age})",
  "is_archived": false
}
```

## Dependencies

- EPIC-001 (UserManagement) - completed
- Database migrations for templates table

## Success Criteria

- [ ] Users can create custom templates
- [ ] 20 predefined templates available
- [ ] Live preview works in editor
- [ ] Templates can be archived (not deleted)
- [ ] All entries using template update when template changes
