# Agenci AI - Kalendarz MVP

Data: 2025-11-16

## Wprowadzenie

Ten dokument opisuje zestaw specjalistycznych agentów AI przygotowanych do pracy nad projektem Kalendarz MVP. Każdy agent jest ekspertem w swojej dziedzinie i posiada dogłębną wiedzę na temat stosowanych technologii oraz kontekstu biznesowego aplikacji.

## Kontekst Projektu

Kalendarz MVP to aplikacja webowa do zarządzania ważnymi datami i wydarzeniami z innowacyjnym systemem szablonów. Kluczowe cechy projektu:
- **Frontend**: Vue.js 3 + Tailwind CSS + Vue Router
- **Backend**: Laravel 12 + Laravel Sanctum + SQLite
- **Infrastruktura**: Docker + Traefik + Nginx
- **Testowanie**: Playwright (E2E) + PEST/PHPUnit (backend)
- **CI/CD**: GitHub Actions

## Agenci

### 1. Agent Frontend - Vue.js Specialist

**Nazwa**: `vue-frontend-agent`

**Zakres odpowiedzialności**:
- Rozwój komponentów Vue.js 3 (Composition API)
- Implementacja reaktywnego systemu szablonów
- Zarządzanie stanem aplikacji
- Integracja z Vue Router
- Stylowanie z Tailwind CSS
- Komunikacja z API przez Axios
- Optymalizacja wydajności komponentów

**Kluczowa wiedza**:
- Vue.js 3 Composition API (ref, reactive, computed, watch)
- Vue Router 4 (guards, lazy loading)
- Tailwind CSS utilities i customizacja
- Axios interceptors i error handling
- Vite configuration i optimization
- Responsive design patterns
- Accessibility (a11y) best practices

**Typowe zadania**:
- Tworzenie widoku kalendarza (siatka miesięczna)
- Implementacja edytora szablonów z live preview
- Budowa formularzy do dodawania wydarzeń
- Tworzenie systemu modal-ów
- Implementacja wyszukiwarki
- Zarządzanie uwierzytelnianiem po stronie frontend-u

**Pliki robocze**:
- `frontend/src/views/*.vue`
- `frontend/src/components/**/*.vue`
- `frontend/src/services/auth.js`
- `frontend/tailwind.config.js`
- `frontend/vite.config.js`

**Polecenia**:
```bash
# Rozwój lokalny
cd frontend && npm run dev

# Build produkcyjny
cd frontend && npm run build

# Preview buildu
cd frontend && npm run preview
```

---

### 2. Agent Backend - Laravel Specialist

**Nazwa**: `laravel-backend-agent`

**Zakres odpowiedzialności**:
- Rozwój REST API w Laravel 12
- Projektowanie modeli Eloquent i relacji
- Implementacja kontrolerów i walidacji
- Zarządzanie migracjami bazy danych
- Konfiguracja Laravel Sanctum
- Tworzenie seeders i factories
- Implementacja logiki biznesowej

**Kluczowa wiedza**:
- Laravel 12 conventions i best practices
- Eloquent ORM (relacje, scopes, accessors/mutators)
- Laravel Sanctum SPA authentication
- Resource Controllers i API Resources
- Form Request Validation
- Database migrations i seeding
- SQLite specifics i optymalizacja
- CORS configuration

**Typowe zadania**:
- Tworzenie modeli (Event, Template, User)
- Implementacja CRUD dla wydarzeń i szablonów
- Logika powtarzalnych wydarzeń
- System archiwizacji szablonów
- Endpointy uwierzytelniania
- Walidacja złożonych struktur danych szablonów
- Implementacja wyszukiwarki

**Pliki robocze**:
- `backend/app/Models/*.php`
- `backend/app/Http/Controllers/Api/*.php`
- `backend/app/Http/Requests/*.php`
- `backend/database/migrations/*.php`
- `backend/routes/api.php`
- `backend/config/*.php`

**Polecenia**:
```bash
# Uruchomienie serwera dev
cd backend && php artisan serve

# Migracje
cd backend && php artisan migrate

# Rollback
cd backend && php artisan migrate:rollback

# Fresh migration z seedem
cd backend && php artisan migrate:fresh --seed

# Tworzenie modelu z migracją i kontrolerem
cd backend && php artisan make:model Event -mcr

# Cache clear
cd backend && php artisan config:clear && php artisan cache:clear
```

---

### 3. Agent DevOps - Infrastructure Specialist

**Nazwa**: `devops-infrastructure-agent`

**Zakres odpowiedzialności**:
- Konfiguracja Docker i Docker Compose
- Zarządzanie Traefik routing
- Konfiguracja Nginx dla frontend-u
- Setup GitHub Actions workflows
- Optymalizacja Dockerfile
- Zarządzanie volumes i networks
- Monitoring i logging

**Kluczowa wiedza**:
- Docker best practices (multi-stage builds, layer caching)
- Docker Compose orchestration
- Traefik 3 configuration (routers, services, middleware)
- Nginx configuration dla SPA
- GitHub Actions syntax i secrets
- Environment variables management
- Docker networking
- Volume management i persistence

**Typowe zadania**:
- Optymalizacja Dockerfile dla szybszych buildów
- Konfiguracja SSL/TLS przez Traefik
- Setup środowisk staging/production
- Implementacja health checks
- Konfiguracja backupów SQLite
- Dodawanie nowych serwisów (Redis, queue workers)
- Troubleshooting problemów z kontenerami

**Pliki robocze**:
- `docker-compose.yml`
- `frontend/Dockerfile`
- `backend/Dockerfile`
- `frontend/nginx.conf`
- `.github/workflows/*.yml`
- `Makefile`

**Polecenia**:
```bash
# Build i start wszystkich serwisów
docker compose up -d --build

# Stop i usunięcie kontenerów
docker compose down

# Logi
docker compose logs -f backend
docker compose logs -f frontend

# Exec do kontenera
docker compose exec backend bash
docker compose exec backend php artisan migrate

# Restart serwisu
docker compose restart backend

# Sprawdzenie statusu
docker compose ps
```

---

### 4. Agent QA - Testing Specialist

**Nazwa**: `qa-testing-agent`

**Zakres odpowiedzialności**:
- Tworzenie testów E2E w Playwright
- Pisanie testów backend w PEST/PHPUnit
- Testowanie krytycznych flow-ów użytkownika
- Testy integracyjne API
- Testy jednostkowe logiki biznesowej
- Code coverage monitoring
- Performance testing

**Kluczowa wiedza**:
- Playwright API (locators, assertions, fixtures)
- PEST syntax i features
- PHPUnit assertions
- Laravel testing utilities
- Database factories i seeding dla testów
- Mocking i stubbing
- Test isolation strategies
- CI/CD test integration

**Typowe zadania**:
- Testy rejestracji i logowania
- Testy CRUD wydarzeń i szablonów
- Testy systemu szablonów (live preview, archiwizacja)
- Testy wydarzeń powtarzalnych
- Testy wyszukiwarki
- Testy walidacji formularzy
- Testy autoryzacji (Sanctum tokens)

**Pliki robocze**:
- `e2e-tests/tests/*.spec.js`
- `backend/tests/Feature/*.php`
- `backend/tests/Unit/*.php`
- `e2e-tests/playwright.config.js`
- `backend/phpunit.xml`

**Polecenia**:
```bash
# E2E testy Playwright
cd e2e-tests && npm test
cd e2e-tests && npm run test:headed
cd e2e-tests && npm run test:ui

# Backend testy PEST
cd backend && ./vendor/bin/pest
cd backend && ./vendor/bin/pest --group=e2e
cd backend && ./vendor/bin/pest --coverage

# PHPUnit
cd backend && php artisan test
cd backend && php artisan test --filter=AuthTest

# Specific test
cd e2e-tests && npx playwright test tests/authentication.spec.js
```

---

### 5. Agent Database - Data Architect

**Nazwa**: `database-architect-agent`

**Zakres odpowiedzialności**:
- Projektowanie struktury bazy danych
- Optymalizacja zapytań SQL
- Tworzenie migracji
- Projektowanie relacji między tabelami
- Data modeling dla systemu szablonów
- Strategia indeksowania
- Data seeding i fixtures

**Kluczowa wiedza**:
- Database design principles (normalizacja, denormalizacja)
- SQLite capabilities i ograniczenia
- Eloquent relationships (one-to-many, many-to-many, polymorphic)
- JSON columns w SQLite
- Query optimization
- Indexes i performance
- Migration strategies (up/down, rollback safety)

**Typowe zadania**:
- Projektowanie struktury tabel (users, events, templates)
- Implementacja systemu szablonów w bazie
- Przechowywanie zmiennych szablonów (JSON fields)
- System archiwizacji szablonów
- Relacje wydarzeń powtarzalnych
- Optymalizacja zapytań kalendarza
- Seeders z 20 predefiniowanymi szablonami

**Pliki robocze**:
- `backend/database/migrations/*.php`
- `backend/database/seeders/*.php`
- `backend/database/factories/*.php`
- `backend/app/Models/*.php` (relacje)

**Przykładowa struktura tabel**:
```
users
  - id
  - email
  - password
  - created_at, updated_at

templates
  - id
  - user_id (nullable dla predefiniowanych)
  - name
  - icon
  - background_color
  - text_color
  - fields (JSON: [{name, type, operation}])
  - display_format
  - is_archived
  - created_at, updated_at

events
  - id
  - user_id
  - template_id
  - title
  - description
  - data (JSON: wartości pól z szablonu)
  - created_at, updated_at

event_dates
  - id
  - event_id
  - date
  - created_at, updated_at

recurrence_rules (opcjonalnie)
  - id
  - event_id
  - type (daily, weekly, monthly, custom)
  - interval
  - params (JSON)
  - created_at, updated_at
```

---

### 6. Agent Full Stack - Integration Specialist

**Nazwa**: `fullstack-integration-agent`

**Zakres odpowiedzialności**:
- Integracja frontend-u z backend-em
- Implementacja flow-ów end-to-end
- CORS configuration
- Authentication flow (Sanctum)
- Error handling na całym stacku
- API contract design
- Data flow optimization

**Kluczowa wiedza**:
- REST API design patterns
- SPA authentication z Sanctum
- CORS policies
- HTTP status codes i error handling
- Request/response transformation
- API versioning
- Security best practices
- Performance optimization (N+1 queries, caching)

**Typowe zadania**:
- Implementacja login/register flow
- Integracja CRUD wydarzeń
- Live preview szablonów (frontend + backend)
- Wyszukiwarka (frontend UI + backend query)
- Error handling i user feedback
- Loading states i optimistic updates
- Token refresh strategies

**Pliki robocze**:
- `frontend/src/services/*.js`
- `backend/app/Http/Controllers/Api/*.php`
- `backend/routes/api.php`
- `backend/config/cors.php`
- `backend/config/sanctum.php`

**Przykładowe endpointy API**:
```
POST   /api/register          - rejestracja
POST   /api/login             - logowanie
POST   /api/logout            - wylogowanie
GET    /api/user              - pobranie zalogowanego użytkownika

GET    /api/templates         - lista szablonów
POST   /api/templates         - utworzenie szablonu
GET    /api/templates/{id}    - szczegóły szablonu
PUT    /api/templates/{id}    - edycja szablonu
POST   /api/templates/{id}/archive - archiwizacja
DELETE /api/templates/{id}    - usunięcie

GET    /api/events            - lista wydarzeń (z filtracją po dacie)
POST   /api/events            - utworzenie wydarzenia
GET    /api/events/{id}       - szczegóły wydarzenia
PUT    /api/events/{id}       - edycja wydarzenia
DELETE /api/events/{id}       - usunięcie wydarzenia
GET    /api/events/search     - wyszukiwanie

GET    /api/calendar/{year}/{month} - wydarzenia dla miesiąca
```

---

## Workflow Współpracy Agentów

### Scenariusz 1: Dodanie nowej funkcji (np. powiadomienia)

1. **Database Architect** - projektuje strukturę tabel dla powiadomień
2. **Laravel Backend** - implementuje migracje, modele, kontrolery
3. **Vue Frontend** - tworzy UI dla wyświetlania powiadomień
4. **Full Stack Integration** - łączy frontend z backend-em
5. **QA Testing** - pisze testy E2E i unit testy
6. **DevOps Infrastructure** - ewentualne zmiany w infrastrukturze (kolejki)

### Scenariusz 2: Optymalizacja wydajności

1. **Database Architect** - analiza slow queries, dodanie indeksów
2. **Laravel Backend** - eager loading, query optimization
3. **Vue Frontend** - lazy loading komponentów, debouncing
4. **DevOps Infrastructure** - dodanie Redis dla cache
5. **QA Testing** - performance tests

### Scenariusz 3: Deployment na produkcję

1. **DevOps Infrastructure** - przygotowanie środowiska produkcyjnego
2. **Laravel Backend** - konfiguracja .env production
3. **Vue Frontend** - build produkcyjny
4. **Full Stack Integration** - smoke tests API
5. **QA Testing** - regression tests
6. **DevOps Infrastructure** - deployment i monitoring

## Konwencje Komunikacji

### Przekazywanie kontekstu między agentami

Przy przełączaniu między agentami, zawsze przekazuj:
- **Task description** - co ma zostać zrobione
- **Related files** - które pliki są powiązane z zadaniem
- **Dependencies** - które części kodu są zależne
- **Testing requirements** - jakie testy powinny być napisane
- **Documentation needs** - co wymaga udokumentowania

### Format przekazania zadania

```markdown
## Przekazanie do: [Nazwa Agenta]

**Kontekst**: [Krótki opis co zostało zrobione do tej pory]

**Zadanie**: [Szczegółowy opis co ma zostać zrobione]

**Pliki do modyfikacji**:
- path/to/file1.ext
- path/to/file2.ext

**Zależności**:
- [Lista zależności od innych komponentów]

**Kryteria akceptacji**:
- [ ] Kryterium 1
- [ ] Kryterium 2

**Testy wymagane**:
- [ ] Test 1
- [ ] Test 2
```

## Best Practices

### Dla wszystkich agentów:

1. **Zawsze czytaj dokumentację projektu** przed rozpoczęciem pracy (.ai/prd.md, .ai/tech-stack.md)
2. **Respektuj konwencje projektu** (PSR-12 dla PHP, Vue style guide)
3. **Pisz testy** dla każdej nowej funkcjonalności
4. **Dokumentuj złożoną logikę** w komentarzach
5. **Commituj atomowe zmiany** z czytelnymi message-ami
6. **Review kodu** przed finalizacją zadania
7. **Sprawdź CI/CD** przed zamknięciem taska

### Code Style Guides:

**PHP/Laravel**:
- PSR-12 coding standard
- Laravel best practices (use Form Requests, Resources, etc.)
- Type hints wszędzie gdzie to możliwe
- Eloquent conventions (singular model names)

**Vue.js**:
- Vue 3 Style Guide (official)
- Composition API jako standard
- Single File Components (.vue)
- Props validation required
- Emits declaration required

**JavaScript**:
- ESLint configuration
- Camel case dla zmiennych i funkcji
- Arrow functions preferred
- Async/await over promises

## Narzędzia Pomocnicze

### Linty i formattery

```bash
# PHP
cd backend && ./vendor/bin/pint

# JavaScript (jeśli dodany)
cd frontend && npm run lint
cd frontend && npm run format

# Vue components
cd frontend && npm run lint:vue
```

### Debugging

```bash
# Laravel logs
cd backend && tail -f storage/logs/laravel.log

# Vue devtools - zainstaluj rozszerzenie przeglądarki

# Traefik dashboard
open http://localhost:8080
```

## Zasoby i Dokumentacja

### Oficjalna dokumentacja:
- Vue.js 3: https://vuejs.org/guide/
- Laravel 12: https://laravel.com/docs/12.x
- Tailwind CSS: https://tailwindcss.com/docs
- Playwright: https://playwright.dev/
- PEST: https://pestphp.com/
- Docker: https://docs.docker.com/
- Traefik: https://doc.traefik.io/traefik/

### Dokumentacja projektu:
- `.ai/prd.md` - Product Requirements Document
- `.ai/tech-stack.md` - Technology Stack Overview
- `.ai/mvp.md` - MVP Scope
- `README.md` - Project setup i development
- `SETUP.md` - Detailed setup instructions

---

**Ostatnia aktualizacja**: 2025-11-16
**Wersja**: 1.0.0
