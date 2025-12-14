# BDD Testing Process Documentation (Web / API + Page Object Pattern / Endpoint Objects)

## Overview
This document describes the process for creating **Behavior-Driven Development (BDD) tests** in a PHP project using **Behat**, focusing on:

- Communication via Web (browser) or API requests
- Interacting with UI elements using **Page Objects (POP/POM)**
- Interacting with APIs using **Endpoint Objects**
- Orchestrating flows using **Flow Objects**

This approach enables testing web applications and APIs while keeping test code modular, maintainable, and reusable.

---

## 1. Project Structure

Recommended folder structure for Web/API-based BDD testing:

```
tests/
└── Behat/
    ├── behat.yml
    ├── bootstrap.php

    ├── Features/                # Gherkin feature files
    │   ├── login.feature
    │   ├── checkout.feature
    │   └── user_management.feature

    ├── Context/                 # Behat Context files
    │   ├── FeatureContext.php
    │   ├── WebContext.php
    │   ├── ApiContext.php
    │   └── HooksContext.php

    ├── PageObjects/             # Page Object Pattern (UI interaction)
    │   ├── BasePage.php
    │   ├── LoginPage.php
    │   ├── DashboardPage.php
    │   ├── CheckoutPage.php
    │   └── UserProfilePage.php

    ├── EndpointObjects/         # API Endpoint Objects
    │   ├── UserApi.php
    │   ├── OrderApi.php
    │   └── AuthApi.php

    ├── Flows/                   # Flow Objects (orchestrate pages/endpoints)
    │   ├── LoginFlow.php
    │   ├── CheckoutFlow.php
    │   ├── UserRegistrationFlow.php
    │   └── OrderProcessingFlow.php

    ├── Services/                # Helpers / Clients / Utilities
    │   ├── Browser/             # Mink/Selenium session helpers
    │   │   ├── MinkSessionFactory.php
    │   │   └── WaitHelper.php
    │   └── Api/                 # API clients
    │       ├── ApiClient.php
    │       └── ApiAuthenticator.php

    └── Reports/                 # Test reports and logs
        ├── logs/
        ├── html/
        └── json/
```

---

## 2. Page Objects (POP/POM)

**Purpose:** encapsulate UI interactions.

### Example: `LoginPage.php`
```php
class LoginPage
{
    private $session;

    public function __construct($session)
    {
        $this->session = $session;
    }

    public function visit()
    {
        $this->session->visit('/login');
    }

    public function fillCredentials($username, $password)
    {
        $page = $this->session->getPage();
        $page->fillField('username', $username);
        $page->fillField('password', $password);
    }

    public function submit()
    {
        $this->session->getPage()->pressButton('Login');
    }
}
```

- Encapsulates locators and UI actions.
- Makes tests readable and maintainable.

---

## 3. Endpoint Objects (API)

**Purpose:** encapsulate API interactions.

### Example: `UserApi.php`
```php
class UserApi
{
    private $client;

    public function __construct($client)
    {
        $this->client = $client;
    }

    public function getUser($id)
    {
        return $this->client->get("/users/$id");
    }

    public function createUser(array $data)
    {
        return $this->client->post('/users', ['json' => $data]);
    }
}
```

- Encapsulates API endpoints, HTTP methods, headers, and payloads.
- Allows reuse across multiple flows.

---

## 4. Flow Objects

**Purpose:** orchestrate multiple Page or Endpoint Objects to perform **business workflows**.

### Example: `UserRegistrationFlow.php`
```php
class UserRegistrationFlow
{
    private $loginPage;
    private $userApi;

    public function __construct(LoginPage $loginPage, UserApi $userApi)
    {
        $this->loginPage = $loginPage;
        $this->userApi = $userApi;
    }

    public function registerUser($username, $password, $email)
    {
        $this->loginPage->visit();
        $this->loginPage->fillCredentials($username, $password);
        $this->loginPage->submit();

        return $this->userApi->createUser(['username' => $username, 'email' => $email]);
    }
}
```

- Combines UI and API steps in a reusable business workflow.
- Keeps Context files simple and business-oriented.

---

## 5. Behat Context Files

**Purpose:** map **Gherkin steps** to flows.

### Example: `FeatureContext.php`
```php
use Behat\Behat\Context\Context;

class FeatureContext implements Context
{
    private $userFlow;
    private $lastResponse;

    public function __construct(UserRegistrationFlow $userFlow)
    {
        $this->userFlow = $userFlow;
    }

    /**
     * @Given I register a new user with username :username, password :password, and email :email
     */
    public function iRegisterANewUser($username, $password, $email)
    {
        $this->lastResponse = $this->userFlow->registerUser($username, $password, $email);
    }

    /**
     * @Then the user should be created successfully
     */
    public function theUserShouldBeCreated()
    {
        if ($this->lastResponse->getStatusCode() !== 201) {
            throw new Exception('User creation failed');
        }
    }
}
```

- Context files remain business-readable.
- They call flows, which call Page or Endpoint Objects.

---

## 6. Best Practices

1. **Separation of concerns:**
   - Context → WHAT
   - Flow → HOW
   - Page/Endpoint Objects → WHERE

2. **Reusability:**
   - Keep Page/Endpoint objects generic and reusable.

3. **Maintainability:**
   - Avoid business logic inside Page/Endpoint objects.

4. **Assertions:**
   - Use flows to return results to Context files for assertions.

5. **Hybrid workflows:**
   - Flows can combine UI and API interactions when needed.

---

## 7. Workflow Summary

```
Gherkin Step (Context) → Flow Object → Page Object / Endpoint Object → Browser / API
```

- This structure ensures clean, maintainable, and scalable BDD test automation.

---

## 8. Tools & Dependencies

- **Behat**: BDD framework
- **Mink / Selenium / Panther**: Browser automation
- **Guzzle / HTTP Client**: API requests
- **Composer autoloading**: Class organization
- **PHPUnit**: Optional assertions
