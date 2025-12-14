# USE CASE Template

Szablon do definiowania przypadków użycia i scenariuszy testowych.

## Metadane

- **ID**: `USECASE-XXX`
- **Typ**: `usecase`
- **Tytuł**: Tytuł scenariusza testowego / przypadku użycia
- **Task**: [TASK-XXX](../TASK-XXX-Nazwa/TASK.md)
- **Status**: `defined` | `verified` | `failed` | `deprecated`
- **Test Type**: `positive` | `negative` | `edge-case` | `security` | `performance`
- **Priority**: `critical` | `high` | `medium` | `low`

## Opis

Krótki opis kontekstu tego przypadku użycia.

Przykład:
> Scenariusz pozytywny — użytkownik rejestruje konto z poprawnymi danymi. 
> System tworzy konto, wysyła email weryfikacyjny i wyświetla komunikat sukcesu.

## Warunki Wstępne (Preconditions)

Warunki, które muszą być spełnione przed wykonaniem testu.

Przykład:
- System jest dostępny i działa
- Baza danych jest czysta (lub zawiera określone dane testowe)
- Email test@example.com NIE istnieje w bazie
- Mail server jest skonfigurowany
- Użytkownik NIE jest zalogowany

## Dane Testowe

Dane wejściowe używane w scenariuszu.

```yaml
email: "testuser@example.com"
password: "SecurePass123!"
password_confirmation: "SecurePass123!"
name: "Jan Kowalski"
```

## Kroki

1. **Krok 1** – Użytkownik otwiera stronę rejestracji `/register`
2. **Krok 2** – Użytkownik wypełnia formularz rejestracji:
   - Email: testuser@example.com
   - Hasło: SecurePass123!
   - Potwierdzenie hasła: SecurePass123!
   - Imię: Jan Kowalski
3. **Krok 3** – Użytkownik klika przycisk "Zarejestruj się"
4. **Krok 4** – System waliduje dane
5. **Krok 5** – System tworzy konto użytkownika
6. **Krok 6** – System wysyła email weryfikacyjny

## Oczekiwany Rezultat

Szczegółowy opis oczekiwanego zachowania systemu.

### UI (Frontend):
- Wyświetlony komunikat sukcesu: "Konto utworzone! Sprawdź email aby aktywować konto."
- Formularz jest wyczyszczony
- Przycisk "Zaloguj się" jest widoczny

### API (Backend):
- Status: `201 Created`
- Response body:
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": 1,
    "email": "testuser@example.com",
    "name": "Jan Kowalski",
    "email_verified_at": null
  }
}
```

### Database:
- Nowy rekord w tabeli `users`:
  - email: testuser@example.com
  - password: [bcrypt hash]
  - email_verified_at: NULL
  
### Email:
- Email wysłany na testuser@example.com
- Temat: "Verify your email address"
- Zawiera link aktywacyjny: https://app.localhost/verify-email?token=...

## Faktyczny Rezultat

*Wypełniane po wykonaniu testu.*

### Test Run #1 - 2024-01-15

- ✅ UI: Komunikat sukcesu wyświetlony poprawnie
- ✅ API: Status 201, response zgodny z oczekiwaniami
- ✅ Database: User utworzony z poprawnymi danymi
- ❌ Email: NIE wysłany (queue worker nie działał)

**Rezultat**: FAILED (email issue)

### Test Run #2 - 2024-01-16

- ✅ UI: OK
- ✅ API: OK  
- ✅ Database: OK
- ✅ Email: Wysłany poprawnie z linkiem aktywacyjnym

**Rezultat**: PASSED ✅

## Warunki Końcowe (Postconditions)

Stan systemu po wykonaniu scenariusza.

Przykład:
- Użytkownik istnieje w bazie danych
- Email weryfikacyjny został wysłany
- Użytkownik NIE jest zalogowany (wymaga weryfikacji email)
- Token weryfikacyjny jest zapisany i ważny 24h

## Powiązane Zadania

- [BUG-042: Email weryfikacyjny nie wysyłany](../BUG-042_EmailNieWyslany.md)
- [TASK-103: Implementacja email weryfikacyjny](../TASK-103-EmailWeryfikacyjny/TASK.md)

## Notatki

Dodatkowe uwagi, dane środowiskowe, problemy napotkane podczas testów.

Przykład:
- Test wykonany w środowisku Docker
- Mail server: Mailtrap (dev)
- Browser: Chrome 120, headless
- Test framework: Playwright
- Czas wykonania: 3.2s
- Screenshot: `screenshots/usecase-001-success.png`

---

## Przykłady Use Cases

### Przykład 1: Pozytywny scenariusz

```markdown
# USECASE-001: Poprawna rejestracja użytkownika

## Metadane

- **ID**: `USECASE-001`
- **Typ**: `usecase`
- **Tytuł**: Poprawna rejestracja użytkownika
- **Task**: [TASK-101: API rejestracji](../TASK-101-ApiRejestracja/TASK.md)
- **Status**: `verified` ✅
- **Test Type**: `positive`
- **Priority**: `critical`

## Opis

Scenariusz pozytywny — użytkownik rejestruje konto z poprawnymi danymi.
Test weryfikuje cały flow: frontend → API → database → email.

## Warunki Wstępne

- Docker containers uruchomione
- Database migrowana i pusta
- Email testuser@example.com NIE istnieje
- Mailtrap skonfigurowany

## Dane Testowe

```javascript
const testData = {
  email: "testuser@example.com",
  password: "SecurePass123!",
  password_confirmation: "SecurePass123!",
  name: "Jan Kowalski"
};
```

## Kroki

1. Otwórz `http://frontend.localhost/register`
2. Wypełnij formularz danymi testowymi
3. Kliknij "Zarejestruj się"
4. Obserwuj response i UI

## Oczekiwany Rezultat

- Status 201
- Message: "Registration successful"
- User zapisany w DB
- Email wysłany

## Faktyczny Rezultat

**Test Run - 2024-01-16 14:30 UTC**
- ✅ Wszystkie kryteria spełnione
- Czas: 2.8s
- Screenshot: screenshots/usecase-001.png

**Rezultat**: PASSED ✅
```

### Przykład 2: Negatywny scenariusz

```markdown
# USECASE-002: Rejestracja z duplikatem email

## Metadane

- **ID**: `USECASE-002`
- **Typ**: `usecase`
- **Tytuł**: Próba rejestracji z istniejącym emailem
- **Task**: [TASK-101: API rejestracji](../TASK-101-ApiRejestracja/TASK.md)
- **Status**: `verified` ✅
- **Test Type**: `negative`
- **Priority**: `high`

## Opis

Scenariusz negatywny — użytkownik próbuje zarejestrować konto z emailem,
który już istnieje w systemie. System powinien odrzucić rejestrację.

## Warunki Wstępne

- Email test@example.com JUŻ ISTNIEJE w bazie danych
- Użytkownik NIE jest zalogowany

## Dane Testowe

```javascript
const existingEmail = "test@example.com"; // already in DB
const testData = {
  email: existingEmail,
  password: "NewPass123!",
  password_confirmation: "NewPass123!",
  name: "Anna Nowak"
};
```

## Kroki

1. Otwórz `/register`
2. Wpisz email który już istnieje: test@example.com
3. Wypełnij pozostałe pola
4. Kliknij "Zarejestruj się"

## Oczekiwany Rezultat

### UI:
- Błąd walidacji pod polem email
- Komunikat: "The email has already been taken."
- Pozostałe pola nie są czyszczone

### API:
- Status: `422 Unprocessable Entity`
- Response:
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```

### Database:
- NIE utworzono nowego użytkownika
- Liczba users przed i po: bez zmian

## Faktyczny Rezultat

**Test Run - 2024-01-16 14:35 UTC**
- ✅ Status 422
- ✅ Error message poprawny
- ✅ UI wyświetla błąd walidacji
- ✅ Database nie zmieniona

**Rezultat**: PASSED ✅

## Notatki

- Test framework: Playwright
- Seed: TestSeeder (utworzył test@example.com)
- Browser: Chromium headless
```

### Przykład 3: Edge Case

```markdown
# USECASE-003: Rejestracja z bardzo długim imieniem

## Metadane

- **ID**: `USECASE-003`
- **Typ**: `usecase`
- **Tytuł**: Rejestracja z imieniem 255+ znaków
- **Task**: [TASK-101: API rejestracji](../TASK-101-ApiRejestracja/TASK.md)
- **Status**: `failed` ❌
- **Test Type**: `edge-case`
- **Priority**: `medium`

## Opis

Edge case — użytkownik próbuje zarejestrować się z imieniem przekraczającym
limit znaków (255). System powinien odrzucić lub obciąć.

## Dane Testowe

```javascript
const longName = "A".repeat(300); // 300 characters
```

## Oczekiwany Rezultat

- Status 422
- Error: "The name may not be greater than 255 characters."

## Faktyczny Rezultat

**Test Run - 2024-01-16 15:00 UTC**
- ❌ Status 500 Internal Server Error
- ❌ Database error: "Data too long for column 'name'"

**Rezultat**: FAILED ❌

**Bug utworzony**: [BUG-045: Brak walidacji długości name](../BUG-045_BrakWalidacjiName.md)

## Notatki

Brak walidacji max:255 w RegisterRequest.
Fix: Dodać `'name' => 'max:255'` do rules.
```
