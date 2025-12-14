# VSA Shared Components

This document details the **shared components** in Vertical Slice Architecture (VSA), complementing the main documentation and slice structures.

---

## 1. Application-Wide Shared Components
**Purpose:** Components available to all slices across the application.

**Examples:**
- CommandBus / EventBus
- Logger / Monitoring
- Configuration / Environment settings
- Exception handling mechanisms

**Folder structure example:**
```
src/Shared/App/
├── CommandBus/
│   └── CommandBus.php
├── EventBus/
│   └── EventBus.php
├── Logging/
│   └── Logger.php
└── Config/
    └── AppConfig.php
```

**Usage guidelines:**
- Use application-wide shared components for cross-cutting concerns.
- Avoid including business logic here.
- All slices can reference these components without violating isolation.

---

## 2. Bounded Context Shared Components
**Purpose:** Components shared only within a **Bounded Context (BC)**.

**Examples:**
- Repository interfaces shared across slices in the BC
- Utility classes/helpers relevant only to that BC
- Common DTOs within the BC

**Folder structure example:**
```
src/Shared/BC/{BoundedContextName}/
├── Repositories/
│   └── UserRepositoryInterface.php
├── DTOs/
│   └── UserDto.php
└── Helpers/
    └── UserHelper.php
```

**Usage guidelines:**
- Use BC Shared components only within the BC to maintain slice isolation.
- Do not reference BC Shared components from other BCs.
- Place only truly common code here, not slice-specific logic.

---

## 3. Summary of Shared Levels

| Level                  | Scope                       | Examples                          | Notes |
|------------------------|-----------------------------|----------------------------------|-------|
| Application-Wide Shared| All slices                  | CommandBus, EventBus, Logger     | Cross-cutting concerns, no business logic |
| Bounded Context Shared | Only slices within BC       | Repository interfaces, DTOs      | Reusable inside BC, not outside |

---

## 4. Diagram Overview
Detailed diagrams showing relationships between slices, BC Shared, and App Shared components are in **`VSA_Diagrams_Shared.md`**.

- Shows dependencies from slices → BC Shared → App Shared
- Helps visualize isolation boundaries and shared usage
