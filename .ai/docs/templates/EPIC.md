# EPIC Template

Szablon do definiowania Epiców - dużych inicjatyw biznesowych składających się z wielu User Stories.

## Metadane

- **ID**: `EPIC-XXX`
- **Tytuł**: Tytuł epica
- **Bounded Context**: NazwaBoundedContextu
- **Status**: `new` | `in-progress` | `implemented` | `deprecated` | `superseded`
- **Owner**: Imię Nazwisko / zespół
- **Timeline**: Q1 2024 / Milestone 1.0 / itp.

## Cel Biznesowy

Krótki, jasny opis celu biznesowego i wartości dla użytkowników.

Przykład:
> Umożliwienie użytkownikom pełnego zarządzania swoimi kontami: od rejestracji, przez 
> logowanie, edycję profilu, aż po odzyskiwanie dostępu. Zwiększa to bezpieczeństwo 
> i pozwala na personalizację doświadczenia użytkownika.

## Opis

Szczegółowy opis zakresu epica, głównych funkcjonalności i kontekstu.

Przykład:
> Epic obejmuje kompletny proces zarządzania kontami użytkowników:
> - **Rejestracja**: Tworzenie nowego konta z weryfikacją email
> - **Logowanie**: Authentykacja użytkownika z tokenem Sanctum
> - **Profil**: Przeglądanie i edycja danych osobowych
> - **Bezpieczeństwo**: Zmiana hasła, wylogowanie ze wszystkich urządzeń
> - **Odzyskiwanie**: Reset hasła przez email
>
> Epic stanowi fundament dla pozostałych funkcjonalności aplikacji, które wymagają
> uwierzytelnienia użytkownika.

## User Stories

- [STORY-001: Rejestracja użytkownika](./STORY-001-Rejestracja/STORY.md)
- [STORY-002: Logowanie użytkownika](./STORY-002-Logowanie/STORY.md)
- [STORY-003: Przeglądanie profilu](./STORY-003-Profil/STORY.md)
- [STORY-004: Edycja profilu](./STORY-004-EdycjaProfilu/STORY.md)
- [STORY-005: Zmiana hasła](./STORY-005-ZmianaHasla/STORY.md)
- [STORY-006: Odzyskiwanie hasła](./STORY-006-OdzyskiwanieHasla/STORY.md)

## Metryki Sukcesu

Mierzalne wskaźniki określające sukces realizacji epica.

Przykład:
- ✅ 100% użytkowników może zarejestrować konto
- ✅ Czas rejestracji < 2 minuty (od formularza do aktywacji)
- ✅ 0 krytycznych bugów związanych z authentykacją
- 📊 90%+ rate sukcesu logowania (na 100 prób)
- 📊 < 5% użytkowników wymaga password reset w pierwszym tygodniu

## Wymagania Techniczne

Kluczowe wymagania techniczne i architektoniczne.

Przykład:
- **Backend**: Laravel 12 + Sanctum (SPA authentication)
- **Frontend**: Vue.js 3 Composition API
- **Database**: SQLite (tabele: users, password_resets, personal_access_tokens)
- **Security**: bcrypt hashing, rate limiting, HTTPS
- **Email**: Laravel Mail + Queue dla async

## Zależności

Zewnętrzne zależności i wymagania wstępne.

Przykład:
- Mail server skonfigurowany (SMTP / Mailgun / SendGrid)
- SSL certyfikaty dla HTTPS
- Docker environment z PostgreSQL / SQLite
- Traefik routing skonfigurowany

## Bounded Context

Definicja granic kontekstu w architekturze DDD.

Przykład:
> **UserManagement** - Bounded Context odpowiedzialny za cykl życia konta użytkownika:
> - Entities: User, PasswordReset
> - Value Objects: Email, HashedPassword
> - Services: AuthenticationService, PasswordResetService
> - Events: UserRegistered, UserLoggedIn, PasswordChanged

## Ryzyka i Mitigacja

Zidentyfikowane ryzyka i strategie mitygacji.

Przykład:
| Ryzyko | Prawdopodobieństwo | Wpływ | Mitigacja |
|--------|-------------------|-------|-----------|
| Email delivery issues | Medium | High | Użycie niezawodnego providera (SendGrid), monitoring |
| Brute force attacks | High | Critical | Rate limiting, CAPTCHA po 3 próbach |
| Password reset abuse | Low | Medium | Signed URLs z expiracją, rate limiting |

## Notatki

Dodatkowe informacje, decyzje architektoniczne, ADR-y.

Przykład:
- **ADR-001**: Wybraliśmy Sanctum zamiast Passport (prostsze dla SPA)
- **ADR-002**: Email weryfikacyjny obowiązkowy (przeciwdziałanie spam)
- **Deadline**: Milestone 1.0 - 2024-02-15

---

## Przykład Użycia

```markdown
# EPIC-001: Zarządzanie Kontami Użytkowników

## Metadane

- **ID**: `EPIC-001`
- **Tytuł**: Zarządzanie Kontami Użytkowników
- **Bounded Context**: UserManagement
- **Status**: `in-progress` (60% completed)
- **Owner**: Full Stack Team (Laravel + Vue agents)
- **Timeline**: Milestone 1.0 - Q1 2024

## Cel Biznesowy

Umożliwienie użytkownikom aplikacji Kalendarz pełnego zarządzania swoimi kontami:
rejestracja, logowanie, zarządzanie profilem i bezpieczeństwo. To fundament aplikacji,
bez którego użytkownicy nie mogą korzystać z personalizowanych funkcji.

## Opis

Epic obejmuje kompletny cykl życia konta użytkownika w aplikacji Kalendarz MVP:

1. **Onboarding**: Rejestracja z weryfikacją email
2. **Authentication**: Bezpieczne logowanie z tokenami Sanctum
3. **Profile Management**: Przeglądanie i edycja danych osobowych
4. **Security**: Zmiana hasła, zarządzanie sesjami
5. **Account Recovery**: Reset hasła przez email

Wszystkie funkcje muszą być responsywne, accessible (WCAG 2.1) i bezpieczne.

## User Stories

- [STORY-001: Rejestracja użytkownika](./STORY-001-Rejestracja/STORY.md) ✅ Completed
- [STORY-002: Logowanie użytkownika](./STORY-002-Logowanie/STORY.md) ✅ Completed
- [STORY-003: Przeglądanie profilu](./STORY-003-Profil/STORY.md) 🔄 In Progress
- [STORY-004: Edycja profilu](./STORY-004-EdycjaProfilu/STORY.md) 📋 Pending
- [STORY-005: Zmiana hasła](./STORY-005-ZmianaHasla/STORY.md) 📋 Pending
- [STORY-006: Odzyskiwanie hasła](./STORY-006-OdzyskiwanieHasla/STORY.md) 📋 Pending

## Metryki Sukcesu

- ✅ Users table + migrations (DB)
- ✅ API endpoints: /register, /login, /logout (Backend)
- ✅ Auth forms: Register, Login (Frontend)
- 🔄 Profile view (Frontend - 70%)
- 📊 Target: < 3% registration drop-off rate
- 📊 Target: 95%+ login success rate

## Wymagania Techniczne

**Backend (Laravel 12)**:
- Models: User (Eloquent)
- Controllers: AuthController, ProfileController
- Middleware: Sanctum auth
- Requests: RegisterRequest, LoginRequest
- Mail: VerifyEmail, ResetPassword
- Queue: Email jobs

**Frontend (Vue 3)**:
- Views: Register, Login, Profile
- Components: AuthForm, ProfileCard
- Services: auth.js (Axios)
- Store: user state (reactive)
- Router: auth guards

**Database**:
```sql
users
  - id, email (unique), password, name, email_verified_at
  
password_resets
  - email, token, created_at
```

## Zależności

- ✅ Docker environment configured
- ✅ Laravel Sanctum installed
- ✅ Traefik routing (frontend.localhost, backend.localhost)
- 🔄 Mail server (Mailtrap for dev, SendGrid for prod)
- 📋 SSL certificates for production

## Bounded Context

**UserManagement** - Zarządzanie użytkownikami i authentykacją

**Entities**:
- User (id, email, password, name, email_verified_at)

**Value Objects**:
- Email (validated email address)
- HashedPassword (bcrypt hashed)

**Services**:
- AuthenticationService (login, logout, register)
- PasswordResetService (send reset link, reset password)

**Domain Events**:
- UserRegistered
- UserLoggedIn
- EmailVerified
- PasswordChanged

## Ryzyka i Mitigacja

| Ryzyko | P | I | Mitigacja |
|--------|---|---|-----------|
| Email delivery fails | M | H | Mailtrap (dev), SendGrid (prod), retry logic |
| Brute force login | H | C | Laravel throttle: 5 tries / 1 min, CAPTCHA |
| Token theft | L | H | HTTPS only, httpOnly cookies, short expiration |
| DB password leak | L | C | bcrypt hashing, never log passwords |

## Notatki

**Architecture Decision Records**:
- **ADR-001**: Sanctum chosen over Passport (simpler SPA auth, no OAuth needed)
- **ADR-002**: Email verification required (prevent spam accounts)
- **ADR-003**: SQLite for MVP (PostgreSQL for production)

**Timeline**:
- Week 1-2: STORY-001, STORY-002 (Auth basics) ✅
- Week 3: STORY-003 (Profile view) 🔄
- Week 4: STORY-004, STORY-005 (Profile edit, Password)
- Week 5: STORY-006 (Password recovery)
- Week 6: Testing, bug fixes, documentation

**Deadline**: 2024-02-15 (Milestone 1.0)
```
