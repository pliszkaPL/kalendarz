<conversation_summary>
<decisions>
1.  **Uwierzytelnianie:** Aplikacja będzie korzystać z gotowego panelu logowania i rejestracji opartego o Laravel Sanctum. Dane będą przechowywane w bazie danych SQLite.
2.  **Architektura Technologiczna:** Aplikacja będzie aplikacją webową zbudowaną przy użyciu Vue.js 3, Tailwind CSS (frontend) oraz Laravel (backend).
3.  **Funkcja Szablonów:** Szablony są kluczową funkcją. Definiują one zarówno logikę (np. obliczanie wieku) jak i wygląd wpisu (ikony, kolory). Użytkownik, tworząc szablon, może definiować własne pola, które stają się zmiennymi do wykorzystania w formatowaniu wyświetlania.
4.  **Tworzenie Wpisów z Szablonu:** Po wybraniu szablonu, interfejs dynamicznie generuje formularz z polami zdefiniowanymi w tym szablonie, które użytkownik musi uzupełnić.
5.  **Zarządzanie Szablonami:** Użytkownik może zarządzać szablonami w dedykowanej sekcji w ustawieniach. Możliwe jest również szybkie tworzenie i edycja szablonów poprzez modal bezpośrednio z widoku kalendarza.
6.  **Edycja i Archiwizacja Szablonów:** Przy próbie edycji używanego szablonu, system wyświetli podgląd "przed" i "po". Użytkownik może zatwierdzić zmianę (co zaktualizuje wszystkie wpisy) lub stworzyć nową wersję szablonu. W takim przypadku stary szablon jest archiwizowany – staje się niemożliwy do wyboru dla nowych wpisów, ale wciąż jest przypisany do starych.
7.  **Wpisy Powtarzalne:** Funkcja "grup" została zdefiniowana jako pojedynczy wpis przypisany do wielu dat. Użytkownik będzie miał rozbudowane opcje powtarzalności (co X dni/tygodni, w dany dzień miesiąca) oraz możliwość ręcznego wyboru wielu dat.
8.  **Edycja Wpisów Powtarzalnych:** Dla uproszczenia w MVP, edycja dowolnego wystąpienia wpisu powtarzalnego modyfikuje wszystkie jego wystąpienia (zarówno przeszłe, jak i przyszłe).
9.  **Widok Kalendarza:** Główny widok to siatka miesiąca, która wyświetla wszystkie wydarzenia dla danego dnia, jedno pod drugim. Wyświetlana treść jest formatowana przez szablon.
10. **Wyszukiwarka:** MVP będzie zawierać prostą wyszukiwarkę pozwalającą na przeszukiwanie wpisów po dacie oraz treści.
11. **Wbudowane Szablony:** Aplikacja zostanie wydana z zestawem 20 gotowych szablonów.
12. **Brak Importu:** MVP nie będzie zawierać funkcji importu wydarzeń z zewnętrznych kalendarzy.
    </decisions>

<matched_recommendations>
1.  **Predefiniowane Operacje w Szablonach:** Wprowadzenie listy predefiniowanych operacji (np. Oblicz wiek, Pokaż dni do daty, Wstaw tekst) uprości tworzenie logiki szablonu.
2.  **Elastyczne Formatowanie Wyglądu:** Szablon powinien posiadać jedno pole "Format wyświetlania", gdzie użytkownik może swobodnie mieszać tekst i zmienne, aby w pełni kontrolować wygląd kafelka w kalendarzu.
3.  **Ostrzeżenie przy Edycji Szablonu:** System musi wyraźnie ostrzegać użytkownika przed globalnymi zmianami podczas edycji szablonu.
4.  **Uproszczona Logika Edycji Wpisów Powtarzalnych:** Zgodnie z decyzją, dla MVP edycja jednego wpisu z serii modyfikuje wszystkie, co upraszcza implementację.
5.  **Dedykowana Sekcja Zarządzania Szablonami:** Stworzenie osobnej zakładki do zarządzania szablonami jest kluczowe dla użyteczności aplikacji.
6.  **Gotowe Szablony na Start:** Udostępnienie bogatej biblioteki gotowych szablonów jest kluczowe dla dobrego pierwszego wrażenia i szybkiego wdrożenia się użytkownika.
7.  **Podgląd na Żywo:** Zapewnienie reaktywnego podglądu "na żywo" podczas tworzenia i edytowania szablonu znacząco poprawi doświadczenie użytkownika.
8.  **Prosta Wyszukiwarka w MVP:** Dodanie nawet prostej wyszukiwarki od początku zwiększy użyteczność aplikacji.
    </matched_recommendations>

<prd_planning_summary>
Poniższe podsumowanie stanowi finalną podstawę do stworzenia dokumentu wymagań produktowych (PRD) dla aplikacji Kalendarz (MVP).

**a. Główne wymagania funkcjonalne produktu:**
1.  **Zarządzanie Użytkownikami:** System logowania i rejestracji (Laravel Sanctum).
2.  **CRUD Wpisów:** Użytkownik może tworzyć, odczytywać, aktualizować i usuwać wpisy w kalendarzu. Każdy wpis posiada standardowe pola `tytuł` i `opis`.
3.  **System Szablonów:**
    *   Użytkownik może tworzyć, edytować, archiwizować i zarządzać szablonami. Zarchiwizowane szablony nie są dostępne do wyboru dla nowych wpisów.
    *   Szablon może definiować dodatkowe, własne pola (np. `imię`, `kwota`), które użytkownik wypełnia przy tworzeniu wpisu.
    *   Szablon posiada pole "Format wyświetlania", które pozwala mieszać tekst ze zmiennymi (np. "Urodziny {imię} ({wiek})!").
    *   Logika szablonu opiera się na predefiniowanych operacjach (np. "Oblicz wiek", "Pokaż dni do daty").
4.  **Wpisy Powtarzalne:**
    *   Możliwość tworzenia wpisu przypisanego do wielu dat poprzez zaawansowane reguły (np. co X tygodni) lub ręczny wybór dni.
    *   Edycja dowolnego wystąpienia wpisu powtarzalnego powoduje aktualizację wszystkich jego wystąpień.
5.  **Interfejs Użytkownika:**
    *   Główny widok kalendarza w formie siatki miesięcznej.
    *   Możliwość zarządzania szablonami w ustawieniach oraz przez modal w widoku głównym.
    *   Reaktywny edytor szablonów z podglądem na żywo.
6.  **Wyszukiwarka:** Funkcja wyszukiwania wpisów po treści i dacie.

**b. Kluczowe historie użytkownika i ścieżki korzystania:**
*   **Tworzenie Szablonu:** *Jako użytkownik, chcę stworzyć nowy szablon "Urodziny", zdefiniować w nim pole "Imię" i "Data urodzenia", ustawić logikę obliczania wieku (zmienna `{wiek}`) oraz ustalić format wyświetlania jako "🎂 Urodziny {Imię} ({wiek})", aby móc go później wielokrotnie używać.*
*   **Dodawanie Wpisu z Szablonu:** *Jako użytkownik, chcę dodać nowy wpis, wybrać szablon "Urodziny", wypełnić pola "Imię: Anna" i "Data urodzenia: 1990-05-20", aby w kalendarzu automatycznie pojawił się sformatowany wpis "🎂 Urodziny Anna (35)" (dla roku 2025).*
*   **Tworzenie Wpisu Powtarzalnego:** *Jako użytkownik, chcę stworzyć wpis "Wywóz śmieci BIO", wybrać opcję powtarzania "co 2 tygodnie w środę" oraz datę początkową, aby wpis automatycznie pojawił się w kalendarzu w odpowiednich terminach.*
*   **Globalna Edycja Wyglądu:** *Jako użytkownik, chcę edytować szablon "Faktura", zmieniając jego kolor tła z niebieskiego na zielony, a następnie zatwierdzić zmianę, aby wszystkie moje wpisy o fakturach natychmiastowo i automatycznie zmieniły kolor w kalendarzu.*

**c. Ważne kryteria sukcesu i sposoby ich mierzenia:**
*   **Główny Wskaźnik:** Przynajmniej 90% nowo tworzonych wpisów korzysta z szablonu (wliczając w to domyślny szablon "Czysty wpis").
*   **Pomiar:** Wymaga to implementacji analityki zliczającej tworzenie wpisów z podziałem na te z wybranym szablonem i te bez (opcja "bez szablonu").
*   **Cel Jakościowy:** Użytkownicy aktywnie tworzą i modyfikują własne szablony, co świadczy o zrozumieniu i docenieniu kluczowej funkcjonalności aplikacji.

</prd_planning_summary>

<unresolved_issues>
Wszystkie kluczowe kwestie dotyczące zakresu MVP zostały wyjaśnione i doprecyzowane. Brak nierozwiązanych problemów blokujących rozpoczęcie prac nad szczegółowym dokumentem PRD.
</unresolved_issues>
</conversation_summary>