## Opis zmian

<!-- Opisz co zostało zrobione i dlaczego -->

## Typ zmian

<!-- Zaznacz odpowiednie -->

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] 🎨 Style/UI changes
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvements
- [ ] ✅ Test additions/updates

## Powiązane Issue

<!-- Link do issue jeśli dotyczy -->

Fixes #(issue number)

## Testy

<!-- Opisz jakie testy zostały dodane/zmodyfikowane -->

- [ ] Unit tests dodane/zaktualizowane
- [ ] Feature tests dodane/zaktualizowane
- [ ] E2E tests dodane/zaktualizowane
- [ ] Wszystkie testy przechodzą lokalnie

## Checklist

### General
- [ ] Kod jest zgodny z [Code Review Rules](.github/CODE_REVIEW_RULES.md)
- [ ] Brak console.log / dd() / var_dump() w kodzie
- [ ] Brak hardcoded credentials lub sensitive data
- [ ] Commit messages są opisowe i sensowne

### Backend (Laravel/PHP)
- [ ] Kod jest zgodny z PSR-12
- [ ] Migracje mają prawidłową metodę `down()`
- [ ] Models mają `$fillable` lub `$guarded`
- [ ] Controllers używają Form Requests dla walidacji
- [ ] API zwraca API Resources
- [ ] Brak N+1 queries (używam eager loading)
- [ ] Testy backend przechodzą (`php artisan test`)

### Frontend (Vue.js)
- [ ] Używam Composition API (`<script setup>`)
- [ ] Props są walidowane (type, required, default)
- [ ] Emits są zadeklarowane
- [ ] `v-for` ma `:key` binding
- [ ] Nie ma `v-if` i `v-for` na tym samym elemencie
- [ ] Złożona logika jest w computed properties, nie w template
- [ ] Używam `ref()`/`reactive()` dla reactivity
- [ ] API calls są w service files, nie w komponentach

### Testing
- [ ] Nowe features mają testy
- [ ] Edge cases są testowane
- [ ] E2E testy przechodzą (`cd e2e-tests && npm test`)
- [ ] Test coverage jest wystarczający

### Security
- [ ] User input jest walidowany
- [ ] Nie używam `v-html` bez sanitization
- [ ] SQL queries używają prepared statements / Eloquent
- [ ] Auth/authorization są sprawdzone

### Documentation
- [ ] README zaktualizowane (jeśli potrzebne)
- [ ] API endpoints udokumentowane (jeśli nowe)
- [ ] Złożona logika ma komentarze
- [ ] .env.example zaktualizowany (jeśli dodano nowe zmienne)

### Infrastructure
- [ ] Docker build działa (`docker compose build`)
- [ ] Containers startują poprawnie (`docker compose up`)
- [ ] Brak zmian w .env (tylko w .env.example)

## Screenshots / Videos

<!-- Jeśli są zmiany w UI, dodaj screenshoty lub wideo -->

## Deployment Notes

<!-- Czy są jakieś specjalne kroki potrzebne do deployment? -->

- [ ] Brak specjalnych kroków
- [ ] Wymagane uruchomienie migracji
- [ ] Wymagane zmiany w .env
- [ ] Wymagane zmiany w infrastrukturze
- [ ] Inne: _______________

## Dodatkowe informacje

<!-- Wszystko co reviewer powinien wiedzieć -->
