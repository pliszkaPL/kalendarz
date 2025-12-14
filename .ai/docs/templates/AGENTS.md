# AI Agents - Task Templates Guide

Kompaktowy przewodnik dla agentów AI jak używać szablonów zadań w projekcie Kalendarz MVP.

## Szybki Start

### Hierarchia Zadań

```
EPIC (cel biznesowy)
  └─> STORY (funkcjonalność użytkownika)
      └─> TASK (implementacja techniczna)
          └─> USECASE (scenariusz testowy)
          
BUG (błąd) -> TASK (naprawa)
```

### Kiedy używać którego szablonu?

| Szablon | Kiedy używać | Przykład |
|---------|--------------|----------|
| **EPIC** | Duża inicjatywa biznesowa (2-6 tygodni) | Zarządzanie kontami użytkowników |
| **STORY** | Pojedyncza funkcjonalność użytkownika (3-7 dni) | Rejestracja użytkownika |
| **TASK** | Konkretne zadanie techniczne (1-2 dni) | Implementacja API endpoint /register |
| **USECASE** | Scenariusz testowy | Test: poprawna rejestracja |
| **BUG** | Wykryty błąd | Error 500 przy logowaniu |

## Workflow dla AI Agentów

### 1. Otrzymujesz zadanie od użytkownika

**Przykład**: "Zaimplementuj rejestrację użytkownika"

### 2. Identyfikuj poziom zadania

```
Duża funkcjonalność (>1 tydzień) → Utwórz EPIC
Funkcjonalność użytkownika → Utwórz STORY  
Zadanie techniczne → Utwórz TASK
Błąd do naprawy → Utwórz BUG
```

### 3. Utwórz odpowiedni plik

**Struktura katalogów**:
```
.ai/docs/work/
├── EPIC-001-ZarzadzanieKontami/
│   ├── EPIC.md
│   ├── STORY-001-Rejestracja/
│   │   ├── STORY.md
│   │   ├── TASK-101-ApiEndpoint/
│   │   │   ├── TASK.md
│   │   │   ├── USECASE-001_PoprawnaRejestracja.md
│   │   │   └── USECASE-002_DuplikatEmail.md
│   │   └── TASK-102-FormularzFrontend/
│   │       └── TASK.md
│   └── STORY-002-Logowanie/
│       └── STORY.md
└── BUG-042_Error500Logowanie.md
```

### 4. Wypełnij szablon

Użyj odpowiedniego szablonu z katalogu `templates/`:
- `EPIC.md` - dla epiców
- `STORY.md` - dla stories
- `TASK.md` - dla tasków
- `USECASE.md` - dla testów
- `BUG.md` - dla bugów

### 5. Linkuj powiązane zadania

**Zawsze linkuj hierarchicznie**:
```markdown
# W TASK-101
- **Story**: [STORY-001: Rejestracja](../STORY.md)
- **Epic**: [EPIC-001: Zarządzanie kontami](../../EPIC.md)

# W USECASE-001
- **Task**: [TASK-101: API endpoint](../TASK.md)
```

## Konwencje Nazewnictwa

### Pliki i katalogi

```
EPIC-XXX-NazwaEpica/
  EPIC.md
  
STORY-XXX-NazwaStory/
  STORY.md
  
TASK-XXX-NazwaTaska/
  TASK.md
  
USECASE-XXX_NazwaScenariusza.md

BUG-XXX_OpisBledu.md
```

### ID Numeracja

- **EPIC**: `EPIC-001`, `EPIC-002`, ... (sekwencyjnie dla projektu)
- **STORY**: `STORY-001`, `STORY-002`, ... (sekwencyjnie w ramach EPIC)
- **TASK**: `TASK-101`, `TASK-102`, ... (100+ dla łatwego odróżnienia)
- **USECASE**: `USECASE-001`, `USECASE-002`, ... (sekwencyjnie w ramach TASK)
- **BUG**: `BUG-001`, `BUG-002`, ... (sekwencyjnie dla projektu)

## Przykładowy Flow: Nowa Funkcjonalność

### Krok 1: Użytkownik mówi "Dodaj rejestrację"

**Agent**: Rozpoznaję to jako STORY (funkcjonalność użytkownika)

### Krok 2: Sprawdź czy istnieje EPIC

```bash
# Szukaj w .ai/docs/work/
ls -la .ai/docs/work/ | grep EPIC
```

- Jeśli istnieje `EPIC-001-ZarzadzanieKontami` → użyj go
- Jeśli nie → utwórz nowy EPIC

### Krok 3: Utwórz STORY

```bash
mkdir -p .ai/docs/work/EPIC-001-ZarzadzanieKontami/STORY-001-Rejestracja
```

Skopiuj szablon:
```bash
cp .ai/docs/templates/STORY.md \
   .ai/docs/work/EPIC-001-ZarzadzanieKontami/STORY-001-Rejestracja/STORY.md
```

### Krok 4: Wypełnij STORY

```markdown
# STORY-001: Rejestracja użytkownika

## Metadane
- **ID**: `STORY-001`
- **Epic**: [EPIC-001: Zarządzanie kontami](../EPIC.md)
- **Status**: `new`

## User Story
**Jako** nowy użytkownik  
**Chcę** zarejestrować konto  
**Aby** korzystać z aplikacji

## Zadania (Tasks)
- [TASK-101: API endpoint POST /register](./TASK-101-ApiEndpoint/TASK.md)
- [TASK-102: Formularz Vue.js](./TASK-102-FormularzFrontend/TASK.md)
```

### Krok 5: Rozłóż na TASK-i

Dla każdego TASK:

```bash
mkdir -p .ai/docs/work/EPIC-001-ZarzadzanieKontami/STORY-001-Rejestracja/TASK-101-ApiEndpoint
cp .ai/docs/templates/TASK.md .ai/docs/work/.../TASK-101-ApiEndpoint/TASK.md
```

### Krok 6: Dodaj USECASE-y

```bash
cp .ai/docs/templates/USECASE.md \
   .ai/docs/work/.../TASK-101-ApiEndpoint/USECASE-001_PoprawnaRejestracja.md
```

### Krok 7: Implementuj i aktualizuj statusy

```markdown
# W TASK-101/TASK.md
- **Status**: `in-progress` → `implemented`

## Kryteria Akceptacji
- [x] Endpoint POST /register działa ✅
- [x] Walidacja email i password ✅
- [x] User zapisany w DB ✅
```

## Przykładowy Flow: Bug

### Użytkownik zgłasza: "Logowanie zwraca error 500"

1. **Utwórz BUG**:
```bash
cp .ai/docs/templates/BUG.md .ai/docs/work/BUG-042_Error500Logowanie.md
```

2. **Wypełnij szczegóły**:
```markdown
# BUG-042

## Metadane
- **ID**: `BUG-042`
- **Status**: `new`
- **Priorytet**: `critical`

## Kroki Reprodukcji
1. Otwórz /login
2. Wpisz email + złe hasło
3. Kliknij "Zaloguj"
4. Obserwuj error 500

## Faktyczny Rezultat
Status 500, w logach:
```
Call to a member function check() on null
```

3. **Utwórz TASK naprawczy**:
```bash
mkdir -p .ai/docs/work/TASK-105-NaprawaBleduLogowania
```

4. **Linkuj BUG → TASK**:
```markdown
# W BUG-042
## Powiązane Zadania
- [TASK-105: Naprawa error handling](./TASK-105-NaprawaBleduLogowania/TASK.md)

# W TASK-105
## Powiązane Zadania
- [BUG-042: Error 500 przy logowaniu](../BUG-042_Error500Logowanie.md)
```

## Aktualizacja Statusów

### Statusy dla EPIC/STORY/TASK

```
new → in-progress → implemented → deprecated/superseded
```

### Statusy dla BUG

```
new → in-progress → fixed → verified → rejected
```

### Statusy dla USECASE

```
defined → verified → failed → deprecated
```

### Jak aktualizować?

**Zawsze** gdy zmienia się stan zadania:

```markdown
# Przed rozpoczęciem pracy
- **Status**: `in-progress`

# Po zakończeniu
- **Status**: `implemented`

# Aktualizuj checkboxy
## Kryteria Akceptacji
- [x] Kryterium 1 ✅
- [x] Kryterium 2 ✅
```

## Tips dla AI Agentów

### ✅ DO:

1. **Zawsze twórz dokumentację** dla zadań >30 minut
2. **Linkuj powiązane zadania** hierarchicznie
3. **Aktualizuj statusy** w czasie rzeczywistym
4. **Dodawaj USECASE-y** dla każdej implementacji
5. **Dokumentuj BUG-i** nawet jeśli od razu naprawiasz
6. **Używaj checkboxów** `- [ ]` dla tracking postępu

### ❌ DON'T:

1. **Nie twórz EPIC** dla małych zadań (użyj STORY/TASK)
2. **Nie duplikuj** - sprawdź czy zadanie już istnieje
3. **Nie pomijaj USECASE-ów** - są kluczowe dla QA
4. **Nie zostawiaj pustych statusów** - zawsze aktualizuj
5. **Nie używaj generycznych tytułów** - bądź konkretny

## Integracja z Agentami Specjalistycznymi

### Agent Backend (Laravel)

Tworzysz TASK-i dla:
- API endpoints
- Models + migrations
- Controllers + validation
- Seeder + factories

**Przykład**:
```markdown
TASK-101: Implementacja API POST /register
- Controller: AuthController@register
- Request: RegisterRequest (validation)
- Model: User (Eloquent)
- Migration: create_users_table
```

### Agent Frontend (Vue)

Tworzysz TASK-i dla:
- Components Vue
- Views + routing
- Services (Axios)
- State management

**Przykład**:
```markdown
TASK-102: Formularz rejestracji Vue
- View: RegisterView.vue
- Component: RegisterForm.vue
- Service: auth.js
- Route: /register (guest guard)
```

### Agent QA (Testing)

Tworzysz USECASE-y dla:
- Scenariusze pozytywne
- Scenariusze negatywne
- Edge cases
- Security tests

**Przykład**:
```markdown
USECASE-001: Poprawna rejestracja (positive)
USECASE-002: Duplikat email (negative)
USECASE-003: Bardzo długie imię (edge case)
USECASE-004: SQL injection w email (security)
```

### Agent DevOps (Infrastructure)

Tworzysz TASK-i dla:
- Docker configuration
- CI/CD pipelines
- Deployment
- Monitoring

**Przykład**:
```markdown
TASK-201: Konfiguracja GitHub Actions dla testów
- Workflow: .github/workflows/tests.yml
- Jobs: backend-tests, frontend-tests, e2e-tests
```

## Bounded Context Mapping

Każdy EPIC powinien należeć do jednego Bounded Context:

```markdown
# Bounded Contexts w Kalendarz MVP

- **UserManagement**: EPIC-001 (Konta, Auth)
- **EventManagement**: EPIC-002 (Wydarzenia, Daty)
- **TemplateManagement**: EPIC-003 (Szablony)
- **Search**: EPIC-004 (Wyszukiwarka)
- **Infrastructure**: EPIC-005 (Docker, CI/CD)
```

## Quick Reference

### Minimalne wymagania dla każdego szablonu

**EPIC**:
- ID, Tytuł, Bounded Context, Status
- Cel Biznesowy
- Lista STORY

**STORY**:
- ID, Epic, Tytuł, Status
- User Story (Jako/Chcę/Aby)
- Lista TASK

**TASK**:
- ID, Story, Epic, Tytuł, Status
- Opis techniczny
- Kryteria Akceptacji (checkboxy)

**USECASE**:
- ID, Task, Tytuł, Status, Test Type
- Kroki
- Oczekiwany Rezultat

**BUG**:
- ID, Tytuł, Status, Priorytet
- Kroki Reprodukcji
- Oczekiwany vs Faktyczny Rezultat

---

## Przykład Kompletnego Flow

```
Użytkownik: "Dodaj rejestrację użytkownika"

Agent → Rozpoznaje: STORY (funkcjonalność)
Agent → Tworzy: EPIC-001 (jeśli nie istnieje)
Agent → Tworzy: STORY-001-Rejestracja
Agent → Rozłamuje na TASK-i:
  - TASK-101: API backend
  - TASK-102: Formularz frontend
  - TASK-103: Email weryfikacyjny
Agent → Dla każdego TASK tworzy USECASE-y:
  - USECASE-001: Pozytywny scenariusz
  - USECASE-002: Duplikat email
  - USECASE-003: Słabe hasło
Agent → Implementuje po kolei
Agent → Aktualizuje statusy
Agent → Raportuje użytkownikowi: "STORY-001 implemented ✅"
```
