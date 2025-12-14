Standard organizacji dokumentacji projektowej (Documentation as Code)
📘 Założenia nadrzędne
Hierarchia drzewiasta jest utrzymana (EPIC → STORY → TASK → SUBTASK/BUG/ENHANCEMENT/USECASE).


Kontekst biznesowy jest częścią nazwy katalogu (np. EPIC-001-UserManagement).


Każdy poziom ma plik główny (_epic.md, _story.md) z metadanymi.


Linki między plikami używają ścieżek względnych (./, ../), które są odporne na zmiany wyższych katalogów,
dzięki czemu relacje nie łamią się, gdy przenosisz cały Epic/Story.


Wprowadzamy USECASE.md — pliki opisujące scenariusze testowe i zachowania użytkownika powiązane z Taskiem.



🧭 Struktura katalogów
/src/
└── UserManagement/
└── docs/
└── EPIC-001-UserAccounts/
├── _epic.md
├── STORY-001-Registration/
│    ├── _story.md
│    ├── TASK-001-CreateAccountAPI/
│    │    ├── TASK.md
│    │    ├── USECASE-001_SuccessfulRegistration.md
│    │    ├── USECASE-002_DuplicateEmail.md
│    │    └── BUG-001_InternalServerError.md
│    └── TASK-002-RegistrationFormFrontend/
│         ├── TASK.md
│         └── USECASE-003_InvalidEmailValidation.md
├── STORY-002-Login/
│    ├── _story.md
│    ├── TASK-003-LoginForm/
│    └── TASK-004-JWTValidation/
└── STORY-003-ProfileManagement/
├── _story.md
└── ENHANCEMENT-001_ProfilePictureUpload.md

🔹 Zasady nazw katalogów:
Typ
Format
Przykład
EPIC
EPIC-<numer>-<kontekstBiznesowy>
EPIC-001-UserAccounts
STORY
STORY-<numer>-<opisKrótkiegoCelu>
STORY-001-Registration
TASK
TASK-<numer>-<nazwaTechniczna>
TASK-001-CreateAccountAPI
USECASE
USECASE-<numer>_<opis>
USECASE-001_SuccessfulRegistration


🔗 Linkowanie odporne na zmiany struktury wyżej
W Markdown można stosować ścieżki względne, np.:
[Powiązany task](../TASK-002-RegistrationFormFrontend/TASK.md)
[Powiązana historia](../../STORY-001-Registration/_story.md)

➡️ Zalety:
Jeśli przeniesiesz cały folder EPIC-001-UserAccounts, wszystkie linki nadal działają,
ponieważ odnoszą się relatywnie do pliku źródłowego.


IDE (VS Code, IntelliJ, Obsidian) poprawnie rozumie ścieżki ../ i ./.



🧩 Struktura plików
1. _epic.md
---
id: EPIC-001
title: "Nowy system zarządzania kontami użytkowników"
bounded_context: UserManagement
status: in-progress
description: |
Epic obejmuje funkcjonalności: rejestracja, logowanie, zarządzanie profilem, odzyskiwanie hasła.
stories:
- [Rejestracja nowego użytkownika](./STORY-001-Registration/_story.md)
- [Logowanie użytkownika](./STORY-002-Login/_story.md)
- [Zarządzanie profilem](./STORY-003-ProfileManagement/_story.md)
---


2. _story.md
---
id: STORY-001
epic: EPIC-001
title: "Rejestracja nowego użytkownika"
status: in-progress
description: |
Użytkownik może założyć konto, podając podstawowe dane i potwierdzając e-mail.
tasks:
- [API do tworzenia konta](./TASK-001-CreateAccountAPI/TASK.md)
- [Formularz frontendowy rejestracji](./TASK-002-RegistrationFormFrontend/TASK.md)
---


3. TASK.md
---
id: TASK-001
type: task
title: "Endpoint REST API do tworzenia konta użytkownika"
status: implemented
story: STORY-001
epic: EPIC-001
bounded_context: UserManagement
related_issues:
- [Walidacja formularza frontendowego](../TASK-002-RegistrationFormFrontend/TASK.md)
  use_cases:
- [Udana rejestracja użytkownika](./USECASE-001_SuccessfulRegistration.md)
- [Duplikat adresu e-mail](./USECASE-002_DuplicateEmail.md)
  description: |
  Utworzenie endpointu POST `/api/v1/users/register`, walidującego dane i tworzącego konto w bazie.
  acceptance_criteria:
- [x] Obsługa walidacji e-maila
- [x] Zwracanie komunikatu 409 przy duplikacie
---


4. USECASE-001_SuccessfulRegistration.md
---
id: USECASE-001
title: "Udana rejestracja użytkownika"
task: TASK-001
type: usecase
status: defined
description: |
Scenariusz pozytywny — użytkownik rejestruje konto z poprawnymi danymi.
steps:
1. Użytkownik otwiera formularz rejestracji.
2. Wprowadza poprawne dane.
3. System waliduje dane i tworzy rekord użytkownika.
   expected_result: |
   Konto zostaje utworzone, użytkownik otrzymuje e-mail z potwierdzeniem.
---


5. USECASE-002_DuplicateEmail.md
---
id: USECASE-002
title: "Rejestracja z duplikatem e-maila"
task: TASK-001
type: usecase
status: defined
description: |
Scenariusz negatywny — użytkownik próbuje zarejestrować konto z adresem e-mail już istniejącym.
steps:
1. Użytkownik wypełnia formularz rejestracji istniejącym adresem.
2. Backend sprawdza kolizję e-maila.
3. System zwraca kod 409 (Conflict).
   expected_result: |
   Użytkownik otrzymuje komunikat "Adres e-mail już istnieje w systemie."
---


🧠 Zasady powiązań
Relacja
Realizowana przez
Kierunek
EPIC → STORY
stories: w _epic.md
nadrzędny → podrzędny
STORY → TASK
tasks: w _story.md
nadrzędny → podrzędny
TASK → USECASE
use_cases: w TASK.md
nadrzędny → podrzędny
TASK ↔ TASK
related_issues:
obustronna
TASK ↔ BUG
related_issues:
obustronna


📂 Dodatkowe korzyści
✅ Zachowujesz hierarchię i kontekst biznesowy.
✅ Ścieżki względne sprawiają, że linki nie łamią się przy przenoszeniu.
✅ IDE pokazuje pełne tytuły w linkach (nie tylko ID).
✅ Use Case’y dokumentują testowalne scenariusze i są automatycznie powiązane z Taskami.
✅ W przyszłości można generować automatyczny raport z pokrycia testami (TASK → USECASE).

🧩 Podsumowanie konwencji
Typ
Prefix
Katalog zawiera
Plik główny
EPIC
EPIC-###-Context
Story
_epic.md
STORY
STORY-###-Topic
Task
_story.md
TASK
TASK-###-Action
UseCase, Bug
TASK.md
USECASE
USECASE-###_Description
(none)
sam plik
BUG
BUG-###_Description
(none)
sam plik


🔧 Opcjonalne automatyzacje
Skrypt docs/link-validator.js — sprawdza poprawność wszystkich linków ./ i ../ oraz brakujące pliki.


Skrypt docs/usecase-coverage.js — analizuje, które Taski nie mają przypisanego use_cases:.


CI check — blokuje merge’a, jeśli YAML nie zawiera id lub status.