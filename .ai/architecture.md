# Architektura - Kalendarz MVP

## Containers

| Container | Tech | Port | Rola |
|-----------|------|------|------|
| traefik | Traefik 3 | 80, 8080 | Reverse proxy, routing |
| frontend | Vue.js 3 + Nginx | - | SPA, static files |
| backend | Laravel 12 + PHP-FPM | - | REST API |
| database | SQLite (file) | - | Persistence |

## Routing

| URL | Target |
|-----|--------|
| `kalendarz.loc/*` | frontend |
| `kalendarz.loc/api/*` | backend |
| `localhost:8080` | Traefik dashboard |

## Backend Components

| Komponent | Lokalizacja | Odpowiedzialność |
|-----------|-------------|------------------|
| AuthController | `app/Http/Controllers/Api/` | Rejestracja, logowanie |
| User Model | `app/Models/` | Encja użytkownika |
| Sanctum | middleware | Token authentication |
| Migrations | `database/migrations/` | Schema DB |

## Frontend Components

| Komponent | Lokalizacja | Odpowiedzialność |
|-----------|-------------|------------------|
| Login.vue | `src/views/` | Formularz logowania/rejestracji |
| Dashboard.vue | `src/views/` | Panel użytkownika |
| auth.js | `src/services/` | Axios API calls |
| router | `src/router/` | Nawigacja SPA |

## Database Schema

### users
`id, name, email, password, email_verified_at, remember_token, created_at, updated_at`

### templates (planowane)
`id, user_id (FK nullable), name, icon, background_color, text_color, fields (JSON), display_format, is_archived, created_at, updated_at`

### events (planowane)
`id, user_id (FK), template_id (FK), title, description, data (JSON), created_at, updated_at`

### event_dates (planowane)
`id, event_id (FK), date, created_at, updated_at`

### personal_access_tokens (Sanctum)
`id, tokenable_type, tokenable_id, name, token, abilities, last_used_at, expires_at, created_at, updated_at`

## API Endpoints

### Zaimplementowane
- `POST /api/register` - rejestracja
- `POST /api/login` - logowanie (zwraca token)
- `POST /api/logout` - wylogowanie (auth required)
- `GET /api/user` - dane użytkownika (auth required)

### Planowane: Templates
- `GET/POST /api/templates` - lista/tworzenie
- `GET/PUT/DELETE /api/templates/{id}` - CRUD
- `POST /api/templates/{id}/archive` - archiwizacja

### Planowane: Events
- `GET/POST /api/events` - lista/tworzenie
- `GET/PUT/DELETE /api/events/{id}` - CRUD
- `GET /api/events/search` - wyszukiwanie
- `GET /api/calendar/{year}/{month}` - widok miesiąca

## Bounded Contexts

| Context | Encje | Odpowiedzialność |
|---------|-------|------------------|
| UserManagement | User | Auth, profil |
| TemplateManagement | Template, Field | Szablony wpisów |
| EventManagement | Event, EventDate | CRUD wydarzeń |
| Search | - | Wyszukiwanie full-text |

## Deployment

| Środowisko | Platforma | Uwagi |
|------------|-----------|-------|
| Development | Docker Compose | localhost |
| Production | Dokku | DigitalOcean VPS |

### Dokku Config
- `dokku apps:create kalendarz`
- `dokku domains:add kalendarz kalendarz.example.com`
- `dokku letsencrypt:enable kalendarz`
- SQLite -> PostgreSQL (plugin dokku-postgres)

## Security

| Warstwa | Mechanizm |
|---------|-----------|
| Auth | Laravel Sanctum (SPA tokens) |
| Validation | Form Requests |
| CORS | config/cors.php |
| Rate limit | Laravel throttle |
| SQL Injection | Eloquent ORM |
| XSS | Vue.js auto-escaping |
