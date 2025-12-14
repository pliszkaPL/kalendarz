🎯 EPIC: "Nowy system zarządzania kontami użytkowników"
Cel: Umożliwienie rejestracji, logowania, zarządzania profilem, odzyskiwania hasła itp.

🧩 STORY 1: "Rejestracja nowego użytkownika"
Sub-task: Zaprojektowanie formularza rejestracji


Sub-task: Walidacja danych użytkownika po stronie frontend


Sub-task: Endpoint REST API do tworzenia konta


Bug: Błąd przy rejestracji – użytkownik dostaje 500 przy duplikacie e-maila



🧩 STORY 2: "Logowanie użytkownika"
Sub-task: Formularz logowania


Sub-task: Backend: walidacja tokenu JWT


Sub-task: Dodanie logowania do systemu audytu



🧩 STORY 3: "Zarządzanie profilem użytkownika"
Sub-task: Formularz edycji danych osobowych


Sub-task: Backend: aktualizacja danych użytkownika


Enhancement: Dodanie możliwości zmiany zdjęcia profilowego



🧩 STORY 4: "Resetowanie hasła"
Sub-task: Formularz „zapomniałem hasła”


Sub-task: Wysyłka e-maila z tokenem


Sub-task: Frontend – formularz resetu hasła


Bug: Link resetu nie działa, jeśli użytkownik kliknie go dwukrotnie



🧠 SPIKE: "Czy warto wdrożyć 2FA dla użytkowników premium?"
Cel: Zbadać, jak wdrożenie 2FA wpłynie na UX, czas wdrożenia i bezpieczeństwo



🛠 TASK: "Stworzenie schematu bazy danych dla kont użytkowników"
Sub-task: Tabela users


Sub-task: Tabela user_sessions


Improvement: Dodanie timestampów modyfikacji i stworzenia konta



🧯 INCIDENT: "Niedostępność logowania w godzinach szczytu"
Zgłoszone przez monitoring systemu – użytkownicy nie mogą się zalogować


Problem: Niewydolność endpointu logowania przy dużym ruchu


Analiza logów pokazuje brak indeksu w bazie danych


Stworzono Bug: "Brak indeksu na kolumnie e-mail w tabeli users"


W wyniku tego powstał Task: "Dodanie indeksu do kolumny email"



🔁 ENHANCEMENT: "Dodanie logowania przez Google i Apple ID"
Niezwiązane bezpośrednio z podstawową funkcją logowania, ale zwiększa UX


Planowane po podstawowym wdrożeniu


Obejmuje:


Integrację z OAuth2


Nowe UI przycisków


Testy regresji bezpieczeństwa



🔗 Schemat zależności
Epic
├── Story: Rejestracja
│   └── Bug: Duplikat e-mail
├── Story: Logowanie
│   └── Incident -> Problem -> Bug + Task
├── Story: Reset hasła
│   └── Bug: Token nie działa przy kliknięciu 2x
├── Story: Edycja profilu
│   └── Enhancement: Zdjęcie profilowe
├── Task: Baza danych
│   └── Improvement: Timestamps
├── Spike: 2FA analiza
└── Enhancement: Logowanie Google/Apple
