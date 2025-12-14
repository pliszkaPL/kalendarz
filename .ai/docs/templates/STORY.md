# STORY Template

Szablon do definiowania User Stories - funkcjonalności z perspektywy użytkownika.

## Metadane

- **ID**: `STORY-XXX`
- **Epic**: [EPIC-XXX](../EPIC-XXX-Nazwa/EPIC.md)
- **Tytuł**: Tytuł Story
- **Status**: `new` | `in-progress` | `implemented` | `deprecated` | `superseded`
- **Owner**: Zespół / Agent odpowiedzialny

## User Story

**Jako** [typ użytkownika]  
**Chcę** [cel/potrzeba]  
**Aby** [korzyść/powód]

Przykład:
> **Jako** nowy użytkownik  
> **Chcę** móc zarejestrować konto z emailem i hasłem  
> **Aby** korzystać z funkcji aplikacji zarezerwowanych dla zalogowanych użytkowników

## Opis

Szczegółowy opis funkcjonalności lub scenariusza użytkownika.

Przykład:
> Użytkownik może zarejestrować konto poprzez formularz rejestracji. Podaje:
> - Email (unikalny w systemie)
> - Hasło (min. 8 znaków)
> - Imię
>
> Po rejestracji otrzymuje email z linkiem weryfikacyjnym. Po kliknięciu w link
> konto zostaje aktywowane i użytkownik może się zalogować.

## Kryteria Akceptacji

- [ ] Użytkownik może wypełnić formularz rejestracji
- [ ] System waliduje dane wejściowe (email, hasło)
- [ ] System tworzy konto i wysyła email weryfikacyjny
- [ ] Użytkownik może aktywować konto przez link w emailu
- [ ] Po aktywacji użytkownik może się zalogować

## Zadania (Tasks)

- [TASK-101: Implementacja API endpoint rejestracji](./TASK-101-ApiRejestracja/TASK.md)
- [TASK-102: Implementacja formularza rejestracji (frontend)](./TASK-102-FormularzRejestracji/TASK.md)
- [TASK-103: Email weryfikacyjny](./TASK-103-EmailWeryfikacyjny/TASK.md)
- [TASK-104: Endpoint aktywacji konta](./TASK-104-AktywacjaKonta/TASK.md)

## Wymagania Niefunkcjonalne

- Wydajność: Rejestracja powinna trwać max 2 sekundy
- Bezpieczeństwo: Hasła hashowane bcrypt, min. 8 znaków
- UX: Jasne komunikaty błędów walidacji
- Dostępność: Formularz zgodny z WCAG 2.1 AA

## Zależności

- Wymaga skonfigurowanego Laravel Sanctum (authentykacja)
- Wymaga skonfigurowanego mail serwera (emaile)
- Wymaga bazy danych z tabelą users

## Notatki

Dodatkowe uwagi, decyzje projektowe, ryzyka.

Przykład:
- Email weryfikacyjny wysyłany asynchronicznie przez Laravel Queue
- Token weryfikacyjny ważny 24 godziny
- Po 3 nieudanych próbach rejestracji IP blokowane na 15 minut (rate limiting)

---

## Przykład Użycia

```markdown
# STORY-001: Rejestracja użytkownika

## Metadane

- **ID**: `STORY-001`
- **Epic**: [EPIC-001: Zarządzanie kontami użytkowników](../EPIC-001-Konta/EPIC.md)
- **Tytuł**: Rejestracja użytkownika
- **Status**: `in-progress`
- **Owner**: Full Stack Team

## User Story

**Jako** nowy użytkownik aplikacji Kalendarz  
**Chcę** móc zarejestrować konto z emailem i hasłem  
**Aby** zapisywać moje wydarzenia i korzystać z szablonów

## Opis

Użytkownik rejestruje konto przez formularz zawierający:
- Email (weryfikowany pod kątem formatu i unikalności)
- Hasło (min. 8 znaków, wymagana potwierdzenie)
- Imię (opcjonalne)

Po rejestracji:
1. System tworzy konto (nieaktywne)
2. Wysyła email z linkiem aktywacyjnym
3. Użytkownik klika link
4. Konto zostaje aktywowane
5. Użytkownik może się zalogować

## Kryteria Akceptacji

- [x] Formularz rejestracji renderuje się poprawnie
- [x] Walidacja email (format + unikalność)
- [x] Walidacja hasła (min. 8 znaków)
- [ ] Email weryfikacyjny wysyłany
- [ ] Link aktywacyjny działa
- [ ] Po aktywacji można się zalogować

## Zadania (Tasks)

- [TASK-101: API endpoint POST /api/register](./TASK-101-ApiRejestracja/TASK.md) ✓
- [TASK-102: Formularz Vue.js](./TASK-102-FormularzRejestracji/TASK.md) ✓
- [TASK-103: Email weryfikacyjny](./TASK-103-EmailWeryfikacyjny/TASK.md) (in progress)
- [TASK-104: Endpoint GET /api/verify-email](./TASK-104-AktywacjaKonta/TASK.md)

## Wymagania Niefunkcjonalne

- **Wydajność**: Rejestracja < 2s
- **Bezpieczeństwo**: bcrypt hashing, rate limiting (3 tries / 15 min)
- **UX**: Inline validation, loading states
- **Dostępność**: ARIA labels, keyboard navigation

## Zależności

- Laravel Sanctum (AUTH-001)
- Mail server configuration (INFRA-015)
- Users table migration (DB-001)

## Notatki

- Queue worker musi być uruchomiony dla emaili
- Token weryfikacyjny: signed URL, expires 24h
- Rate limiting: 3 próby / 15 min per IP (Laravel throttle middleware)
```
