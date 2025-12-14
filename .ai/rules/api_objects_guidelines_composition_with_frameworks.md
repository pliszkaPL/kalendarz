# Technical Documentation: API and UI Objects (Composition over Inheritance)

## Purpose
This document defines rules for designing **objects used in APIs and user interfaces (UI)** such as Blade, Twig, or Vue.js components that:  
1. Are independent from the domain layer.  
2. Can contain nested objects, also independent from the domain.  
3. Can be mapped to domain entities within the service layer.  
4. Support **composition over inheritance**, enabling flexible combination with other objects like Laravel FormObjects.

The goal is to **name objects according to business concepts**, not technical implementation details.  
The only suffixes allowed are **Request** and **Response**, which identify contract objects for APIs or UI views.

This approach should be applied consistently for both **API data objects** and **UI view models**.

---

## Design Principles

### 1. Request / Response Objects
- Each API operation or UI view must have a **Request** and **Response** object.  
- Objects should be **simple and serializable** (JSON, XML, or template-ready).  
- They should **not contain business logic or reference domain entities**.
- Prefer **composition over inheritance**: instead of extending a base class, combine objects to add behavior or validation.

### 2. Nested Objects
- Nested objects are allowed (e.g., `Address` inside `UserRequest`).  
- Nested objects must also remain independent of the domain.
- This enables reusing smaller components in different contexts without inheritance.

### 3. Integration with Laravel FormObjects
- Request objects can be **composed into FormObjects** to leverage Laravel validation and form handling:  
  - Each Request object can be passed to a FormObject for validation.  
  - FormObjects can contain multiple Request objects as properties to handle complex forms.
- This allows **clean separation** of API/UI objects from validation logic.

### 4. Mapping to Domain Entities
- The service layer should provide a **mapper** that converts API or UI objects into domain entities.  
- This ensures the API/UI layers are **isolated from domain logic**.

---

## PHP Example with FormObject Composition

### 1. API / UI Request Objects

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
```

### 2. Laravel FormObject using Composition

```php
<?php

use Illuminate\Foundation\Http\FormRequest;

class UserForm extends FormRequest {
    public UserRequest $userRequest;

    public function __construct(UserRequest $userRequest) {
        $this->userRequest = $userRequest;
    }

    public function rules(): array {
        return [
            'userRequest.name' => 'required|string|max:255',
            'userRequest.address.street' => 'required|string',
            'userRequest.address.city' => 'required|string',
        ];
    }
}
```

### 3. Domain Entities

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

### 4. Mapper: API/UI ↔ Domain

```php
<?php

class UserMapper {

    public static function fromRequest(UserRequest $request): User {
        $address = new Address($request->address->street, $request->address->city);
        return new User(0, $request->name, $address);
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
2. **Use composition over inheritance** to combine objects rather than extending classes.  
3. **Request objects can be composed into FormObjects** in Laravel to leverage validation and form handling.  
4. **Mapper** handles conversion between API/UI objects and domain entities.  
5. Names represent **business concepts**, not technical details.  
6. This pattern applies to both **API contracts** and **UI view models**, ensuring consistency and flexibility.

