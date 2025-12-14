# AI Docs Section - Navigation

> AI documentation rules and templates. Main AGENTS.md: [../../AGENTS.md](../../AGENTS.md)

## About this section

This directory contains templates and rules for documentation that AI agents should follow.

## Structure

```
.ai/docs/
└── templates/          # Document templates
    ├── AGENTS.md       # Templates navigation
    ├── EPIC.md
    ├── STORY.md
    ├── TASK.md
    ├── USECASE.md
    ├── BUG.md
    └── ADR.md
```

## Output Location

Generated documentation goes to `docs/`:
- `docs/work/` - EPICs, STORYs, TASKs
- `docs/adr/` - Architecture Decision Records

## Workflow

1. Identify document type needed
2. Copy template from `templates/`
3. Create in appropriate `docs/` location
4. Fill content and link to related docs
5. Update status as work progresses

## Related

- [templates/AGENTS.md](./templates/AGENTS.md) - Available templates
- [../../docs/work/AGENTS.md](../../docs/work/AGENTS.md) - Active work
- [../../docs/adr/AGENTS.md](../../docs/adr/AGENTS.md) - Decisions
