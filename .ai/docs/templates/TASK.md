# TASK Template

Szablon do tworzenia zadań technicznych (implementacyjnych).

## Metadane

- **ID**: `TASK-XXX`
- **Typ**: `task`
- **Tytuł**: Tytuł zadania
- **Status**: `new` | `in-progress` | `implemented` | `deprecated` | `superseded`
- **Story**: [STORY-XXX](../STORY-XXX-Nazwa/STORY.md)
- **Epic**: [EPIC-XXX](../EPIC-XXX-Nazwa/EPIC.md)
- **Bounded Context**: NazwaBoundedContextu
- **Owner**: Imię Nazwisko / zespół

## Opis

Opis techniczny zadania, kontekst, wymagania implementacyjne.

Przykład:
> Implementacja endpointu API do rejestracji użytkownika. Endpoint przyjmuje dane: email, password, name. 
> Waliduje dane, hashuje hasło, zapisuje użytkownika do bazy danych i zwraca token Sanctum.

## Kryteria Akceptacji

- [ ] Kryterium 1 (np. Endpoint POST /api/register działa poprawnie)
- [ ] Kryterium 2 (np. Walidacja email sprawdza unikalność)
- [ ] Kryterium 3 (np. Hasło jest hashowane bcrypt)

## Powiązane Zadania

- [TASK-YYY: Nazwa powiązanego taska](../TASK-YYY-Nazwa/TASK.md)
- [BUG-ZZZ: Nazwa powiązanego buga](../BUG-ZZZ_NazwaBuga.md)

## Scenariusze Testowe (Use Cases)

- [USECASE-001: Scenariusz pozytywny - poprawna rejestracja](./USECASE-001_PoprawnaRejestracja.md)
- [USECASE-002: Scenariusz negatywny - duplikat email](./USECASE-002_DuplikatEmail.md)

## Notatki

Dodatkowe informacje, zależności lub decyzje projektowe.

Przykład:
- Używamy Laravel Form Request do walidacji
- Token Sanctum z czasem życia 24h
- Email confirmation wysyłany asynchronicznie przez queue

---

## Przykład Użycia

```markdown
# TASK-101

## Metadane

- **ID**: `TASK-101`
- **Typ**: `task`
- **Tytuł**: Implementacja endpointu rejestracji użytkownika
- **Status**: `in-progress`
- **Story**: [STORY-001: Rejestracja użytkownika](../STORY-001-Rejestracja/STORY.md)
- **Epic**: [EPIC-001: Zarządzanie kontami](../EPIC-001-Konta/EPIC.md)
- **Bounded Context**: UserManagement
- **Owner**: Laravel Backend Agent

## Opis

Implementacja endpointu API POST /api/register do rejestracji nowego użytkownika.
Endpoint przyjmuje: email, password, password_confirmation, name.
Zwraca: token Sanctum i dane użytkownika.

## Kryteria Akceptacji

- [x] Endpoint POST /api/register przyjmuje wymagane pola
- [x] Walidacja: email unique, password min 8 znaków
- [x] Hasło hashowane przez bcrypt
- [ ] Zwraca token Sanctum
- [ ] Wysyła email weryfikacyjny

## Powiązane Zadania

- [TASK-102: Frontend - formularz rejestracji](../TASK-102-FormularzRejestracji/TASK.md)

## Scenariusze Testowe

- [USECASE-001: Poprawna rejestracja](./USECASE-001_PoprawnaRejestracja.md)
- [USECASE-002: Duplikat email](./USECASE-002_DuplikatEmail.md)

## Notatki

- Form Request: RegisterRequest.php
- Controller: AuthController@register
- Model: User.php (Eloquent)
- Migration: 2024_01_01_000000_create_users_table.php
```
