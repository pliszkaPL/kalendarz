# Kalendarz - Prototyp Działającego Kalendarza

## Status
✅ **Prototyp działający w 100%!** Wszystkie testy przechodzą (24/24).

Zaimplementowane podstawowe funkcjonalności widoku kalendarza z pełną pokryciem E2E testami.

## Co zostało zaimplementowane

### TypeScript Typy (STORY-001)
- ✅ Entry - wpisy kalendarza
- ✅ Group - grupy wpisów  
- ✅ Template - szablony z ikonami i kolorami
- ✅ RecurrenceRule - reguły powtarzania

### Pinia Stores (STORY-002)
- ✅ `useCalendarStore` - stan widoku kalendarza (miesiąc/rok, nawigacja)
- ✅ `useEntriesStore` - zarządzanie wpisami (localStorage)
- ✅ `useGroupsStore` - zarządzanie grupami (localStorage)
- ✅ `useTemplatesStore` - zarządzanie szablonami z 3 predefiniowanymi

### Komponenty UI (STORY-003)
- ✅ `CalendarView.vue` - główny widok z siatką i sidebarem
- ✅ `CalendarGrid.vue` - siatka 7x6 (dni tygodnia x tygodnie)
- ✅ `CalendarDay.vue` - pojedynczy dzień z wpisami
- ✅ `MonthNavigation.vue` - nawigacja miesiąc/rok

### Inne
- ✅ Routing `/calendar` z auth guard
- ✅ Przykładowe dane (seed) - automatyczne ładowanie przy pierwszym uruchomieniu
- ✅ Docker dev environment z hot reload
- ✅ UUID generator z fallback dla kompatybilności przeglądarek
- ✅ Testy E2E (Playwright) - 18 testów kalendarza + 2 backend + 5 auth
- ✅ **Wszystkie testy przechodzą: 24/24 ✓**

## Jak uruchomić

### Wymagania
- Docker i Docker Compose
- Wpis w `/etc/hosts`: `127.0.0.1 kalendarz.loc`

### Komendy Makefile

```bash
# Development (z hot reload)
make dev              # Uruchom środowisko developerskie
make dev-logs         # Pokaż logi
make dev-down         # Zatrzymaj

# Rebuild (po zmianach w Dockerfile)
make dev-rebuild      # Przebuduj i uruchom

# Production
make up               # Uruchom środowisko produkcyjne
make down             # Zatrzymaj
make logs             # Pokaż logi
```

### Uruchomienie krok po kroku

1. **Pierwsze uruchomienie (produkcja)**:
```bash
make up
make migrate
```

2. **Development (hot reload)**:
```bash
make dev
# lub
make dev-logs  # jeśli chcesz widzieć logi
```

3. **Otwórz w przeglądarce**:
   - Frontend: http://kalendarz.loc
   - API: http://kalendarz.loc/api
   - Traefik Dashboard: http://localhost:8080

4. **Zaloguj się**:
   - Utwórz konto lub użyj istniejącego
   - Przejdź do Dashboard → kliknij "Calendar"

5. **Zobacz prototyp**:
   - Kalendarz z bieżącym miesiącem
   - Przykładowe wpisy (urodziny, rocznice, przypomnienia)
   - Nawigacja między miesiącami
   - Sidebar z grupami i szablonami
   - Kolorowe wpisy zgodne z szablonami

## Struktura projektu

```
frontend/
├── src/
│   ├── components/
│   │   └── calendar/           # Komponenty kalendarza
│   │       ├── CalendarView.vue
│   │       ├── CalendarGrid.vue
│   │       ├── CalendarDay.vue
│   │       └── MonthNavigation.vue
│   ├── stores/                 # Pinia stores
│   │   ├── calendar.ts
│   │   ├── entries.ts
│   │   ├── groups.ts
│   │   └── templates.ts
│   ├── types/                  # TypeScript types
│   │   ├── calendar.ts
│   │   ├── template.ts
│   │   ├── recurrence.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── seedData.ts        # Przykładowe dane
│   │   └── uuid.ts            # UUID generator z fallback
│   └── views/
│       ├── Calendar.vue       # Widok kalendarza
│       ├── Dashboard.vue
│       └── Login.vue
```

## Funkcjonalności

### Nawigacja
- ◀ / ▶ - Poprzedni/następny miesiąc
- "Dziś" - Powrót do bieżącego miesiąca
- Kliknięcie miesiąc/rok - TODO: picker (zalogowane w konsoli)

### Widok kalendarza
- Siatka 7 dni × 6 tygodni
- Dni z innych miesięcy (wyszarzone)
- Dzisiejsza data (podświetlona na niebiesko)
- Wpisy w odpowiednich dniach z ikonami i kolorami

### Sidebar
- **Grupy** - lista grup z licznikiem wpisów
- **Szablony** - 3 predefiniowane szablony:
  - 🎂 Urodziny (czerwony)
  - 💕 Rocznica (różowy)
  - ⏰ Przypomnienie (żółty)
- **Statystyki** - liczba wszystkich wpisów i w bieżącym miesiącu

### Przykładowe dane
Po pierwszym wejściu do kalendarza automatycznie załadują się:
- 3 grupy (Rodzina, Praca, Przyjaciele)
- 8 wpisów (urodziny, rocznice, przypomnienia)
- Rozłożone w bieżącym i następnych miesiącach

## Co dalej?

### Do zaimplementowania (MVP)
- [ ] Modal dodawania/edycji wpisów
- [ ] Modal dodawania/edycji grup
- [ ] Kliknięcie na wpis - modal ze szczegółami
- [ ] Kliknięcie na dzień - dodaj wpis
- [ ] Wyszukiwarka wpisów
- [ ] Filtrowanie po grupach
- [ ] Pełny system szablonów z zmiennymi
- [ ] Obliczanie wieku, dni do/od
- [ ] Powtarzanie wpisów (yearly, custom)
- [ ] Import/Export (JSON)

## Testy

### Uruchomienie testów

```bash
# Wszystkie testy (backend + E2E)
make test

# Tylko backend
docker compose exec backend ./vendor/bin/pest

# Tylko E2E
cd e2e-tests && npm test

# Debug konkretnego testu
cd e2e-tests && npx playwright test tests/calendar.spec.js
```

### Pokrycie testów E2E

**Authentication (5 testów)**:
- ✅ Rejestracja i logowanie
- ✅ Walidacja nieprawidłowych danych logowania
- ✅ Przekierowanie na login dla niezalogowanych
- ✅ Przekierowanie na dashboard dla zalogowanych
- ✅ Wylogowanie i czyszczenie sesji

**Calendar (18 testów)**:
- ✅ Nawigacja do kalendarza z dashboardu
- ✅ Wyświetlanie siatki kalendarza (7x6)
- ✅ Nagłówki dni tygodnia
- ✅ Nawigacja między miesiącami (◀/▶)
- ✅ Przycisk "Dziś" - powrót do bieżącego miesiąca
- ✅ Wyświetlanie sidebara
- ✅ Wyświetlanie 3 szablonów (Urodziny, Rocznica, Przypomnienie)
- ✅ Wyświetlanie 3 grup (Rodzina, Praca, Przyjaciele)
- ✅ Wyświetlanie wpisów na kalendarzu
- ✅ Statystyki (wszystkie wpisy, w miesiącu)
- ✅ Podświetlenie dzisiejszej daty
- ✅ Oznaczenie dni z innych miesięcy
- ✅ Dostęp po logout/login
- ✅ Wymaganie autoryzacji

**Backend (2 testy)**:
- ✅ PHPUnit basic tests

### Wynik testów

```
Tests:  24 passed (24 total)
Time:   ~1.2 minutes
```

## Naprawione błędy

### Błąd #1: crypto.randomUUID() nie działał w Playwright
**Problem**: Playwright/Chromium nie wspierał `crypto.randomUUID()`, co powodowało crash Vue podczas inicjalizacji stores.

**Rozwiązanie**: Utworzono `frontend/src/utils/uuid.ts` z fallback implementacją UUID v4:
```typescript
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // Fallback dla starszych przeglądarek
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ...)
}
```

Zaktualizowano wszystkie stores (templates, entries, groups) aby używały `generateUUID()`.

### Błąd #2: Duplikacja `<div id="app">`
**Problem**: `App.vue` miał `<div id="app">` w template, podczas gdy `index.html` już miał ten element.

**Rozwiązanie**: Usunięto wrapper div z `App.vue`, zostaw tylko `<router-view />`.

## Troubleshooting

### Port 80 zajęty
```bash
# Zatrzymaj inne usługi na porcie 80
sudo systemctl stop nginx
# lub zmień port w docker-compose.yml
```

### Container nie startuje
```bash
# Sprawdź logi
make logs
# lub dla konkretnego kontenera
docker compose logs frontend-dev
docker compose logs backend
```

### Hot reload nie działa
```bash
# Restart dev environment
make dev-restart
```

### Czysty start
```bash
# Usuń wszystko i zacznij od nowa
make destroy
make dev-rebuild
```

## Technologie

- **Frontend**: Vue 3 + TypeScript + Pinia + Tailwind CSS
- **Backend**: Laravel 12 + SQLite + Sanctum
- **Infra**: Docker + Traefik + Nginx
- **Dev**: Vite 7 (Node.js 22.12.0) + Hot Module Replacement

## Dokumentacja

- [EPIC-001: Calendar Core](docs/work/EPIC-001-CalendarCore/EPIC.md)
- [STORY-001: Domain Types](docs/work/EPIC-001-CalendarCore/STORY-001-DomainTypes/STORY.md)
- [STORY-002: Storage Layer](docs/work/EPIC-001-CalendarCore/STORY-002-StorageLayer/STORY.md)
- [STORY-003: Calendar Grid](docs/work/EPIC-001-CalendarCore/STORY-003-CalendarGrid/STORY.md)
