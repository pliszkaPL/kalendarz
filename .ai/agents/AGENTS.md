# AI Agents Section - Navigation

> Specialist agent profiles. Main AGENTS.md: [../../AGENTS.md](../../AGENTS.md)

## About this section

This directory contains specialist agent profiles. Each agent has specific knowledge and responsibilities.

## Available Agents

| Agent | File | Scope |
|-------|------|-------|
| Backend | [backend.md](./backend.md) | Laravel, API, Database |
| Frontend | [frontend.md](./frontend.md) | Vue.js, Tailwind, Vite |
| DevOps | [devops.md](./devops.md) | Docker, CI/CD, Dokku |
| QA | [qa.md](./qa.md) | Testing, Playwright, PEST |
| Database | [database.md](./database.md) | Schema, Migrations, Queries |
| Fullstack | [fullstack.md](./fullstack.md) | Integration, API contracts |

## When to use agents

1. Complex task in specific domain → use specialist agent
2. Integration across layers → use fullstack agent
3. Testing focus → use QA agent
4. Infrastructure changes → use DevOps agent

## Agent handoff format

When switching agents, pass context:
- Task description
- Related files
- Dependencies
- Testing requirements
