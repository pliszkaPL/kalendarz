# VSA Slice Structures

This document details **internal structures of slices** in Vertical Slice Architecture, depending on slice complexity. It complements the main documentation `VSA_Architecture.md`.

---

## 1. Simple Slice
**Characteristics:**
- Single folder containing all code and tests
- Minimal domain logic
- No CQRS / DDD

**Folder structure example:**
```
src/Slices/CreateUser/
├── CreateUser.php            # main slice class or entry point
├── CreateUserService.php     # optional service handling the logic
├── CreateUserTest.php        # slice-specific tests
└── DTOs.php                  # optional data transfer objects
```

**Notes:**
- Simple slices are suitable for CRUD operations with low complexity.
- Tests reside within the same slice folder for easy isolation.

---

## 2. Medium Slice
**Characteristics:**
- Slightly more complex logic
- Optional separation into Domain, Application, Infrastructure layers
- Can optionally adopt CQRS

**Folder structure example:**
```
src/Slices/OrderProcessing/
├── Domain/
│   ├── Entities/
│   │   └── Order.php
│   ├── ValueObjects/
│   │   └── Money.php
│   └── Services/
│       └── PricingService.php
├── Application/
│   ├── Commands/
│   │   └── ProcessOrderCommand.php
│   ├── Queries/
│   │   └── GetOrderQuery.php
│   ├── Handlers/
│   │   ├── ProcessOrderHandler.php
│   │   └── GetOrderHandler.php
│   └── DTOs/
│       └── OrderDto.php
├── Infrastructure/
│   ├── Persistence/
│   │   └── OrderRepository.php
│   └── Services/
│       └── PaymentGatewayAdapter.php
└── Tests/
    ├── Unit/
    │   └── OrderProcessingUnitTest.php
    └── Integration/
        └── OrderProcessingIntegrationTest.php
```

**Notes:**
- Medium slices benefit from clear layering.
- CQRS can be introduced if needed.
- Tests are included inside the slice to ensure isolation.

---

## 3. Complex Slice
**Characteristics:**
- Rich domain logic
- Full DDD / CQRS implementation
- Multiple handlers, events, DTOs, and repositories
- Full separation of layers and responsibilities

**Folder structure example:**
```
src/Slices/PaymentProcessing/
├── Domain/
│   ├── Entities/
│   │   └── Payment.php
│   ├── ValueObjects/
│   │   └── Currency.php
│   ├── Events/
│   │   └── PaymentProcessed.php
│   └── Services/
│       └── FraudCheckService.php
├── Application/
│   ├── Commands/
│   │   └── ProcessPaymentCommand.php
│   ├── Queries/
│   │   └── GetPaymentStatusQuery.php
│   ├── Handlers/
│   │   ├── ProcessPaymentHandler.php
│   │   └── GetPaymentStatusHandler.php
│   ├── DTOs/
│   │   └── PaymentDto.php
│   └── Validators/
│       └── PaymentValidator.php
├── Infrastructure/
│   ├── Persistence/
│   │   └── PaymentRepository.php
│   └── Services/
│       └── PaymentGatewayAdapter.php
└── Tests/
    ├── Unit/
    │   ├── ProcessPaymentHandlerTest.php
    │   └── PaymentValidatorTest.php
    └── Integration/
        └── PaymentProcessingIntegrationTest.php
```

**Notes:**
- Complex slices are suitable for rich business domains.
- Full DDD modeling and CQRS are recommended when read/write operations are complex.
- Tests remain inside the slice to preserve isolation.

---

## 4. Summary
- Slice complexity dictates folder structure and use of patterns.
- Tests should always remain **per-slice**.
- This approach keeps slices modular, maintainable, and independent.
