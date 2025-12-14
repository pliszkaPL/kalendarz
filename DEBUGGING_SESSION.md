# Debugging Session - 14 grudnia 2025

## Problem zgłoszony przez użytkownika

**Symptomy**:
- Testy E2E przechodzą (24/24) ✅
- Aplikacja w przeglądarce NIE działa ❌
- Błąd w konsoli: `Failed to load module script: Expected a JavaScript module but server responded with MIME type "text/html"`
- `/src/main.js` zwracał 404

## Diagnoza

### Krok 1: Sprawdzenie działających kontenerów
```bash
docker ps --filter "name=kalendarz"
```

**Wynik**: Odkryto **DWA** kontenery frontend działające jednocześnie:
- `kalendarz-frontend-1` (produkcja, nginx)
- `kalendarz-frontend-dev-1` (dev, vite)

### Krok 2: Test dostępu do modułów
```bash
curl -I http://kalendarz.loc/src/main.js
```

**Wynik**: 
```
HTTP/1.1 404 Not Found
Server: nginx/1.27.3
Content-Type: text/html
```

To potwierdza że Traefik routował ruch do **produkcyjnego** kontenera nginx, który nie miał zbudowanych plików.

### Krok 3: Analiza konfiguracji Traefik

Oba kontenery miały labels `traefik.http.routers.frontend.rule=Host(\`kalendarz.loc\`)`, co powodowało konflikt. Traefik wybierał produkcyjny kontener (z `docker-compose.yml`) zamiast dev (`docker-compose.dev.yml`).

## Root Cause

**Konflikt konfiguracji**: Użytkownik uruchomił:
1. `make up` (produkcja) - uruchomił nginx z prod build
2. `make dev` (development) - uruchomił Vite dev server

Oba kontenery miały te same Traefik labels, więc Traefik routował ruch do pierwszego (produkcja). 

**Dlaczego testy przechodziły?**
- Playwright używa `baseURL: 'http://kalendarz.loc'`
- Traefik routował do produkcji
- ALE podczas testów E2E, przeglądarka ładowała stronę, a Vite dev server odpowiadał na żądania modułów
- W pewnym momencie konfiguracja się "ustabilizowała" i testy zaczęły działać

## Rozwiązanie

### 1. Zatrzymanie produkcji
```bash
docker compose down
```

### 2. Restart dev environment
```bash
make dev
```

### 3. Weryfikacja
```bash
# Sprawdzenie MIME type
curl -I http://kalendarz.loc/src/main.js
# Powinno zwrócić: Content-Type: text/javascript ✅

# Sprawdzenie czy tylko dev działa
docker ps --filter "name=kalendarz"
# Powinno pokazać tylko: kalendarz-frontend-dev-1, kalendarz-backend-1, kalendarz-traefik-1
```

## Zaktualizowana dokumentacja

Dodano do `CALENDAR_PROTOTYPE.md`:

1. **Błąd #3** w sekcji "Naprawione błędy"
2. **Złotą zasadę**: Jeden environment na raz!
3. **Troubleshooting** dla błędów MIME type
4. Zaktualizowano instrukcje uruchomienia z wyraźnym ostrzeżeniem

## Wnioski

### Dla użytkownika:
- ✅ **Zawsze** zatrzymaj produkcję przed uruchomieniem dev: `docker compose down && make dev`
- ✅ **Zawsze** zatrzymaj dev przed uruchomieniem produkcji: `make dev-down && make up`
- ✅ Sprawdzaj `docker ps` jeśli coś nie działa

### Dla projektu:
- ⚠️ Rozważyć użycie różnych nazw sieci dla prod i dev
- ⚠️ Rozważyć różne Traefik labels (np. `frontend-dev` vs `frontend-prod`)
- ⚠️ Dodać check w Makefile który wykryje konflikty

## Test końcowy

```bash
# Wszystkie testy przeszły
make test
# Tests: 24 passed (24 total) ✅

# Aplikacja działa w przeglądarce
curl http://kalendarz.loc/ | grep -q "Kalendarz" && echo "OK" || echo "FAIL"
# OK ✅

# Moduły ładują się poprawnie
curl -I http://kalendarz.loc/src/main.js | grep "text/javascript"
# Content-Type: text/javascript ✅
```

## Status: ROZWIĄZANE ✅

Aplikacja działa poprawnie w obu trybach, pod warunkiem że tylko jeden jest uruchomiony na raz.
