📘 /docs/_templates/_epic.md
---
id: EPIC-XXX
title: "Tytuł epica"
bounded_context: NazwaBoundedContextu
status: new | in-progress | implemented | deprecated | superseded
owner: Imię Nazwisko / zespół
description: |
Krótki opis celu biznesowego, jaki realizuje ten epic.
Przykład: Epic obejmuje procesy zarządzania kontami użytkowników: rejestracja, logowanie, profil, odzyskiwanie hasła.
stories:
- [Nazwa Story 1](./STORY-001-Nazwa/_story.md)
- [Nazwa Story 2](./STORY-002-Nazwa/_story.md)
  notes: |
  Dodatkowe informacje lub decyzje architektoniczne.
---

📁 Zalecany katalog dla epica:
/src/<BoundedContext>/docs/EPIC-XXX-<ContextName>/

🧩 /docs/_templates/_story.md
---
id: STORY-XXX
epic: EPIC-XXX
title: "Tytuł Story"
status: new | in-progress | implemented | deprecated | superseded
description: |
Opis funkcjonalności lub scenariusza użytkownika, który realizuje ta historia.
Przykład: Użytkownik może zarejestrować konto, podając dane i potwierdzając e-mail.
tasks:
- [Nazwa Taska 1](./TASK-001-Nazwa/TASK.md)
- [Nazwa Taska 2](./TASK-002-Nazwa/TASK.md)
  notes: |
  Wymagania niefunkcjonalne, zależności, uwagi do implementacji.
---

📁 Zalecany katalog dla story:
/src/<BoundedContext>/docs/EPIC-XXX-<ContextName>/STORY-XXX-<StoryName>/

🛠 /docs/_templates/TASK.md
---
id: TASK-XXX
type: task
title: "Tytuł zadania"
status: new | in-progress | implemented | deprecated | superseded
story: STORY-XXX
epic: EPIC-XXX
bounded_context: NazwaBoundedContextu
owner: Imię Nazwisko / zespół
related_issues:
- [Powiązany Task](../TASK-YYY-Nazwa/TASK.md)
- [Powiązany Bug](../BUG-ZZZ_NazwaBuga.md)
  use_cases:
- [Scenariusz testowy 1](./USECASE-001_NazwaScenariusza.md)
- [Scenariusz testowy 2](./USECASE-002_NazwaScenariusza.md)
  description: |
  Opis techniczny zadania, kontekst, wymagania implementacyjne.
  acceptance_criteria:
- [ ] Kryterium 1
- [ ] Kryterium 2
  notes: |
  Dodatkowe informacje, zależności lub decyzje projektowe.
---

📁 Zalecany katalog dla taska:
/src/<BoundedContext>/docs/EPIC-XXX-<ContextName>/STORY-XXX-<StoryName>/TASK-XXX-<TaskName>/

🧪 /docs/_templates/USECASE.md
---
id: USECASE-XXX
title: "Tytuł scenariusza testowego / przypadek użycia"
task: TASK-XXX
type: usecase
status: defined | verified | failed | deprecated
description: |
Krótki opis kontekstu tego przypadku użycia.
Przykład: Scenariusz pozytywny — użytkownik rejestruje konto poprawnie.
steps:
1. Krok 1 – np. Użytkownik wypełnia formularz rejestracji.
2. Krok 2 – np. System waliduje dane.
3. Krok 3 – np. Konto zostaje utworzone.
   expected_result: |
   Oczekiwany rezultat działania systemu po wykonaniu scenariusza.
   actual_result: |
   (Wypełniane po testach) — rzeczywisty rezultat testu.
   related_issues:
- [Powiązany bug](../BUG-XXX_NazwaBuga.md)
  notes: |
  Uwagi, wyniki testów, dane wejściowe, środowisko testowe.
---

📁 Zalecany katalog dla use case:
/src/<BoundedContext>/docs/EPIC-XXX-<ContextName>/STORY-XXX-<StoryName>/TASK-XXX-<TaskName>/

🐞 /docs/_templates/BUG.md (opcjonalny uzupełniający szablon)
---
id: BUG-XXX
title: "Opis błędu"
status: new | in-progress | fixed | verified | rejected
type: bug
story: STORY-XXX
task: TASK-XXX
epic: EPIC-XXX
bounded_context: NazwaBoundedContextu
description: |
Szczegółowy opis błędu, sposób reprodukcji, logi, środowisko testowe.
steps_to_reproduce:
1. ...
2. ...
   expected_result: |
   Oczekiwane zachowanie systemu.
   actual_result: |
   Faktyczne zachowanie systemu.
   related_issues:
- [Task naprawczy](../TASK-YYY-NazwaNaprawy/TASK.md)
- [Use Case negatywny](../USECASE-002_NazwaScenariusza.md)
  notes: |
  Dodatkowe informacje o priorytecie, ryzyku lub środowisku.
---


🧭 Struktura docelowa z tymi szablonami (przykład)
/src/UserManagement/docs/
└── EPIC-001-UserAccounts/
├── _epic.md
├── STORY-001-Registration/
│    ├── _story.md
│    ├── TASK-001-CreateAccountAPI/
│    │    ├── TASK.md
│    │    ├── USECASE-001_SuccessfulRegistration.md
│    │    └── USECASE-002_DuplicateEmail.md
│    └── TASK-002-FrontendForm/
│         └── TASK.md
└── STORY-002-Login/
├── _story.md
└── TASK-003-ValidateJWT/
└── TASK.md


🧠 Dodatkowe rekomendacje
✅ Konwencja nazw ID:
EPIC-### — unikalny numer w ramach kontekstu (np. EPIC-001).


STORY-### — numer w obrębie epica.


TASK-### — numer w obrębie story.


USECASE-### — numer w obrębie taska.


BUG-### — numer w obrębie story/task.


✅ Linkowanie:
zawsze relatywnie, np. ../TASK-001-CreateAccountAPI/TASK.md


w opisach linki w formacie:

[Udana rejestracja użytkownika](./USECASE-001_SuccessfulRegistration.md)


✅ Utrzymanie spójności:
można dodać w CI prosty validator YAML + linków,
np. skrypt w Node.js, który sprawdza:


poprawność pól id, status, story, epic


czy wszystkie linki względne wskazują na istniejące pliki.
