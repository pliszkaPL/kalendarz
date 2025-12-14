# VSA Diagrams - Slice Communication

This document provides **ASCII diagrams** illustrating slice-to-slice communication patterns in Vertical Slice Architecture (VSA), complementing `VSA_Slice_Communication.md`.

---

## 1. Repository Access (Within BC)
```
Slice A       Slice B
  |             |
  |             |
  v             v
+-------------------+
|  BC Shared Repo   |
|  Interface        |
+-------------------+
       ^       ^
       |       |
   Slice A  Slice B
   calls    calls
```
**Description:**
- Slices in the same Bounded Context share repository interfaces.
- Allows data access without tight coupling.
- Suitable for slices using the same DB.

---

## 2. API Calls (Between BCs or Services)
```
Slice A (BC1) ---> HTTP/REST ---> Slice B (BC2)
                 <--- Response ----
```
**Description:**
- Communication between slices in different BCs or microservices.
- Decouples slices and enforces explicit contracts.
- Use endpoint objects or API clients in the slice.

---

## 3. Service Adapters (Complex Cross-Slice Logic)
```
Slice A       Slice B       Slice C
  |             |             |
  |             |             |
  +---> PaymentServiceAdapter <---+
               |                  
               v                  
           External System (e.g., Payment Gateway)
```
**Description:**
- Encapsulates cross-slice operations.
- Prevents tight coupling between slices.
- Suitable for orchestrating complex business workflows.

---

## 4. Combined Communication Overview
```
           +------------------+
           | App Shared Layer  |
           +------------------+
                   ^
                   |
       +-----------+-----------+
       |                       |
   BC1 Shared               BC2 Shared
       |                       |
   +-------+               +-------+
   |Slice A|               |Slice B|
   +-------+               +-------+
       |                       |
   Repository              API/Service
       |                       |
       v                       v
   Data Store             External System
```
**Description:**
- Shows both internal (repository) and external (API/service) communication.
- Maintains slice isolation while enabling interaction.


