# VSA Documentation Map

This document provides a **visual map of all VSA documentation files** and their relationships for easy navigation.

---

## 1. Main Entry Point
```
VSA_Architecture.md
    |
    +-- Overview of VSA principles
    +-- Links to detailed slices, shared components, and communication
```

## 2. Slice Structures
```
VSA_Slice_Structures.md
    |
    +-- Simple Slice
    +-- Medium Slice
    +-- Complex Slice
    +-- Links to diagrams: VSA_Diagrams_Internal_Slice.md
```

## 3. Shared Components
```
VSA_Shared_Components.md
    |
    +-- Application-Wide Shared Layer
    +-- Bounded Context Shared Layer
    +-- Links to diagrams: VSA_Diagrams_Shared.md
```

## 4. Slice Communication
```
VSA_Slice_Communication.md
    |
    +-- Repository Access (Within BC)
    +-- API Calls (Between BCs or Services)
    +-- Service Adapters (Complex Cross-Slice Logic)
    +-- Links to diagrams: VSA_Diagrams_Communication.md
```

## 5. Diagram Files
```
VSA_Diagrams_Internal_Slice.md
    +-- ASCII diagrams of simple, medium, complex slices

VSA_Diagrams_Shared.md
    +-- ASCII diagrams of App Shared and BC Shared layers

VSA_Diagrams_Communication.md
    +-- ASCII diagrams of slice-to-slice communication patterns
```

---

## 6. Navigation Summary
- **Main entry:** VSA_Architecture.md
- **Details per slice:** VSA_Slice_Structures.md + diagrams
- **Shared components:** VSA_Shared_Components.md + diagrams
- **Communication patterns:** VSA_Slice_Communication.md + diagrams
- Diagram files are referenced from respective detailed documentation
