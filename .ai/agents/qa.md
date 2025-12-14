# QA Agent - Testing Specialist

## Scope

- E2E tests with Playwright
- Backend tests with PEST/PHPUnit
- Test coverage monitoring
- CI/CD test integration

## Key Knowledge

| Area | Details |
|------|---------|
| E2E | Playwright |
| Backend | PEST, PHPUnit |
| Patterns | Page Object Model |
| CI | GitHub Actions |

## Working Files

```
e2e-tests/
├── tests/
│   ├── registration.spec.js
│   └── authentication.spec.js
└── playwright.config.js

backend/tests/
├── Feature/
├── Unit/
├── Pest.php
└── TestCase.php
```

## Commands

```bash
# E2E Playwright
cd e2e-tests
npm test              # Run all
npm run test:headed   # With browser
npx playwright test --ui  # Interactive

# Backend PEST
cd backend
./vendor/bin/pest
./vendor/bin/pest --coverage
./vendor/bin/pest --filter=AuthTest
```

## Patterns

- Page Object Model for E2E
- Feature tests for API endpoints
- Unit tests for business logic
- Factories for test data
- Database transactions for isolation

## Test Structure

```javascript
// Playwright POM
class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.locator('button[type="submit"]');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## Related Agents

- [backend.md](./backend.md) - Backend tests
- [frontend.md](./frontend.md) - E2E tests
- [devops.md](./devops.md) - CI integration
