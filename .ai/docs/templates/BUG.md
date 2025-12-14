# BUG Template

Szablon do dokumentowania i śledzenia błędów w systemie.

## Metadane

- **ID**: `BUG-XXX`
- **Typ**: `bug`
- **Tytuł**: Opis błędu
- **Status**: `new` | `in-progress` | `fixed` | `verified` | `rejected`
- **Epic**: [EPIC-XXX](../EPIC-XXX-Nazwa/EPIC.md)
- **Bounded Context**: NazwaBoundedContextu
- **Priorytet**: `critical` | `high` | `medium` | `low`
- **Wykrył**: Imię Nazwisko / Agent

## Opis

Szczegółowy opis błędu, kontekst wystąpienia, warunki reprodukcji.

Przykład:
> Podczas próby logowania z niepoprawnym hasłem, system zwraca 500 Internal Server Error 
> zamiast 401 Unauthorized z komunikatem o błędzie.

## Kroki Reprodukcji

1. Krok 1 (np. Otwórz stronę logowania)
2. Krok 2 (np. Wpisz poprawny email i niepoprawne hasło)
3. Krok 3 (np. Kliknij "Zaloguj")

## Oczekiwany Rezultat

Oczekiwane zachowanie systemu.

Przykład:
> System powinien zwrócić odpowiedź 401 Unauthorized z JSON:
> ```json
> {
>   "message": "Invalid credentials",
>   "errors": { "email": ["These credentials do not match our records."] }
> }
> ```

## Faktyczny Rezultat

Faktyczne zachowanie systemu.

Przykład:
> System zwraca 500 Internal Server Error. W logach Laravel:
> ```
> [2024-01-15 10:23:45] local.ERROR: Call to a member function check() on null
> in AuthController.php:45
> ```

## Środowisko

- **System operacyjny**: Linux / Windows / macOS
- **Przeglądarka**: Chrome 120 / Firefox 121
- **Backend**: Laravel 12.0, PHP 8.3
- **Database**: SQLite 3.40
- **Docker**: Yes / No

## Powiązane Zadania

- [TASK-YYY: Naprawa błędu logowania](../TASK-YYY-NaprawaLogowania/TASK.md)
- [USECASE-002: Scenariusz negatywny logowania](../USECASE-002_NiepoprawneDane.md)

## Notatki

Dodatkowe informacje o priorytecie, ryzyku, workaround lub planowanej naprawie.

Przykład:
- **Priorytet**: Critical - blokuje logowanie użytkowników
- **Workaround**: Brak
- **Root cause**: Brak null-check przed wywołaniem Auth::attempt()
- **Fix**: Dodanie try-catch w AuthController@login

---

## Przykład Użycia

```markdown
# BUG-042

## Metadane

- **ID**: `BUG-042`
- **Typ**: `bug`
- **Tytuł**: Błąd 500 przy logowaniu z niepoprawnym hasłem
- **Status**: `fixed`
- **Epic**: [EPIC-001: Zarządzanie kontami](../EPIC-001-Konta/EPIC.md)
- **Bounded Context**: Authentication
- **Priorytet**: `critical`
- **Wykrył**: QA Testing Agent

## Opis

System zwraca błąd 500 zamiast 401 gdy użytkownik loguje się z niepoprawnym hasłem.
Błąd występuje tylko przy niepoprawnym haśle, poprawne dane działają OK.

## Kroki Reprodukcji

1. Otwórz formularz logowania na /login
2. Wpisz email: test@example.com (istniejący w bazie)
3. Wpisz hasło: wrongpassword
4. Kliknij "Zaloguj się"

## Oczekiwany Rezultat

Status 401 z JSON:
```json
{
  "message": "Invalid credentials"
}
```

## Faktyczny Rezultat

Status 500 z błędem w logach:
```
[2024-01-15 10:23:45] local.ERROR: Call to a member function check() on null
```

## Środowisko

- **System operacyjny**: Linux Ubuntu 22.04
- **Przeglądarka**: Chrome 120
- **Backend**: Laravel 12.0, PHP 8.3.1
- **Database**: SQLite 3.40
- **Docker**: Yes (docker-compose.yml)

## Powiązane Zadania

- [TASK-105: Naprawa error handling w AuthController](../TASK-105-NaprawaAuth/TASK.md)

## Notatki

**Fix zastosowany**: Dodano try-catch w AuthController@login i walidację przed Auth::attempt().
Zmergowano w PR #12.
```
