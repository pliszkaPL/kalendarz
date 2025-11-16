```markdown name=.ai/prd.md
# Dokument wymagań produktu (PRD) - Kalendarz MVP
Data: 2025-11-16
Autor: pliszkaPL

## 1. Przegląd produktu
Kalendarz MVP to aplikacja internetowa zaprojektowana, aby pomóc użytkownikom w skutecznym zarządzaniu ważnymi datami i wydarzeniami. Głównym celem produktu jest rozwiązanie problemu zapominania o istotnych terminach poprzez zapewnienie scentralizowanego narzędzia do ich zapisywania i organizowania. Kluczową funkcją aplikacji jest innowacyjny system szablonów, który pozwala na automatyzację tworzenia i wizualizację wpisów w kalendarzu. Użytkownicy mogą definiować własne szablony, które określają nie tylko wygląd (ikony, kolory), ale także logikę wyświetlania danych (np. automatyczne obliczanie wieku, odliczanie dni).

Aplikacja w wersji MVP będzie dostępna jako aplikacja webowa (frontend: Vue.js 3, backend: Laravel).

## 2. Problem użytkownika
Główny problem, jaki rozwiązuje aplikacja, to tendencja do zapominania o ważnych datach i wydarzeniach. Użytkownicy potrzebują jednego, niezawodnego miejsca, w którym mogą nie tylko przechowywać informacje o wydarzeniach, ale także personalizować ich wygląd i sposób prezentacji, aby kluczowe informacje były natychmiast widoczne i łatwe do przyswojenia. Istniejące rozwiązania często nie oferują wystarczającej elastyczności w zakresie automatyzacji i personalizacji powtarzalnych wpisów.

## 3. Wymagania funkcjonalne

### FR-1: Zarządzanie Użytkownikami
- FR-1.1: Użytkownik musi mieć możliwość rejestracji nowego konta.
- FR-1.2: Użytkownik musi mieć możliwość logowania się do swojego konta.
- FR-1.3: System uwierzytelniania będzie oparty o Laravel Sanctum.
- FR-1.4: Dane użytkowników i aplikacji będą przechowywane w bazie danych SQLite.

### FR-2: Zarządzanie Wpisami (Wydarzeniami)
- FR-2.1: Użytkownik może tworzyć, odczytywać, aktualizować i usuwać wpisy w kalendarzu.
- FR-2.2: Każdy wpis posiada standardowe pola `tytuł` i `opis`.
- FR-2.3: Każdy wpis jest powiązany z dokładnie jednym szablonem.

### FR-3: System Szablonów
- FR-3.1: Użytkownik może tworzyć, edytować, archiwizować i zarządzać szablonami.
- FR-3.2: Szablon definiuje wygląd wpisu (ikona, kolor tła, kolor tekstu) oraz logikę prezentacji danych.
- FR-3.3: Użytkownik może definiować w szablonie niestandardowe pola (zmienne, np. `{imie-nazwisko}`, `{kwota}`).
- FR-3.4: Szablon posiada pole "Format wyświetlania", które pozwala na łączenie tekstu stałego ze zmiennymi (np. "Urodziny {imie-nazwisko} ({wiek})").
- FR-3.5: Logika szablonu opiera się na predefiniowanych operacjach do wyboru z listy (np. "Oblicz wiek", "Pokaż dni do daty", "Wstaw tekst").
- FR-3.6: Edycja szablonu powoduje natychmiastową aktualizację wizualną wszystkich wpisów, które go używają.
- FR-3.7: Przy próbie edycji używanego szablonu, użytkownik ma możliwość zatwierdzenia zmian lub stworzenia nowej wersji szablonu, archiwizując starą.
- FR-3.8: Zarchiwizowane szablony pozostają przypisane do istniejących wpisów, ale nie można ich użyć do tworzenia nowych.
- FR-3.9: Aplikacja zawiera 20 predefiniowanych szablonów (np. Podatki, Urodziny, Śmieci).

### FR-4: Wpisy Powtarzalne
- FR-4.1: Użytkownik może stworzyć wpis przypisany do wielu dat.
- FR-4.2: System umożliwia definiowanie reguł powtarzania (np. co X dni/tygodni/miesięcy, w konkretny dzień tygodnia/miesiąca).
- FR-4.3: System umożliwia ręczny wybór wielu dowolnych dat dla jednego wpisu.
- FR-4.4: Edycja dowolnego wystąpienia wpisu powtarzalnego powoduje aktualizację wszystkich jego wystąpień.

### FR-5: Interfejs Użytkownika
- FR-5.1: Głównym widokiem aplikacji jest siatka kalendarza wyświetlająca cały miesiąc.
- FR-5.2: W dniach z wydarzeniami, wpisy są wyświetlane jeden pod drugim.
- FR-5.3: Istnieje dedykowana sekcja w ustawieniach do zarządzania szablonami.
- FR-5.4: Użytkownik ma możliwość szybkiego dodania/edycji szablonu poprzez okno modalne bezpośrednio z widoku kalendarza.
- FR-5.5: Edytor szablonów zapewnia reaktywny podgląd "na żywo", pokazujący jak będzie wyglądał kafelek wydarzenia oraz formularz dodawania wpisu.

### FR-6: Wyszukiwarka
- FR-6.1: Aplikacja posiada funkcję wyszukiwania wpisów.
- FR-6.2: Wyszukiwanie obejmuje treść wpisów (tytuł, opis, dane ze zmiennych) oraz datę.

## 4. Granice produktu

### W zakresie (In Scope)
- Wszystkie funkcjonalności opisane w sekcji 3.
- System logowania i rejestracji.
- Pełna obsługa tworzenia, edycji i zarządzania wpisami oraz szablonami.
- Tworzenie wpisów powtarzalnych.
- Interfejs webowy aplikacji.

### Poza zakresem (Out of Scope)
- Udostępnianie wydarzeń i szablonów pomiędzy użytkownikami.
- Zaawansowane zarządzanie kontami użytkowników (np. role, uprawnienia).
- Powiadomienia "push" lub e-mail.
- Import wydarzeń z zewnętrznych kalendarzy (np. Google Calendar, iCal).
- Aplikacje mobilne (natywne).
- Bardziej złożona logika edycji wpisów powtarzalnych (np. edycja tylko przyszłych wydarzeń).

## 5. Historyjki użytkowników

### Uwierzytelnianie i Zarządzanie Kontem
- ID: US-001
- Tytuł: Rejestracja nowego użytkownika
- Opis: Jako nowy użytkownik, chcę mieć możliwość założenia konta w aplikacji przy użyciu adresu e-mail i hasła, aby móc zapisywać swoje dane.
- Kryteria akceptacji:
  - Formularz rejestracji zawiera pola na adres e-mail i hasło (z potwierdzeniem).
  - System waliduje poprawność adresu e-mail.
  - System wymaga bezpiecznego hasła.
  - Po pomyślnej rejestracji jestem automatycznie zalogowany i przekierowany do głównego widoku kalendarza.

- ID: US-002
- Tytuł: Logowanie do aplikacji
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się na swoje konto, aby uzyskać dostęp do moich wydarzeń i szablonów.
- Kryteria akceptacji:
  - Formularz logowania zawiera pola na adres e-mail i hasło.
  - W przypadku podania błędnych danych, wyświetlany jest stosowny komunikat.
  - Po pomyślnym zalogowaniu jestem przekierowany do głównego widoku kalendarza.

### Zarządzanie Szablonami
- ID: US-003
- Tytuł: Tworzenie nowego szablonu
- Opis: Jako użytkownik, chcę stworzyć nowy szablon od zera, definiując jego nazwę, wygląd (ikonę, kolory) oraz własne pola (zmienne), aby móc go używać do tworzenia spersonalizowanych wpisów.
- Kryteria akceptacji:
  - W sekcji "Zarządzanie szablonami" istnieje opcja "Dodaj nowy szablon".
  - Mogę zdefiniować nazwę szablonu.
  - Mogę wybrać ikonę i kolory dla szablonu.
  - Mogę dodać niestandardowe pola (zmienne), określając ich nazwę (np. `imie`) i typ operacji (np. "Wstaw tekst").
  - Mogę skonstruować "Format wyświetlania", łącząc tekst stały ze zdefiniowanymi zmiennymi.
  - Podczas tworzenia szablonu widzę jego podgląd na żywo.
  - Po zapisaniu szablon jest dostępny na liście moich szablonów.

- ID: US-004
- Tytuł: Edycja istniejącego szablonu
- Opis: Jako użytkownik, chcę edytować istniejący szablon, aby zaktualizować jego wygląd lub logikę, a zmiana ta powinna automatycznie odzwierciedlić się we wszystkich wpisach, które go używają.
- Kryteria akceptacji:
  - Mogę wybrać szablon z listy i przejść do jego edycji.
  - Mogę zmienić wszystkie parametry szablonu (nazwę, wygląd, zmienne, format wyświetlania).
  - Przed zapisaniem zmian, system wyświetla ostrzeżenie o globalnym charakterze modyfikacji.
  - Po zatwierdzeniu zmian, wszystkie wpisy w kalendarzu używające tego szablonu zostają natychmiast zaktualizowane wizualnie.

- ID: US-005
- Tytuł: Archiwizacja szablonu przez stworzenie nowej wersji
- Opis: Jako użytkownik, podczas edycji szablonu, chcę mieć możliwość stworzenia jego nowej wersji, aby zachować stary wygląd dla istniejących wpisów, a nowy szablon stosować do przyszłych.
- Kryteria akceptacji:
  - W widoku edycji szablonu istnieje opcja "Zapisz jako nową wersję".
  - Po wybraniu tej opcji, tworzony jest nowy szablon (kopia edytowanego), a stary szablon otrzymuje status "zarchiwizowany".
  - Zarchiwizowane szablony nie pojawiają się na liście wyboru podczas tworzenia nowego wpisu.
  - Stare wpisy nadal poprawnie wyświetlają dane przy użyciu zarchiwizowanego szablonu.

### Zarządzanie Wpisami
- ID: US-006
- Tytuł: Tworzenie nowego wpisu z użyciem szablonu
- Opis: Jako użytkownik, chcę dodać nowy wpis do kalendarza, wybierając jeden z moich szablonów, aby szybko wypełnić wymagane dane w dedykowanym formularzu.
- Kryteria akceptacji:
  - W widoku kalendarza istnieje przycisk "Dodaj wpis".
  - W formularzu dodawania wpisu mogę wybrać szablon z listy (w tym predefiniowane i własne).
  - Po wybraniu szablonu, formularz dynamicznie wyświetla pola do wypełnienia, zgodnie ze zmiennymi zdefiniowanymi w szablonie.
  - Mogę również uzupełnić standardowe pola `tytuł` i `opis`.
  - Po zapisaniu, wpis pojawia się w kalendarzu, sformatowany zgodnie z szablonem.

- ID: US-007
- Tytuł: Tworzenie wpisu powtarzalnego
- Opis: Jako użytkownik, chcę stworzyć wpis, który będzie pojawiał się w kalendarzu cyklicznie (np. co tydzień) lub w kilku ręcznie wybranych datach.
- Kryteria akceptacji:
  - W formularzu dodawania wpisu dostępna jest sekcja "Powtarzanie".
  - Mogę wybrać jedną z predefiniowanych reguł (np. co X dni/tygodni, w drugą sobotę miesiąca).
  - Mogę wybrać opcję "Wybierz daty ręcznie" i zaznaczyć na kalendarzu wiele dni.
  - Po zapisaniu, wpis pojawia się we wszystkich wybranych datach.

- ID: US-008
- Tytuł: Edycja wpisu powtarzalnego
- Opis: Jako użytkownik, chcę edytować wpis powtarzalny, a zmiana ta powinna dotyczyć wszystkich jego wystąpień.
- Kryteria akceptacji:
  - Po kliknięciu na dowolne wystąpienie wpisu powtarzalnego i wybraniu opcji "Edytuj", mogę zmienić jego dane (tytuł, opis, dane szablonu).
  - Po zapisaniu zmian, wszystkie wystąpienia tego wpisu (przeszłe i przyszłe) zostają zaktualizowane.

- ID: US-009
- Tytuł: Wyszukiwanie wpisów
- Opis: Jako użytkownik, chcę szybko znaleźć konkretny wpis w kalendarzu, wpisując jego nazwę lub datę.
- Kryteria akceptacji:
  - W głównym interfejsie znajduje się pole wyszukiwania.
  - Mogę wpisać fragment tekstu, a system wyświetli listę pasujących wpisów (przeszukując tytuły, opisy i dane szablonów).
  - Mogę wpisać datę, aby zobaczyć wszystkie wpisy z danego dnia.

## 6. Metryki sukcesu
- 6.1. Wskaźnik adopcji szablonów: Przynajmniej 90% wszystkich nowo tworzonych wpisów w aplikacji musi korzystać z szablonu (wliczając w to domyślny szablon "Czysty wpis"). Pomiar będzie realizowany przez wewnętrzną analitykę aplikacji.
```