# VSA Diagrams - Internal Slice Structure

This document provides **ASCII diagrams** showing internal structures of slices at different complexity levels. It complements `VSA_Slice_Structures.md`.

---

## 1. Simple Slice
```
SimpleSlice/
├── CreateUser.php
├── CreateUserService.php
├── CreateUserTest.php
└── DTOs.php
```
**Description:**
- Single folder contains all code and tests.
- Minimal domain logic.
- Suitable for CRUD operations.

---

## 2. Medium Slice
```
MediumSlice/
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
**Description:**
- Clear separation of Domain, Application, Infrastructure, and Tests.
- Optional CQRS with Commands and Queries.
- Tests remain inside the slice to preserve isolation.

---

## 3. Complex Slice
```
ComplexSlice/
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
**Description:**
- Rich domain logic with full DDD and CQRS.
- Multiple handlers, events, DTOs, repositories, and validators.
- Tests fully integrated within the slice.
