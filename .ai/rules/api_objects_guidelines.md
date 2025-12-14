# Technical Documentation: API and UI Objects

## Purpose
This document defines rules for designing **objects used in APIs and user interfaces (UI)** such as Blade, Twig, or Vue.js components that:  
1. Are independent from the domain layer.  
2. Can contain nested objects, also independent from the domain.  
3. Can be mapped to domain entities within the service layer.

The goal is to **name objects according to business concepts**, not technical implementation details.  
The only suffixes allowed are **Request** and **Response**, which identify contract objects for APIs or UI views.

This approach should be applied consistently for both **API data objects** and **UI view models**.

---

## Design Principles

### 1. Request / Response Objects
- Each API operation or UI view must have a **Request** and **Response** object.  
- Objects should be **simple and serializable** (JSON, XML, or template-ready).  
- They should **not contain business logic or reference domain entities**.

### 2. Nested Objects
- Nested objects are allowed (e.g., `Address` inside `UserRequest`).  
- Nested objects must also remain independent of the domain.

### 3. Mapping to Domain Entities
- The service layer should provide a **mapper** that converts API or UI objects into domain entities.  
- This ensures the API/UI layers are **isolated from domain logic**.  

---

## PHP Example

### 1. API / UI Request / Response Objects

```php
<?php

class Address {
    public string $street;
    public string $city;
}

class UserRequest {
    public string $name;
    public Address $address;
}

class UserResponse {
    public int $id;
    public string $name;
    public Address $address;
}
```

### 2. Domain Entities

```php
<?php

class Address {
    private string $street;
    private string $city;

    public function __construct(string $street, string $city) {
        if (empty($street) || empty($city)) {
            throw new InvalidArgumentException("Invalid address");
        }
        $this->street = $street;
        $this->city = $city;
    }

    public function getStreet(): string {
        return $this->street;
    }

    public function getCity(): string {
        return $this->city;
    }
}

class User {
    private int $id;
    private string $name;
    private Address $address;

    public function __construct(int $id, string $name, Address $address) {
        $this->id = $id;
        $this->name = $name;
        $this->address = $address;
    }

    public function getId(): int {
        return $this->id;
    }

    public function getName(): string {
        return $this->name;
    }

    public function getAddress(): Address {
        return $this->address;
    }
}
```

### 3. Mapper: API / UI ↔ Domain

```php
<?php

class UserMapper {

    public static function fromRequest(UserRequest $request): User {
        $address = new Address($request->address->street, $request->address->city);
        return new User(0, $request->name, $address); // ID 0 is placeholder before persistence
    }

    public static function toResponse(User $user): UserResponse {
        $address = new Address();
        $address->street = $user->getAddress()->getStreet();
        $address->city = $user->getAddress()->getCity();

        $response = new UserResponse();
        $response->id = $user->getId();
        $response->name = $user->getName();
        $response->address = $address;

        return $response;
    }
}
```

---

## Summary
1. **Request / Response objects** are independent of the domain and may contain nested objects.  
2. **Mapper** handles conversion between API/UI objects and domain entities.  
3. Names represent **business concepts**, not technical details.  
4. This pattern applies to both **API contracts** and **UI view models** (Blade, Twig, Vue.js, etc.), ensuring consistency and flexibility.  
5. API and UI layers remain **decoupled from domain logic**, enabling independent evolution of contracts and business rules.

