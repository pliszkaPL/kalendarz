# Bounded Context (BC) Context Mapping - PHP 8.4+ Examples

This document provides a comprehensive overview of **Bounded Context interaction patterns** from Domain-Driven Design (DDD) perspective, including **PHP 8.4+ examples** for each type of relationship. It is framework-agnostic and focuses on code-level illustration.

---

## 1. Conformist
```
BC A (Upstream) ---> BC B (Downstream, Conformist)
```
**Description:**
- Downstream BC must conform to upstream model.
- Upstream is authoritative; downstream adapts its own model.

**Key Features:**
- Downstream depends on upstream
- Minimal translation logic in downstream
- Suitable when upstream cannot be changed

**PHP Example:**
```php
// BC B adapting to BC A model
class DownstreamUserService
{
    public function createUserFromUpstream(array $upstreamData): User
    {
        // adapt upstream data to downstream entity
        return new User(
            $upstreamData['id'],
            $upstreamData['email'],
            $upstreamData['name']
        );
    }
}
```

---

## 2. Anticorruption Layer (ACL)
```
BC A (Upstream) ---> ACL ---> BC B (Downstream)
```
**Description:**
- Protects downstream BC from upstream model changes.
- Translates upstream models into downstream domain models.

**PHP Example:**
```php
// ACL translation
class UserAclTranslator
{
    public function translate(UpstreamUserDto $upstreamUser): DownstreamUser
    {
        return new DownstreamUser(
            id: $upstreamUser->getIdentifier(),
            email: $upstreamUser->getEmailAddress(),
            fullName: $upstreamUser->getFullName()
        );
    }
}
```

---

## 3. Shared Kernel
```
BC A <--- Shared Kernel ---> BC B
```
**Description:**
- Shared subset of domain code/components
- Coordinated changes between BC teams

**Key Features:**
- Shared entities, value objects, or interfaces
- Avoid duplication across BCs

**PHP Example:**
```php
// Shared Kernel Entity
namespace SharedKernel\Domain;

class Money
{
    public function __construct(
        public readonly float $amount,
        public readonly string $currency
    ) {}

    public function add(Money $other): Money
    {
        if ($this->currency !== $other->currency) {
            throw new \InvalidArgumentException('Currency mismatch');
        }
        return new Money($this->amount + $other->amount, $this->currency);
    }
}
```

---

## 4. Customer-Supplier
```
BC A (Supplier) ---> BC B (Customer)
```
**Description:**
- Supplier defines model and service contract
- Customer requests features or changes

**PHP Example:**
```php
// Supplier BC
class OrderSupplierService
{
    public function provideOrder(int $orderId): OrderDto
    {
        return new OrderDto($orderId, 'pending');
    }
}

// Customer BC
class OrderConsumerService
{
    public function getOrderStatus(int $orderId, OrderSupplierService $supplier): string
    {
        $order = $supplier->provideOrder($orderId);
        return $order->status;
    }
}
```

---

## 5. Partnership
```
BC A <--> BC B (Partnership)
```
**Description:**
- BCs jointly own shared domain concepts
- Equal collaboration required

**PHP Example:**
```php
// Shared partnership interface
interface InventoryManagement
{
    public function reserveStock(string $sku, int $quantity): void;
}

// BC A implementation
class InventoryA implements InventoryManagement
{
    public function reserveStock(string $sku, int $quantity): void
    {
        // implementation details for BC A
    }
}

// BC B implementation
class InventoryB implements InventoryManagement
{
    public function reserveStock(string $sku, int $quantity): void
    {
        // implementation details for BC B
    }
}
```

---

## 6. Open Host Service / Published Language
```
BC A (Publisher) ---> BC B (Consumer)
```
**Description:**
- BC exposes stable services/interfaces for consumption
- Consumers use contracts without knowing internal details

**PHP Example:**
```php
// Publisher BC
class PaymentServicePublisher
{
    public function processPayment(PaymentRequestDto $request): PaymentResponseDto
    {
        // business logic
        return new PaymentResponseDto($request->amount, 'success');
    }
}

// Consumer BC
class PaymentConsumer
{
    public function pay(PaymentServicePublisher $publisher): void
    {
        $request = new PaymentRequestDto(100);
        $response = $publisher->processPayment($request);
        echo $response->status;
    }
}
```

---

## 7. Combined ASCII Context Map
```
          +------------------+        +------------------+
          |     BC A         |<-----> |      BC B        |
          +------------------+        +------------------+
           | Conformist               | Partnership
           | ACL                       |
           v                           v
        BC B Downstream             BC B Partner
           | Customer-Supplier       | Open Host Service
           v                           v
        Consumers / Clients
```
**Description:**
- Shows multiple interaction types between BCs.
- Conformist and ACL for downstream adaptation.
- Shared kernel/partnership for joint ownership.
- Customer-supplier for supplier-client relationships.
- Open host service for decoupled API integration.

---

## 8. Summary Table
| Pattern | Direction | Key Features | PHP Example |
|---------|-----------|--------------|-------------|
| Conformist | Upstream -> Downstream | Downstream adapts to upstream | DownstreamUserService::createUserFromUpstream |
| ACL | Upstream -> Downstream | Translation layer, preserves downstream integrity | UserAclTranslator::translate |
| Shared Kernel | BC <-> BC | Shared code/components, coordinated changes | SharedKernel\Money |
| Customer-Supplier | Supplier -> Customer | Supplier authoritative, customer requests changes | OrderSupplierService / OrderConsumerService |
| Partnership | BC <-> BC | Joint ownership, collaboration | InventoryManagement interface |
| Open Host Service | Publisher -> Consumer | Stable contracts/interfaces, decoupled | PaymentServicePublisher / PaymentConsumer |


