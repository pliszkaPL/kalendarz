# Stos Technologiczny - Kalendarz MVP

Data: 2025-11-16

## Architektura

Aplikacja Kalendarz MVP jest zbudowana jako pełnowartościowa aplikacja webowa składająca się z frontend-u, backend-u oraz warstwy infrastrukturalnej. Architektura opiera się na modelu client-server z komunikacją poprzez REST API.

## Frontend - Vue.js 3 z Tailwind CSS

- **Vue.js 3** - nowoczesny framework JavaScript do budowy reaktywnych interfejsów użytkownika
  - Wykorzystuje Composition API dla lepszej organizacji kodu
  - Reaktywny system pozwala na dynamiczne aktualizacje interfejsu, co jest kluczowe dla systemu szablonów
  - Umożliwia tworzenie komponentów wielokrotnego użytku (np. kafelki wydarzeń, edytor szablonów)
  
- **Vue Router 4** - oficjalny router dla Vue.js 3
  - Zarządzanie nawigacją między widokami (logowanie, rejestracja, kalendarz, ustawienia)
  - Ochrona tras wymagających uwierzytelnienia
  
- **Tailwind CSS 3** - utility-first framework CSS
  - Szybkie stylowanie komponentów bez pisania niestandardowego CSS
  - Łatwa personalizacja kolorów i ikon zgodnie z systemem szablonów
  - Responsywny design dla różnych rozmiarów ekranów
  
- **Axios** - klient HTTP do komunikacji z API
  - Obsługa żądań do backend-u (CRUD wydarzeń, szablonów)
  - Automatyczne dodawanie tokenów uwierzytelniania do żądań
  - Centralizacja konfiguracji API
  
- **Vite 7** - szybkie narzędzie do budowania aplikacji
  - Błyskawiczny hot module replacement (HMR) podczas rozwoju
  - Optymalizacja bundle'a produkcyjnego
  - Natywne wsparcie dla TypeScript i ES modules

## Backend - Laravel 12 jako REST API

- **Laravel 12** - pełnowartościowy framework PHP
  - Elegancka struktura MVC dla organizacji kodu backend-u
  - Eloquent ORM dla prostej interakcji z bazą danych
  - Wbudowany system walidacji dla bezpiecznego przetwarzania danych
  - Intuicyjne API dla tworzenia endpointów REST
  
- **Laravel Sanctum 4** - system uwierzytelniania API
  - Lekkie uwierzytelnianie oparte na tokenach dla SPA (Single Page Applications)
  - Bezpieczne zarządzanie sesjami użytkowników
  - Proste API do generowania i weryfikacji tokenów
  
- **SQLite** - baza danych
  - Lekka, bezserwerowa baza danych idealna dla MVP
  - Prostsza konfiguracja niż tradycyjne bazy danych (PostgreSQL, MySQL)
  - Cała baza w jednym pliku, łatwa w backupie i przenoszeniu
  - Wystarczająca wydajność dla MVP i małej liczby użytkowników
  - Możliwość łatwej migracji do PostgreSQL/MySQL w przyszłości
  
- **PHP 8.2+** - język programowania backend-u
  - Nowoczesne features PHP (typed properties, enums, match expressions)
  - Lepsza wydajność i bezpieczeństwo

## Infrastruktura i DevOps

### Konteneryzacja i Orkiestracja

- **Docker** - konteneryzacja aplikacji
  - Zapewnia spójne środowisko rozwojowe i produkcyjne
  - Izolacja zależności dla frontend-u i backend-u
  - Łatwe skalowanie i deployment
  
- **Docker Compose** - orkiestracja kontenerów lokalnie
  - Definicja całego środowiska w pliku `docker-compose.yml`
  - Łatwe uruchamianie wszystkich serwisów jedną komendą
  - Zarządzanie siecią między kontenerami

### Routing i Proxy

- **Traefik 3** - nowoczesny reverse proxy i load balancer
  - Automatyczne routowanie żądań do odpowiednich serwisów
  - Obsługa routingu opartego na domenach i ścieżkach
  - Frontend dostępny pod `http://kalendarz.loc`
  - Backend API dostępne pod `http://kalendarz.loc/api`
  - Dashboard Traefik do monitorowania (port 8080)
  - Przygotowanie do łatwego dodania SSL/TLS w przyszłości

### Serwery Web

- **Nginx** - serwer HTTP dla frontend-u
  - Wydajne serwowanie statycznych plików Vue.js
  - Konfiguracja SPA routing (przekierowanie wszystkich żądań do index.html)
  
- **PHP-FPM** - FastCGI Process Manager dla Laravel
  - Wydajne przetwarzanie żądań PHP
  - Zarządzanie procesami worker-ów

## Testowanie

### Testy End-to-End

- **Playwright 1.56+** - framework do testów E2E
  - Automatyczne testowanie krytycznych flow-ów (rejestracja, logowanie)
  - Symulacja rzeczywistych interakcji użytkownika
  - Wsparcie dla różnych przeglądarek (Chromium, Firefox, WebKit)
  - Możliwość uruchamiania testów headless lub z interfejsem graficznym
  
- **PEST 4.x** - elegancki wrapper dla PHPUnit
  - Czytelna składnia testów dla backend-u
  - Integracja z testami Laravel
  - Możliwość uruchamiania testów E2E przez PEST

### Testy Backendowe

- **PHPUnit 11.5+** - framework do testów jednostkowych i integracyjnych PHP
  - Testowanie logiki biznesowej (szablony, wydarzenia powtarzalne)
  - Feature testy dla endpointów API
  - Unit testy dla modeli i serwisów

## CI/CD

- **GitHub Actions** - automatyzacja pipeline'ów CI/CD
  - Automatyczne uruchamianie testów E2E przy każdym commit-ie do gałęzi master
  - Budowanie obrazów Docker
  - Walidacja kodu przed merge'em
  - Przechowywanie artefaktów testowych (raporty, screenshoty, wideo)
  
- **Workflow E2E** (`.github/workflows/e2e-tests.yml`)
  - Setup środowiska Docker
  - Instalacja zależności
  - Uruchomienie testów Playwright
  - Upload wyników jako artefakty

## Narzędzia Deweloperskie

- **Makefile** - automatyzacja częstych zadań
  - Uproszczone komendy do zarządzania Docker Compose
  - Szybkie uruchamianie migracji bazy danych
  - Czyszczenie cache'u Laravel
  
- **Composer** - menedżer pakietów PHP
  - Zarządzanie zależnościami Laravel
  - Autoloading klas
  
- **npm** - menedżer pakietów JavaScript
  - Zarządzanie zależnościami frontend-u
  - Skrypty do budowania i developmentu

## Hosting (Planowany)

- **DigitalOcean** - platforma hostingowa
  - Hosting kontenerów Docker
  - Proste zarządzanie serwerami VPS
  - Możliwość łatwego skalowania zasobów
  - Dobry stosunek ceny do wydajności
  
- **Docker** - deployment produkcyjny
  - Spójność między środowiskami dev/staging/production
  - Łatwe rollback'i i aktualizacje
  - Możliwość wykorzystania Docker Compose lub Kubernetes w przyszłości

## Bezpieczeństwo

- **Laravel Sanctum** - uwierzytelnianie API
  - Bezpieczne tokeny dostępu
  - Ochrona przed CSRF
  
- **SQLite** - baza danych
  - Brak ekspozycji portów bazodanowych
  - Baza danych w kontenerze, odizolowana od świata zewnętrznego
  
- **CORS** - konfiguracja w Laravel
  - Kontrola dostępu do API z różnych origin-ów
  - Ochrona przed nieautoryzowanymi żądaniami
  
- **Traefik** - reverse proxy
  - Centralizacja punktu wejścia do aplikacji
  - Możliwość łatwego dodania SSL/TLS
  - Rate limiting (możliwy do skonfigurowania)

## Dlaczego Ten Stos?

### Vue.js 3 + Laravel 12
- **Sprawdzona kombinacja**: Vue.js i Laravel doskonale ze sobą współpracują
- **Reaktywność**: Vue.js idealnie nadaje się do aplikacji kalendarza wymagającej dynamicznych aktualizacji
- **Ecosystem**: Bogaty ekosystem bibliotek i rozszerzeń dla obu frameworków
- **Dokumentacja**: Doskonała dokumentacja i duża społeczność

### SQLite
- **Prostota**: Idealna dla MVP - zero konfiguracji serwera bazy danych
- **Wystarczająca wydajność**: Dla MVP i małej liczby użytkowników w zupełności wystarczająca
- **Łatwa migracja**: W przyszłości łatwo przejść na PostgreSQL lub MySQL jeśli zajdzie taka potrzeba

### Docker + Traefik
- **Spójność środowisk**: Identyczne środowisko dev i production
- **Łatwość deployment-u**: Prosty proces wdrażania na dowolny serwer z Docker-em
- **Elastyczność**: Łatwe dodawanie nowych serwisów (np. Redis, kolejki)

### Playwright + PEST
- **Kompleksowe testowanie**: Playwright dla testów E2E symulujących użytkownika, PEST dla testów backendowych
- **Pewność jakości**: Automatyczne testy krytycznych flow-ów przed każdym deploymentem
- **Szybka iteracja**: Testy pomagają szybko wykrywać regresje podczas rozwoju

## Potencjalne Rozszerzenia w Przyszłości

- **PostgreSQL/MySQL**: Migracja z SQLite dla lepszej wydajności i skalowalności
- **Redis**: Cache'owanie i kolejki dla lepszej wydajności
- **TypeScript**: Dodanie statycznego typowania do frontend-u
- **Pinia/Vuex**: State management dla bardziej złożonego stanu aplikacji
- **Vue Test Utils + Vitest**: Testy jednostkowe komponentów Vue
- **Laravel Horizon**: Monitoring kolejek (jeśli będą potrzebne)
- **SSL/TLS**: Automatyczne certyfikaty przez Let's Encrypt via Traefik
- **CDN**: Cloudflare dla lepszej wydajności globalnej
