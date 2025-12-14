# Templates Section - Navigation

> Documentation templates for tasks. Main AGENTS.md: [../../../AGENTS.md](../../../AGENTS.md)

## About this section

Templates for creating work documentation. Copy and fill when creating new items.

## Available Templates

| Template | When to use | Output location |
|----------|-------------|-----------------|
| [EPIC.md](./EPIC.md) | Large business initiative (2-6 weeks) | `docs/work/EPIC-XXX-Name/` |
| [STORY.md](./STORY.md) | User-facing feature (3-7 days) | `docs/work/.../STORY-XXX-Name/` |
| [TASK.md](./TASK.md) | Technical implementation (1-2 days) | `docs/work/.../TASK-XXX.md` |
| [USECASE.md](./USECASE.md) | Test scenario | `docs/work/.../USECASE-XXX.md` |
| [BUG.md](./BUG.md) | Bug report | `docs/work/BUG-XXX.md` |
| [ADR.md](./ADR.md) | Architecture decision | `docs/adr/ADR-XXX.md` |

## Hierarchy

```
EPIC (business goal)
└── STORY (user feature)
    └── TASK (implementation)
        └── USECASE (test scenario)

BUG → TASK (fix)
```

## Naming Convention

- `EPIC-XXX-Name/EPIC.md`
- `STORY-XXX-Name/STORY.md`
- `TASK-XXX-description.md`
- `USECASE-XXX-scenario.md`
- `BUG-XXX-description.md`
- `ADR-XXX-decision.md`

## Status Values

| Status | Meaning |
|--------|---------|
| new | Not started |
| in-progress | Currently working |
| implemented | Code complete |
| verified | Tests passed |
| deprecated | No longer needed |
| superseded | Replaced by newer |

## Quick Start

1. Identify item type (EPIC/STORY/TASK/BUG)
2. Copy appropriate template
3. Create in `docs/work/` or `docs/adr/`
4. Fill metadata and description
5. Link to parent/children
6. Update status as you work

## Related

- [docs/work/AGENTS.md](../../../docs/work/AGENTS.md) - Active work items
- [docs/adr/AGENTS.md](../../../docs/adr/AGENTS.md) - Architecture decisions
