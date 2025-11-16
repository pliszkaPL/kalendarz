# GitHub Code Review Rules - Kalendarz MVP

Data: 2025-11-16

## Spis treści

1. [Laravel / PHP Rules](#laravel--php-rules)
2. [Vue.js 3 Rules](#vuejs-3-rules)
3. [JavaScript / Frontend Rules](#javascript--frontend-rules)
4. [Tailwind CSS Rules](#tailwind-css-rules)
5. [Docker & Infrastructure Rules](#docker--infrastructure-rules)
6. [Testing Rules](#testing-rules)
7. [Security Rules](#security-rules)
8. [Git & Organization Rules](#git--organization-rules)
9. [Performance Rules](#performance-rules)

---

## Laravel / PHP Rules

### 1. Laravel PSR-12 Compliance ✅

**Pliki**: `backend/**/*.php`

**Wymagania**:
- ✅ Kod używa 4 spacji do wcięć (nie tabulatorów)
- ✅ Brak zamykającego tagu `?>` w plikach zawierających tylko PHP
- ✅ Namespace i use statements są na początku pliku
- ✅ Klasy używają PascalCase
- ✅ Metody używają camelCase
- ✅ Stałe używają UPPER_CASE
- ✅ Każda klasa jest w osobnym pliku
- ✅ Opening brace dla klas i metod jest w nowej linii

**Przykład GOOD**:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    public function getFormattedDate(): string
    {
        return $this->date->format('Y-m-d');
    }
}
```

**Przykład BAD**:
```php
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Event extends Model {
  public function get_formatted_date() {
      return $this->date->format('Y-m-d');
  }
}
?>
```

---

### 2. Laravel Controllers Best Practices 🎮

**Pliki**: `backend/app/Http/Controllers/**/*.php`

**Wymagania**:
- ✅ Kontroler dziedziczy po Controller base class
- ✅ Metody kontrolera nie zawierają złożonej logiki biznesowej
- ✅ Używa się Form Request Validation zamiast `validate()` w kontrolerze
- ✅ Kontroler zwraca API Resources dla JSON responses
- ✅ Brak bezpośrednich zapytań DB w kontrolerze
- ✅ Nazwa kontrolera kończy się na 'Controller'
- ✅ RESTful naming conventions (index, store, show, update, destroy)

**Przykład GOOD**:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;

class EventController extends Controller
{
    public function store(StoreEventRequest $request)
    {
        $event = Event::create($request->validated());
        
        return new EventResource($event);
    }
}
```

**Przykład BAD**:
```php
<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventsController // Zła nazwa (Events zamiast Event)
{
    public function createEvent(Request $request) // Zła nazwa metody (nie RESTful)
    {
        // Walidacja w kontrolerze (powinno być w FormRequest)
        $validated = $request->validate([
            'title' => 'required|string',
        ]);
        
        // Bezpośrednie zapytanie DB (powinno być przez Model)
        $event = DB::table('events')->insert($validated);
        
        // Zwracanie raw array (powinno być API Resource)
        return response()->json($event);
    }
}
```

---

### 3. Eloquent Models Standards 📊

**Pliki**: `backend/app/Models/**/*.php`

**Wymagania**:
- ✅ Model dziedziczy po `Illuminate\Database\Eloquent\Model`
- ✅ Property `$fillable` lub `$guarded` jest zdefiniowane
- ✅ Property `$casts` jest użyte dla typowania atrybutów
- ✅ Relacje mają type hints
- ✅ Używa się singular naming dla modeli (Event, nie Events)
- ✅ Złożone zapytania są w query scopes
- ✅ Accessors i Mutators używają nowej składni Laravel 12
- ✅ Timestamps są włączone lub wyraźnie wyłączone

**Przykład GOOD**:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'template_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
        'date' => 'datetime',
    ];

    // Relacja z type hint
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    // Query scope
    public function scopeUpcoming($query)
    {
        return $query->where('date', '>', now());
    }

    // Accessor (Laravel 12 syntax)
    protected function title(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => ucfirst($value),
        );
    }
}
```

**Przykład BAD**:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Events extends Model // Zła nazwa (liczba mnoga)
{
    // Brak $fillable/$guarded - mass assignment vulnerability!
    
    // Brak $casts - typy nie są określone
    
    // Relacja bez type hint
    public function template()
    {
        return $this->belongsTo(Template::class);
    }
    
    // Stara składnia accessor
    public function getTitleAttribute($value)
    {
        return ucfirst($value);
    }
}
```

---

### 4. Database Migrations Safety 🛡️

**Pliki**: `backend/database/migrations/*.php`

**Wymagania**:
- ✅ Metoda `down()` prawidłowo cofa zmiany z `up()`
- ✅ Używa się schema builder zamiast raw SQL
- ✅ Foreign keys mają `onDelete` i `onUpdate` constraints
- ✅ Indexes są dodawane dla foreign keys
- ✅ Nazwy tabel są w liczbie mnogiej (events, templates)
- ✅ Nazwa pliku migracji jest opisowa
- ✅ Nie modyfikuje się starych migracji (twórz nowe)

**Przykład GOOD**:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->foreignId('template_id')
                  ->constrained()
                  ->onDelete('restrict');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('data')->nullable();
            $table->timestamps();
            
            // Index for foreign keys
            $table->index('user_id');
            $table->index('template_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
```

**Przykład BAD**:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Raw SQL zamiast schema builder - BAD!
        DB::statement('CREATE TABLE event (
            id INT PRIMARY KEY,
            user_id INT,
            title VARCHAR(255)
        )');
    }

    public function down(): void
    {
        // Brak prawidłowego rollback
    }
};
```

---

### 5. Laravel Sanctum Authentication 🔐

**Pliki**: `backend/app/Http/Controllers/Api/AuthController.php`

**Wymagania**:
- ✅ Hasła są hashowane przez `Hash::make()` lub `bcrypt()`
- ✅ Tokeny Sanctum mają abilities/permissions jeśli potrzebne
- ✅ Logout usuwa tokeny przez `$user->tokens()->delete()`
- ✅ CORS jest prawidłowo skonfigurowany dla SPA
- ✅ Stateful domains są ustawione w sanctum config

**Przykład GOOD**:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
```

---

## Vue.js 3 Rules

### 6. Vue 3 Composition API Standards 🎨

**Pliki**: `frontend/src/**/*.vue`

**Wymagania**:
- ✅ Używa się `<script setup>` syntax
- ✅ Reactive state używa `ref()` lub `reactive()`
- ✅ Computed properties używają `computed()`
- ✅ Side effects są w `watch()` lub `watchEffect()`
- ✅ Lifecycle hooks są poprawnie importowane
- ✅ Props są definiowane przez `defineProps()`
- ✅ Emits są definiowane przez `defineEmits()`

**Przykład GOOD**:
```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  eventId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update', 'delete'])

const event = ref(null)
const isLoading = ref(false)

const formattedDate = computed(() => {
  return event.value?.date.toLocaleDateString()
})

onMounted(async () => {
  isLoading.value = true
  event.value = await fetchEvent(props.eventId)
  isLoading.value = false
})

const handleUpdate = () => {
  emit('update', event.value)
}
</script>

<template>
  <div v-if="!isLoading">
    <h2>{{ event?.title }}</h2>
    <p>{{ formattedDate }}</p>
    <button @click="handleUpdate">Update</button>
  </div>
</template>

<style scoped>
/* Scoped styles */
</style>
```

**Przykład BAD**:
```vue
<script>
// Options API zamiast Composition API - BAD dla nowego kodu!
export default {
  props: ['eventId'], // Brak type validation
  data() {
    return {
      event: null
    }
  },
  computed: {
    formattedDate() {
      return this.event?.date.toLocaleDateString()
    }
  },
  mounted() {
    this.fetchEvent()
  }
}
</script>

<template>
  <div>
    <h2>{{ event.title }}</h2>
  </div>
</template>
```

---

### 7. Vue Props and Emits Validation ✔️

**Pliki**: `frontend/src/**/*.vue`

**Wymagania**:
- ✅ Props mają zdefiniowane typy
- ✅ Props mają default value dla optional props
- ✅ Props mają `required: true` dla wymaganych props
- ✅ Emits są deklarowane
- ✅ Emit names używają kebab-case
- ✅ Props są immutable w komponencie

**Przykład GOOD**:
```vue
<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  template: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.hasOwnProperty('id') && value.hasOwnProperty('name')
    }
  },
  maxLength: {
    type: Number,
    default: 100
  }
})

const emit = defineEmits(['update-title', 'delete-event'])

const handleTitleChange = (newTitle) => {
  // NIE modyfikuj props.title bezpośrednio!
  emit('update-title', newTitle)
}
</script>
```

**Przykład BAD**:
```vue
<script setup>
// Brak type validation
const props = defineProps(['title', 'description'])

// Brak deklaracji emits
const emit = defineEmits()

const handleTitleChange = (newTitle) => {
  // BAD! Modyfikacja props bezpośrednio
  props.title = newTitle
  
  // BAD! camelCase zamiast kebab-case
  emit('updateTitle', newTitle)
}
</script>
```

---

### 8. Vue Reactivity Best Practices ⚡

**Pliki**: `frontend/src/**/*.vue`, `frontend/src/**/*.js`

**Wymagania**:
- ✅ Primitive values używają `ref()`
- ✅ Objects/arrays mogą używać `reactive()` lub `ref()`
- ✅ Accessing ref values używa `.value` w `<script>`
- ✅ Template automatic unwrapping ref values
- ✅ Destructuring reactive objects używa `toRefs()`
- ✅ Computed properties nie mają side effects

**Przykład GOOD**:
```vue
<script setup>
import { ref, reactive, computed, toRefs } from 'vue'

// Primitives - używaj ref()
const count = ref(0)
const name = ref('John')

// Objects - ref() lub reactive()
const user = ref({
  name: 'Alice',
  age: 30
})
// LUB
const user = reactive({
  name: 'Alice',
  age: 30
})

// Accessing ref w script - używaj .value
const incrementCount = () => {
  count.value++
}

// Computed bez side effects
const doubleCount = computed(() => count.value * 2)

// Destructuring reactive - użyj toRefs
const state = reactive({ foo: 1, bar: 2 })
const { foo, bar } = toRefs(state)
</script>

<template>
  <!-- Template automatic unwrap ref - NIE używaj .value -->
  <div>{{ count }}</div>
  <div>{{ user.name }}</div>
</template>
```

**Przykład BAD**:
```vue
<script setup>
import { ref, computed } from 'vue'

const count = ref(0)

// BAD! Side effect w computed
const doubleCountBad = computed(() => {
  console.log('Computing...') // Side effect!
  count.value++ // Modyfikacja state!
  return count.value * 2
})

// BAD! Accessing ref bez .value
const incrementCount = () => {
  count++ // To nie zadziała!
}

// BAD! Destructuring reactive bez toRefs
const state = reactive({ foo: 1, bar: 2 })
const { foo, bar } = state // Traci reaktywność!
</script>

<template>
  <!-- BAD! Używanie .value w template -->
  <div>{{ count.value }}</div>
</template>
```

---

### 9. Vue Template Best Practices 📝

**Pliki**: `frontend/src/**/*.vue`

**Wymagania**:
- ✅ `v-for` ma `:key` binding
- ✅ `v-if` i `v-for` nie są na tym samym elemencie
- ✅ Event handlers używają `@click` nie `v-on:click`
- ✅ Binding używa `:` nie `v-bind:`
- ✅ Brak złożonej logiki w template
- ✅ Używa się `v-show` dla toggle często, `v-if` dla conditional rendering

**Przykład GOOD**:
```vue
<script setup>
import { ref, computed } from 'vue'

const events = ref([
  { id: 1, title: 'Event 1' },
  { id: 2, title: 'Event 2' }
])

const showEvents = ref(true)

// Złożona logika w computed, nie w template
const sortedEvents = computed(() => {
  return events.value.sort((a, b) => a.title.localeCompare(b.title))
})
</script>

<template>
  <div>
    <!-- Używaj :key z v-for -->
    <div v-for="event in sortedEvents" :key="event.id">
      <!-- Shorthand syntax -->
      <h2 :class="{ active: event.isActive }">{{ event.title }}</h2>
      <button @click="deleteEvent(event.id)">Delete</button>
    </div>
    
    <!-- v-show dla frequent toggles -->
    <div v-show="showEvents">
      Frequently toggled content
    </div>
    
    <!-- v-if dla conditional rendering -->
    <div v-if="events.length === 0">
      No events found
    </div>
  </div>
</template>
```

**Przykład BAD**:
```vue
<template>
  <div>
    <!-- BAD! Brak :key -->
    <div v-for="event in events">
      {{ event.title }}
    </div>
    
    <!-- BAD! v-if i v-for na tym samym elemencie -->
    <div v-for="event in events" v-if="event.isActive" :key="event.id">
      {{ event.title }}
    </div>
    
    <!-- BAD! Złożona logika w template -->
    <div v-for="event in events.filter(e => e.isActive).sort((a,b) => a.title.localeCompare(b.title))" :key="event.id">
      {{ event.title }}
    </div>
    
    <!-- BAD! Verbose syntax -->
    <button v-on:click="deleteEvent(event.id)">Delete</button>
    <h2 v-bind:class="{ active: event.isActive }">{{ event.title }}</h2>
  </div>
</template>
```

---

## JavaScript / Frontend Rules

### 10. Modern JavaScript Standards 🚀

**Pliki**: `frontend/src/**/*.js`, `frontend/src/**/*.vue`

**Wymagania**:
- ✅ Używa się `const` i `let` zamiast `var`
- ✅ Arrow functions są preferowane
- ✅ Template literals zamiast string concatenation
- ✅ Destructuring jest używany
- ✅ Async/await zamiast promise chains
- ✅ Optional chaining (`?.`) dla safe property access
- ✅ Nullish coalescing (`??`) zamiast `||`

**Przykład GOOD**:
```javascript
// const/let zamiast var
const API_URL = 'http://api.example.com'
let count = 0

// Arrow functions
const fetchEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

// Destructuring
const { title, description, date } = event

// Optional chaining
const userName = user?.profile?.name

// Nullish coalescing
const displayName = userName ?? 'Anonymous'

// Template literals
const message = `Welcome ${userName}, you have ${count} events`
```

**Przykład BAD**:
```javascript
// var - BAD!
var API_URL = 'http://api.example.com'

// Regular function - less concise
function fetchEvent(id) {
  // Promise chains zamiast async/await - less readable
  return fetch(API_URL + '/events/' + id)  // String concatenation - BAD!
    .then(response => response.json())
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Failed to fetch event:', error)
    })
}

// No destructuring - verbose
const title = event.title
const description = event.description
const date = event.date

// No optional chaining - verbose
const userName = user && user.profile && user.profile.name

// || zamiast ?? - może nie działać jak oczekiwane dla 0, '', false
const displayName = userName || 'Anonymous'
```

---

### 11. Axios API Service Standards 🌐

**Pliki**: `frontend/src/services/**/*.js`

**Wymagania**:
- ✅ API calls są w osobnych service files
- ✅ Axios instance ma base URL configuration
- ✅ Interceptors są używane dla auth tokens
- ✅ Error handling jest centralizowany
- ✅ Loading states są zarządzane
- ✅ Używa się try/catch dla async calls

**Przykład GOOD**:
```javascript
// services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - dodawaj token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - centralne error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// services/eventService.js
import api from './api'

export const eventService = {
  async getAll() {
    try {
      const response = await api.get('/events')
      return response.data
    } catch (error) {
      console.error('Failed to fetch events:', error)
      throw error
    }
  },

  async create(eventData) {
    try {
      const response = await api.post('/events', eventData)
      return response.data
    } catch (error) {
      console.error('Failed to create event:', error)
      throw error
    }
  },
}
```

**Przykład BAD**:
```javascript
// BAD! API calls bezpośrednio w komponentach
<script setup>
import axios from 'axios'

const events = ref([])

const fetchEvents = async () => {
  // BAD! Hardcoded URL
  // BAD! Brak centralizacji
  // BAD! Brak interceptors
  const response = await axios.get('http://localhost:8000/api/events', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  events.value = response.data
}
</script>
```

---

## Tailwind CSS Rules

### 12. Tailwind CSS Best Practices 🎨

**Pliki**: `frontend/src/**/*.vue`

**Wymagania**:
- ✅ Używa się utility classes zamiast custom CSS
- ✅ Długie listy klas są rozbite na linie
- ✅ Responsive classes są używane prawidłowo
- ✅ Custom colors są w tailwind.config.js
- ✅ Używa się `@apply` tylko dla często powtarzanych kombinacji
- ✅ Purge/content configuration jest prawidłowe

**Przykład GOOD**:
```vue
<template>
  <!-- Czytelne, rozbite na linie -->
  <div
    class="
      flex flex-col gap-4
      p-6 rounded-lg
      bg-white shadow-lg
      hover:shadow-xl
      transition-shadow duration-200
      sm:flex-row
      md:p-8
      lg:gap-6
    "
  >
    <h2 class="text-2xl font-bold text-gray-900">
      {{ title }}
    </h2>
    
    <!-- Custom color z config -->
    <button class="bg-primary text-white px-4 py-2 rounded">
      Click me
    </button>
  </div>
</template>

<style scoped>
/* @apply dla często powtarzanej kombinacji */
.btn-primary {
  @apply px-4 py-2 rounded bg-primary text-white hover:bg-primary-dark;
}
</style>
```

**Przykład BAD**:
```vue
<template>
  <!-- BAD! Wszystko w jednej linii - nieczytelne -->
  <div class="flex flex-col gap-4 p-6 rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 sm:flex-row md:p-8 lg:gap-6">
    <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
    
    <!-- BAD! Inline custom color zamiast w config -->
    <button class="bg-[#3490dc] text-white px-4 py-2 rounded">
      Click me
    </button>
  </div>
</template>

<style scoped>
/* BAD! Custom CSS zamiast Tailwind utilities */
.container {
  display: flex;
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
}

/* BAD! @apply dla pojedynczego użycia */
.single-use {
  @apply px-4 py-2;
}
</style>
```

---

## Docker & Infrastructure Rules

### 13. Dockerfile Best Practices 🐳

**Pliki**: `**/Dockerfile`

**Wymagania**:
- ✅ Używa się multi-stage builds
- ✅ Base image ma specific tag (nie latest)
- ✅ Layers są w prawidłowej kolejności (cache optimization)
- ✅ COPY package files przed kodem
- ✅ Używa się .dockerignore
- ✅ USER jest ustawiony (nie root)

**Przykład GOOD**:
```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Don't run as root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Przykład BAD**:
```dockerfile
# BAD! latest tag
FROM node:latest

WORKDIR /app

# BAD! Copy everything first - poor caching
COPY . .

# BAD! npm install zamiast npm ci
RUN npm install

RUN npm run build

# BAD! Running as root
# BAD! No multi-stage build - bigger image

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Testing Rules

### 14. Playwright E2E Tests Standards 🧪

**Pliki**: `e2e-tests/tests/**/*.spec.js`

**Wymagania**:
- ✅ Test names są opisowe
- ✅ Używa się page object model dla złożonych flows
- ✅ Selectors są stable (data-testid preferowane)
- ✅ Testy są niezależne od siebie
- ✅ Cleanup jest wykonywany po testach
- ✅ Assertions są konkretne i jasne

**Przykład GOOD**:
```javascript
import { test, expect } from '@playwright/test'

test.describe('Event Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup - login before each test
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should create a new event', async ({ page }) => {
    // Navigate
    await page.click('[data-testid="add-event-button"]')
    
    // Fill form
    await page.fill('[data-testid="event-title"]', 'Test Event')
    await page.fill('[data-testid="event-description"]', 'Test Description')
    await page.selectOption('[data-testid="template-select"]', '1')
    
    // Submit
    await page.click('[data-testid="save-event-button"]')
    
    // Assert
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('text=Test Event')).toBeVisible()
  })

  test.afterEach(async ({ page }) => {
    // Cleanup - delete test data if needed
  })
})
```

**Przykład BAD**:
```javascript
import { test, expect } from '@playwright/test'

// BAD! Niezrozumiała nazwa testu
test('test 1', async ({ page }) => {
  // BAD! Brak setup/login
  
  // BAD! Niestabilne selectors (CSS classes mogą się zmienić)
  await page.click('.btn-primary.add-event')
  
  // BAD! Niezależność - ten test zależy od poprzedniego
  await page.fill('.title-input', 'Event from previous test')
  
  // BAD! Słaba asercja
  await expect(page.locator('div')).toBeVisible()
  
  // BAD! Brak cleanup
})
```

---

## Security Rules

### 15. Security Best Practices 🔒

**Pliki**: `**/*.php`, `**/*.js`, `**/*.vue`

**Wymagania**:
- ✅ Brak hardcoded passwords, API keys, secrets
- ✅ Sensitive data są w .env files
- ✅ .env files są w .gitignore
- ✅ User input jest walidowany przed użyciem
- ✅ XSS prevention - nie używa się v-html bez sanitization
- ✅ CSRF protection jest włączona
- ✅ SQL injection prevention - prepared statements

**Przykład GOOD**:
```php
<?php
// .env
DB_PASSWORD=super_secret_password
API_KEY=your_api_key_here

// config/database.php
'password' => env('DB_PASSWORD'),

// Controller
public function store(StoreEventRequest $request)
{
    // Validated input przez FormRequest
    $validated = $request->validated();
    
    // Safe - używa prepared statements
    Event::create($validated);
}
```

```vue
<script setup>
import DOMPurify from 'dompurify'

const userContent = ref('')

// Safe - sanitize przed użyciem v-html
const safeContent = computed(() => {
  return DOMPurify.sanitize(userContent.value)
})
</script>

<template>
  <!-- Safe - sanitized -->
  <div v-html="safeContent"></div>
  
  <!-- Preferred - używaj text interpolation -->
  <div>{{ userContent }}</div>
</template>
```

**Przykład BAD**:
```php
<?php
// BAD! Hardcoded credentials
$db_password = 'super_secret_password';
$api_key = 'sk-1234567890abcdef';

// BAD! SQL injection vulnerable
$events = DB::select("SELECT * FROM events WHERE user_id = " . $userId);

// BAD! Brak walidacji user input
public function store(Request $request)
{
    Event::create($request->all()); // Mass assignment vulnerability!
}
```

```vue
<template>
  <!-- BAD! XSS vulnerable -->
  <div v-html="userInput"></div>
</template>
```

---

## Performance Rules

### 16. Performance Best Practices ⚡

**Wymagania**:
- ✅ Brak N+1 queries (używaj eager loading)
- ✅ Large lists używają pagination
- ✅ Images są optymalizowane
- ✅ Vue components używają lazy loading
- ✅ Używa się debounce/throttle dla expensive operations
- ✅ Database queries mają indexes

**Przykład GOOD**:

```php
<?php
// Laravel - Eager loading zapobiega N+1
$events = Event::with('template', 'user')->get();

// Pagination dla dużych list
$events = Event::paginate(20);

// Index w migracji
$table->index('user_id');
```

```vue
<script setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es'

// Lazy loading component
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

// Debounce expensive operation
const searchQuery = ref('')
const debouncedSearch = debounce(async (query) => {
  // Expensive API call
  await searchEvents(query)
}, 300)

watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})
</script>
```

**Przykład BAD**:

```php
<?php
// BAD! N+1 query problem
$events = Event::all();
foreach ($events as $event) {
    echo $event->template->name; // Query dla każdego event!
}

// BAD! Loading wszystkiego bez pagination
$events = Event::all(); // Może być 10000+ rekordów!
```

```vue
<script setup>
// BAD! Immediate API call na każdą zmianę
watch(searchQuery, async (newQuery) => {
  await searchEvents(newQuery) // Called on every keystroke!
})

// BAD! Eager loading heavy component
import HeavyComponent from './components/HeavyComponent.vue'
</script>
```

---

## Quick Reference Checklist ✅

### Przed Commit:
- [ ] Kod jest zgodny z PSR-12 (PHP) / Vue Style Guide
- [ ] Wszystkie testy przechodzą
- [ ] Brak console.log / dd() / var_dump()
- [ ] Brak hardcoded credentials
- [ ] Props są walidowane
- [ ] Error handling jest dodany
- [ ] Comments są usunięte lub uzasadnione

### Przed Pull Request:
- [ ] Branch jest up-to-date z main
- [ ] Commit messages są opisowe
- [ ] Testy są napisane dla nowej funkcjonalności
- [ ] Documentation jest zaktualizowana
- [ ] No merge conflicts
- [ ] CI/CD passes

### Code Review Checklist:
- [ ] Kod jest czytelny i maintainable
- [ ] Brak code duplication
- [ ] Security best practices
- [ ] Performance considerations
- [ ] Error handling
- [ ] Testing coverage
- [ ] Documentation

---

**Ostatnia aktualizacja**: 2025-11-16  
**Wersja**: 1.0.0
