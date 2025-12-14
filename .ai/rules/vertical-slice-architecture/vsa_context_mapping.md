# VSA Context Mapping Between Bounded Contexts

This document provides an overview of **Bounded Context (BC) interaction patterns** in Vertical Slice Architecture (VSA), inspired by DDD Context Mapping. It outlines how BCs can be connected, the key features of each approach, and guidance on usage.

---

## 1. Conformist
```
BC A (Upstream) ---> BC B (Downstream, Conformist)
```
**Description:**
- The downstream BC (Conformist) has **no influence over upstream BC models**.
- Downstream **adapts its own model to conform** to the upstream BC.

**Key Features:**
- Downstream BC depends on upstream BC
- Minimal modeling in downstream BC to match upstream
- Suitable when **upstream BC is authoritative** and cannot be changed

**Use Cases:**
- Integrating with third-party services
- Legacy systems where upstream model cannot be modified

---

## 2. Anticorruption Layer (ACL)
```
BC A (Upstream) ---> ACL ---> BC B (Downstream)
```
**Description:**
- The downstream BC is **shielded from upstream BC changes**.
- ACL translates between upstream and downstream models, preventing pollution of the downstream domain.

**Key Features:**
- Decouples BCs while allowing interaction
- Provides transformation/adaptation layer
- Ensures downstream domain integrity

**Use Cases:**
- Integrating with foreign models or external systems
- Preserving domain integrity in downstream BCs

---

## 3. Shared Kernel
```
BC A <--- Shared Kernel ---> BC B
```
**Description:**
- BCs **share a subset of the domain model**, carefully maintained collaboratively.

**Key Features:**
- Shared code/components between BCs
- Requires **coordination between teams** for changes
- Reduces duplication for commonly used abstractions

**Use Cases:**
- Multiple BCs rely on common concepts (e.g., Customer, Product)
- Tight collaboration between teams managing shared kernel

---

## 4. Customer-Supplier
```
BC A (Supplier) ---> BC B (Customer)
```
**Description:**
- Supplier BC defines the model and functionality
- Customer BC depends on supplier contract and may request changes

**Key Features:**
- Supplier BC is authoritative
- Customer BC negotiates changes with supplier
- Clear dependency direction

**Use Cases:**
- External APIs or services where one team supplies functionality to another
- Internal BCs with well-defined service boundaries

---

## 5. Partnership
```
BC A <--> BC B (Partnership)
```
**Description:**
- BCs collaborate as **equals**, jointly owning shared concepts.

**Key Features:**
- High level of collaboration and coordination
- Shared decision-making for domain models
- Changes require mutual agreement

**Use Cases:**
- Co-dependent domains with overlapping responsibilities
- Strong collaboration between teams

---

## 6. Open Host Service / Published Language
```
BC A (Publisher) ---> BC B (Consumer)
```
**Description:**
- BC exposes services in a **stable, well-documented format** (Published Language)
- Consumers can integrate without depending on internal models

**Key Features:**
- Well-defined interfaces or contracts
- Decouples internal models from consumers
- Stable, backward-compatible API recommended

**Use Cases:**
- Microservices architecture with multiple consumers
- Event-driven systems and public APIs

---

## 7. Summary Table
| Approach | Direction | Key Features | Use Cases |
|----------|-----------|--------------|-----------|
| Conformist | Upstream -> Downstream | Downstream conforms to upstream | Legacy systems, third-party services |
| Anticorruption Layer | Upstream -> ACL -> Downstream | Translation layer, preserves downstream integrity | External systems, foreign models |
| Shared Kernel | BC <-> BC | Shared code/components, coordinated changes | Common domain concepts across BCs |
| Customer-Supplier | Supplier -> Customer | Supplier authoritative, customer requests changes | Internal APIs, service contracts |
| Partnership | BC <-> BC | Equal collaboration, shared ownership | Co-dependent domains |
| Open Host Service / Published Language | Publisher -> Consumer | Stable contracts/interfaces, decoupled | Microservices, event-driven systems |
