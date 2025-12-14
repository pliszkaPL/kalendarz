# VSA Diagrams - Shared Components

This document provides **ASCII diagrams** visualizing the shared components in Vertical Slice Architecture (VSA), complementing `VSA_Shared_Components.md`.

---

## 1. Application-Wide Shared Components
```
          +-------------------+
          |  App Shared Layer  |
          |-------------------|
          | CommandBus        |
          | EventBus          |
          | Logger            |
          | Config            |
          +-------------------+
                   ^
                   |
             Used by all
             slices across
             the application
```
**Description:**
- Components accessible by all slices.
- Cross-cutting concerns, no business logic.

---

## 2. Bounded Context Shared Components
```
   +----------------------------------+
   | BC Shared Layer ({BC Name})      |
   |----------------------------------|
   | Repository Interfaces           |
   | Common DTOs                     |
   | Helper Utilities                |
   +----------------------------------+
               ^
               |
       Used only by slices
       within this BC
```
**Description:**
- Components shared only within a Bounded Context.
- Helps reduce duplication between slices of the same BC.
- Maintains isolation between different BCs.

---

## 3. Combined View
```
       +-------------------+        +-------------------+
       |  App Shared Layer  |<-------| All Slices         |
       +-------------------+        +-------------------+
                 ^                             ^
                 |                             |
       +------------------------+      +------------------------+
       | BC Shared Layer (BC1)  |<-----| Slices in BC1          |
       +------------------------+      +------------------------+
       +------------------------+      +------------------------+
       | BC Shared Layer (BC2)  |<-----| Slices in BC2          |
       +------------------------+      +------------------------+
```
**Description:**
- Shows hierarchy of shared layers.
- App Shared is accessible to all slices.
- BC Shared is restricted to slices in that BC.
