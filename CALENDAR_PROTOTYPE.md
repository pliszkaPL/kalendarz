# Kalendarz - Prototyp Działającego Kalendarza

## Status
✅ **Prototyp w pełni funkcjonalny z UI do zarządzania wpisami i grupami!**

Zaimplementowane:
- ✅ Pełny widok kalendarza z nawigacją
- ✅ Modal dodawania/edycji wpisów
- ✅ Modal dodawania/edycji grup
- ✅ Kliknięcie w dzień → dodaj wpis z datą
- ✅ Kliknięcie w wpis → edytuj/usuń
- ✅ Kliknięcie w szablon → utwórz wpis z szablonem
- ✅ localStorage persistence
- ✅ E2E tests (50+ testów napisanych)

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
- ✅ `CalendarDay.vue` - pojedynczy dzień z wpisami (klikalne!)
- ✅ `MonthNavigation.vue` - nawigacja miesiąc/rok
- ✅ `EntryModal.vue` - modal dodawania/edycji wpisów (14KB, 483 linie)
- ✅ `GroupModal.vue` - modal dodawania/edycji grup (7.8KB, 363 linie)

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
# Status / Diagnostyka
make which-env        # Sprawdź który environment działa (prod/dev)
make help             # Pokaż wszystkie dostępne komendy

# Development (z hot reload)
make dev              # Uruchom środowisko developerskie (automatycznie sprawdzi konflikty)
make dev-logs         # Pokaż logi
make dev-down         # Zatrzymaj
make dev-rebuild      # Przebuduj i uruchom

# Production
make up               # Uruchom środowisko produkcyjne (automatycznie sprawdzi konflikty)
make down             # Zatrzymaj
make logs             # Pokaż logi

# Testy
make test             # Uruchom wszystkie testy (backend + E2E)
```

### Uruchomienie krok po kroku

⚠️ **WAŻNE**: Uruchamiaj TYLKO development LUB production, nigdy jednocześnie!

**Opcja A: Development (zalecane dla pracy nad kodem)**:
```bash
# Upewnij się że produkcja NIE działa
docker compose down

# Uruchom dev
make dev
# lub z logami:
make dev-logs
```

**Opcja B: Production (dla testów produkcyjnych)**:
```bash
# Upewnij się że dev NIE działa
make dev-down

# Uruchom produkcję
make up
make migrate
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
│   │       ├── CalendarView.vue      # Container z sidebarem
│   │       ├── CalendarGrid.vue      # Siatka 7x6
│   │       ├── CalendarDay.vue       # Dzień + wpisy (klikalne)
│   │       ├── MonthNavigation.vue   # Nawigacja ◀ ▶ Dziś
│   │       ├── EntryModal.vue        # ✨ Modal wpisu (483 linie)
│   │       └── GroupModal.vue        # ✨ Modal grupy (363 linie)
│   ├── stores/                 # Pinia stores
│   │   ├── calendar.ts         # currentMonth, currentYear
│   │   ├── entries.ts          # CRUD entries + localStorage
│   │   ├── groups.ts           # CRUD groups + localStorage
│   │   └── templates.ts        # 3 szablony
│   ├── types/                  # TypeScript types
│   │   ├── calendar.ts         # Entry (z icon, colors!), Group
│   │   ├── template.ts         # Template
│   │   ├── recurrence.ts       # RecurrenceRule
│   │   └── index.ts            # Exports
│   ├── utils/
│   │   ├── seedData.ts         # 8 wpisów + 3 grupy
│   │   └── uuid.ts             # UUID generator z fallback
│   └── views/
│       ├── Calendar.vue        # ✨ Główny widok (provide/inject)
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

## Jak korzystać z prototypu

### Dodawanie wpisów
1. **Kliknij przycisk "+" w górnym prawym rogu** - otwiera modal nowego wpisu
2. **Kliknij na dowolny dzień w kalendarzu** - otwiera modal z predefiniowaną datą
3. **Kliknij na szablon w sidebarze** - otwiera modal z ikoną i kolorami z szablonu

### Edycja/usuwanie wpisów
1. **Kliknij na istniejący wpis** - otwiera modal edycji
2. W modalu możesz:
   - Zmienić nazwę, datę, opis
   - Wybrać inną ikonę (12 emoj do wyboru)
   - Zmienić kolory tła i tekstu
   - Przypisać do grupy
   - **Usunąć wpis** (przycisk "Usuń" w trybie edycji)

### Zarządzanie grupami
1. **Kliknij "+" obok "Grupy" w sidebarze** - dodaj nową grupę
2. **Kliknij na istniejącą grupę** - edytuj/usuń
3. Grupy mają:
   - Nazwę
   - Kolor (10 presetów + custom color picker)
   - Licznik przypisanych wpisów

## Co dalej?

### Zaimplementowane w MVP v1.0 ✅
- ✅ Modal dodawania/edycji wpisów
- ✅ Modal dodawania/edycji grup
- ✅ Kliknięcie na wpis - modal ze szczegółami
- ✅ Kliknięcie na dzień - dodaj wpis
- ✅ Ikony i kolory z szablonów
- ✅ Przypisywanie wpisów do grup

### Do zaimplementowania (MVP v2.0)
- [ ] Wyszukiwarka wpisów
- [ ] Filtrowanie po grupach (checkbox w sidebarze)
- [ ] Pełny system szablonów z zmiennymi
- [ ] Obliczanie wieku, dni do/od
- [ ] Powtarzanie wpisów (yearly, custom) - UI
- [ ] Import/Export (JSON)
- [ ] Drag & drop przesuwanie wpisów między dniami

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

### Błąd #3: Konflikt produkcja vs dev - aplikacja nie działa w przeglądarce
**Problem**: Uruchomiono `make up` (produkcja) i `make dev` jednocześnie. Traefik routował ruch do produkcyjnego kontenera nginx, który nie miał zbudowanych plików. Rezultat:
- Testy E2E przechodziły (używały dev server)
- Przeglądarka nie działała (dostawała 404 dla `/src/main.js` z nginx)
- Błąd: `Failed to load module script: Expected a JavaScript module but server responded with MIME type "text/html"`

**Diagnoza**:
```bash
# Dwa kontenery frontend działały jednocześnie:
kalendarz-frontend-1       # produkcja (nginx) ← Traefik routował tutaj
kalendarz-frontend-dev-1   # dev (vite) ← nikt nie korzystał
```

**Rozwiązanie**: 
```bash
# ZAWSZE używaj ALBO produkcji ALBO dev, nigdy jednocześnie:

# Development (zalecane dla pracy):
docker compose down        # Zatrzymaj produkcję
make dev                   # Uruchom dev

# Produkcja (dla testów produkcyjnych):
make dev-down              # Zatrzymaj dev
make up                    # Uruchom produkcję
```

**Złota zasada**: Jeden environment na raz!

### Błąd #4: Entry type nie miał pól wizualnych (icon, backgroundColor, textColor)
**Problem**: CalendarDay próbował wyświetlić `entry.icon`, `entry.backgroundColor`, `entry.textColor`, ale te pola nie istniały w typie Entry. Rezultat:
- Wpisy renderowały się bez ikon (puste `<span>`)
- Testy E2E wykrywały "element not visible"
- seedData nie ustawiał kolorów

**Rozwiązanie**: 
1. Zaktualizowano `types/calendar.ts` - dodano wymagane pola:
```typescript
export interface Entry {
  id: string
  name: string
  date: string
  icon: string                // ✨ NOWE
  backgroundColor: string     // ✨ NOWE
  textColor: string          // ✨ NOWE
  templateId?: string        // opcjonalne
  groupId?: string | null    // opcjonalne
  // ...
}
```

2. Zaktualizowano `seedData.ts` - każdy wpis kopiuje wartości z szablonu:
```typescript
entriesStore.addEntry({
  name: 'Urodziny Mamy',
  icon: birthdayTemplate.icon,               // 🎂
  backgroundColor: birthdayTemplate.backgroundColor,  // #ff6b6b
  textColor: birthdayTemplate.textColor,     // #ffffff
  // ...
})
```

3. Zaktualizowano `EntryModal.vue` - defaultForm ma sensowne domyślne:
```typescript
const defaultForm = {
  icon: '📝',
  backgroundColor: '#3b82f6',
  textColor: '#ffffff',
  // ...
}
```

### Błąd #5: EntryModal/GroupModal wywoływały nieistniejące funkcje
**Problem**: Modals wywoływały `createEntry()` i `createGroup()`, ale stores eksportują `addEntry()` i `addGroup()`.

**Rozwiązanie**: Poprawiono funkcje w obu modalach:
```typescript
// EntryModal.vue - handleSubmit()
entriesStore.addEntry({  // było: createEntry
  name: form.value.name,
  // ... wszystkie wymagane pola
})

// GroupModal.vue - handleSubmit()
groupsStore.addGroup({   // było: createGroup
  name: form.value.name,
  color: form.value.color,
  tags: [],
  description: ''
})
```

### Błąd #6: Testy używały niepoprawnych kluczy localStorage
**Problem**: Testy czyściły/sprawdzały `calendar_entries` i `calendar_groups`, ale stores używają `kalendarz_entries` i `kalendarz_groups`.

**Rozwiązanie**: Zaktualizowano wszystkie testy E2E:
```javascript
// Przed
localStorage.getItem('calendar_entries')  // ❌
localStorage.getItem('calendar_groups')   // ❌

// Po
localStorage.getItem('kalendarz_entries')  // ✅
localStorage.getItem('kalendarz_groups')   // ✅
```

**Złota zasada**: Jeden environment na raz!

## Troubleshooting

### Port 80 zajęty
```bash
# Zatrzymaj inne usługi na porcie 80
sudo systemctl stop nginx
# lub zmień port w docker-compose.yml
```

### Aplikacja nie działa w przeglądarce (404 dla .js, błędy MIME type)
```bash
# Sprawdź czy nie masz dwóch environment jednocześnie
docker ps --filter "name=kalendarz"

# Jeśli widzisz kalendarz-frontend-1 I kalendarz-frontend-dev-1:
docker compose down        # Zatrzymaj produkcję
make dev                   # Restart dev

# Sprawdź czy moduły się ładują:
curl -I http://kalendarz.loc/src/main.js
# Powinno zwrócić: Content-Type: text/javascript
```

### Container nie startuje
```bash
# Sprawdź logi
make dev-logs              # Dla dev
# lub
make logs                  # Dla produkcji

# lub dla konkretnego kontenera
docker compose -f docker-compose.dev.yml logs frontend-dev
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
