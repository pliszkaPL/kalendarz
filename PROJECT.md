# Kalendarz MVP

## Status projektu

| Aspekt | Wartość |
|--------|---------|
| **Faza** | Development (MVP) |
| **Wersja** | 0.1.0 |
| **Data startu** | 2025-11-16 |

## Cel

Aplikacja do zarządzania ważnymi datami i wydarzeniami z innowacyjnym systemem szablonów. Rozwiązuje problem zapominania o istotnych terminach poprzez personalizację wpisów i automatyzację wyświetlania informacji.

## Kluczowe funkcjonalności (MVP)

1. **System szablonów** - definiowanie wyglądu i logiki wpisów
2. **CRUD wydarzeń** - tworzenie, edycja, usuwanie wpisów
3. **Wpisy powtarzalne** - cykliczne wydarzenia
4. **Wyszukiwarka** - szybkie znajdowanie wpisów
5. **Autentykacja** - rejestracja i logowanie (Sanctum)

## Stack technologiczny

| Warstwa | Technologia |
|---------|-------------|
| Frontend | Vue.js 3 + Tailwind CSS + Vite |
| Backend | Laravel 12 + Sanctum |
| Baza danych | SQLite |
| Infrastruktura | Docker + Traefik + Nginx |
| Testy | Playwright (E2E) + PEST (backend) |
| CI/CD | GitHub Actions |

## Struktura repozytorium

```
.
├── AGENTS.md           # Punkt startowy dla AI
├── PROJECT.md          # Ten plik - kontekst projektu
├── README.md           # Setup i uruchomienie
├── Makefile            # Komendy projektu
├── .ai/                # Reguły i szablony dla AI
│   ├── prd.md          # Product Requirements
│   ├── mvp.md          # Scope MVP
│   ├── tech-stack.md   # Szczegóły technologii
│   ├── architecture.md # Architektura C4
│   ├── git.md          # Git workflow
│   ├── agents/         # Profile agentów AI
│   ├── rules/          # Standardy kodowania
│   ├── snippets/       # Fragmenty kodu
│   └── docs/           # Szablony dokumentacji
├── docs/               # Dokumentacja projektu
│   ├── adr/            # Architecture Decision Records
│   └── work/           # EPIC/STORY/TASK (aktywne zadania)
├── backend/            # Laravel 12 REST API
├── frontend/           # Vue.js 3 SPA
├── e2e-tests/          # Playwright E2E
└── docker-compose.yml  # Definicja środowiska
```

## Uruchomienie

```bash
# 1. Dodaj do /etc/hosts
127.0.0.1 kalendarz.loc

# 2. Start
make up

# 3. Migracje
make migrate
```

Dostęp:
- Frontend: http://kalendarz.loc
- API: http://kalendarz.loc/api
- Traefik: http://localhost:8080

## Aktualny stan

### Zaimplementowane
- [x] Infrastruktura Docker + Traefik
- [x] Backend Laravel 12 + Sanctum
- [x] API: `/api/register`, `/api/login`, `/api/logout`, `/api/user`
- [x] Frontend Vue.js 3 + Login/Register panel
- [x] E2E testy Playwright (registration, authentication)
- [x] GitHub Actions CI/CD

### Do zrobienia (MVP)
- [ ] System szablonów (CRUD)
- [ ] CRUD wydarzeń
- [ ] Wpisy powtarzalne
- [ ] Widok kalendarza (siatka miesiąca)
- [ ] Wyszukiwarka
- [ ] 20 predefiniowanych szablonów

## Dokumentacja

- [PRD (wymagania)](.ai/prd.md)
- [MVP (zakres)](.ai/mvp.md)
- [Tech Stack](.ai/tech-stack.md)
- [Git Workflow](.ai/git.md)
- [Architektura](.ai/architecture.md)
