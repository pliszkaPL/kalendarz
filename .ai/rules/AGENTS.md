# Rules Section - Navigation

> Coding standards and patterns. Main AGENTS.md: [../../AGENTS.md](../../AGENTS.md)

## About this section

Coding rules, conventions, and patterns for AI agents to follow.

## Available Rules

| File | Description |
|------|-------------|
| [commits.md](./commits.md) | Conventional commits format |
| [gitmoji.md](./gitmoji.md) | Gitmoji usage |
| [api_objects_guidelines.md](./api_objects_guidelines.md) | API design patterns |
| [icons-assignment.md](./icons-assignment.md) | Icon usage conventions |
| [vertical-slice-architecture/](./vertical-slice-architecture/) | VSA patterns |
| [tasks-menagement/](./tasks-menagement/) | Task documentation rules |
| [bc_context_mapping_php_examples.md](./bc_context_mapping_php_examples.md) | Bounded Context examples |
| [bdd_cli_command_query_docs.md](./bdd_cli_command_query_docs.md) | BDD patterns |

## Quick Reference

### PHP Rules
- PHP 8.4 with `declare(strict_types=1);`
- PSR-12 coding standard
- PHPStan for static analysis

### Code Patterns
- Prefer interfaces over implementations
- Use DTOs, ValueObjects, Collections
- SRP (Single Responsibility Principle)
- OCP (Open/Closed Principle)

### Commits
- Format: `<type>(<scope>): <subject>`
- Types: feat, fix, docs, style, refactor, test, chore

## Related

- [../git.md](../git.md) - Full git workflow
- [../../AGENTS.md](../../AGENTS.md) - Main rules
