# Vertical Slice Architecture (VSA) - Main Documentation

## Overview
This document presents the architecture guidelines for a **hybrid application** using **Vertical Slice Architecture (VSA)**. The approach emphasizes:

- Isolated slices encapsulating **all layers** (Domain, Application, Infrastructure, Tests)
- Framework-agnostic design via **Hexagonal Architecture** (Ports & Adapters)
- Shared components at two levels:
  - **Application-wide Shared**: e.g., CommandBus, EventBus, Logger, Config
  - **Bounded Context Shared**: helpers, repository interfaces, utilities relevant to the BC
- Slice communication via **Repository, API, or Services**
- Flexible slice internal structure depending on **complexity and requirements**
- Tests are **per-slice**, integrated within the slice itself

This main document links to additional detailed documents for diagrams and structural examples.

---

## 1. Key Principles

1. **Isolation**: Slices should be maximally isolated. Shared components should be explicit and used only when necessary.
2. **Framework-Agnostic**: Dependencies on frameworks or libraries must be encapsulated in adapters within the slice.
3. **Flexible Internal Structure**:
   - Simple slice: single folder containing all code and tests
   - Medium slice: structured with folders like Domain, Application, Infrastructure, Tests
   - Complex slice: fully modular with Command/Query/Handler/DTO/Event/Repository layers
4. **Slice Communication**:
   - Prefer repository interfaces for direct data access
   - Use APIs for inter-service communication
   - Use service adapters for cross-domain operations
5. **Tests**: Each slice contains its own unit and integration tests; tests are not centralized.
6. **Architecture Choice per Slice**:
   - Use **CQRS** when operations are complex and read/write separation is beneficial
   - Use **DDD principles** if domain logic is complex and requires rich models
   - Simple CRUD slices can use straightforward layering without CQRS/DDD

---

## 2. Slice Internal Structure Examples

See linked document: **`VSA_Slice_Structures.md`** for detailed diagrams and folder structures for simple, medium, and complex slices.

---

## 3. Shared Components

- **Application-Wide Shared** (accessible to all slices)
  - CommandBus, EventBus, Logger, Config
  - Example location: `src/Shared/App/`
- **Bounded Context Shared** (accessible only within a BC)
  - Repository interfaces, utility helpers
  - Example location: `src/Shared/BC/{BoundedContextName}/`

See linked document: **`VSA_Shared_Components.md`** for diagrams showing dependency boundaries.

---

## 4. Slice Communication

- **Repository Access**: preferred when slices share the same data model
- **API Calls**: preferred for remote slices or microservices
- **Service Adapters**: used for complex cross-domain logic without breaking slice boundaries

See linked document: **`VSA_Slice_Communication.md`** for detailed communication patterns and guidelines.

---

## 5. Diagrams Overview

- Internal slice structure per complexity level
- Shared layers at BC and App levels
- Slice-to-slice communication flows

Detailed diagrams and explanations are in linked documents:
- **`VSA_Diagrams_Internal_Slice.md`**
- **`VSA_Diagrams_Shared.md`**
- **`VSA_Diagrams_Communication.md`**

---

## 6. Summary

Vertical Slice Architecture enables:

- Modular, isolated, and framework-agnostic code
- Clear separation of business concerns per slice
- Reusable shared components where needed
- Testable slices with embedded tests
- Flexible choice of internal architecture (DDD, CQRS, CRUD) per slice complexity

This document is the entry point, with detailed diagrams and examples located in the linked Markdown files.