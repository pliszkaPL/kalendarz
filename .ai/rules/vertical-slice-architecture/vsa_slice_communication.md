# VSA Slice Communication

This document describes **slice-to-slice communication patterns** in Vertical Slice Architecture (VSA), complementing the main documentation.

---

## 1. Communication Principles

1. **Isolation:** Slices should be maximally isolated; direct dependencies should be minimized.
2. **Preferred Communication Mechanisms:**
   - **Repository Interfaces**: when slices share the same data store
   - **API Calls**: for remote slices or microservices
   - **Service Adapters**: for cross-domain or complex operations
3. **Avoid Direct Coupling:** Slices should not directly reference each other’s internal classes.

---

## 2. Communication Approaches

### 2.1 Repository Access
- Use when slices belong to the **same Bounded Context** and share a database.
- Repositories provide an **interface abstraction**; slices interact via contracts, not concrete classes.

**Example:**
```
$orderData = $orderRepository->getOrderById($id);
```

**When to use:**
- Simple data retrieval across slices within the same BC
- Minimal external dependencies

---

### 2.2 API Calls
- Use when slices are **remote services** or microservices.
- Calls should go through **Endpoint Objects / API Clients**.

**Example:**
```
$response = $userApi->getUser($userId);
```

**When to use:**
- Communication between BCs or different microservices
- When slice data cannot be accessed directly

---

### 2.3 Service Adapters
- Use when **complex business logic** requires orchestration across slices.
- Encapsulates the cross-slice workflow and prevents tight coupling.

**Example:**
```
$paymentResult = $paymentServiceAdapter->processPayment($orderDto);
```

**When to use:**
- Complex domain operations spanning multiple slices
- Integration with external systems (payment gateway, messaging bus)

---

## 3. Decision Guidelines

| Communication Method | Scope / Use Case                               | Pros | Cons |
|---------------------|-----------------------------------------------|------|------|
| Repository          | Same BC, shared DB                             | Simple, fast | Tightly coupled to DB schema |
| API Calls           | Remote slices / microservices                 | Decoupled, scalable | Network overhead, latency |
| Service Adapters    | Complex cross-slice logic                     | Encapsulates orchestration | Adds abstraction layer |

---

## 4. Diagram Overview
See `VSA_Diagrams_Communication.md` for ASCII diagrams illustrating:
- Slice-to-slice communication flows
- Use of repositories, APIs, and service adapters
- Isolation boundaries and interaction patterns
