# Kalendarz - Quick Setup Guide

This guide will help you get the Kalendarz application up and running quickly.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (only for running tests locally)

## Quick Start

### 1. Add Host Entry

Add the following line to your `/etc/hosts` file (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1 kalendarz.loc
```

### 2. Start the Application

```bash
docker compose up -d --build
```

This will start:
- Traefik reverse proxy (port 80, 8080 for dashboard)
- Vue.js frontend (accessible via Traefik)
- Laravel backend API (accessible via Traefik)

### 3. Access the Application

- **Frontend Application**: http://kalendarz.loc
- **API Endpoint**: http://kalendarz.loc/api
- **Traefik Dashboard**: http://localhost:8080

### 4. Test the Application

1. Open http://kalendarz.loc in your browser
2. Click on the "Register" tab
3. Fill in the registration form:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123 (min 8 characters)
   - Confirm Password: password123
4. Click "Register"
5. You should be redirected to the Dashboard showing your name
6. Click "Logout" to return to the login page
7. Login with your credentials to verify authentication works

## Running E2E Tests

### Install Dependencies

```bash
cd e2e-tests
npm install
npx playwright install chromium
```

### Run Tests

Make sure the application is running (docker compose up), then:

```bash
cd e2e-tests
npm test
```

To run tests in headed mode (see the browser):

```bash
npm run test:headed
```

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The dev server will run on http://localhost:3000

### Backend Development

```bash
cd backend
composer install
php artisan serve
```

The API will be available at http://localhost:8000

### Running Backend Tests

```bash
cd backend
./vendor/bin/pest
```

To exclude E2E tests:

```bash
./vendor/bin/pest --exclude-group=e2e
```

## Stopping the Application

```bash
docker compose down
```

To remove volumes as well:

```bash
docker compose down -v
```

## Troubleshooting

### Port Already in Use

If port 80 is already in use, you can modify the `docker-compose.yml` file to use a different port:

```yaml
ports:
  - "8000:80"  # Change first port to any available port
```

Then access the application at http://kalendarz.loc:8000

### Cannot Access kalendarz.loc

Make sure you've added the host entry to your hosts file and that Docker containers are running:

```bash
docker compose ps
```

### Database Issues

If you encounter database issues, you can reset the database:

```bash
docker compose down -v
docker compose up -d --build
```

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
└────────┬────────┘
         │
         │ http://kalendarz.loc
         ▼
┌─────────────────┐
│   Traefik       │
│  (Port 80)      │
└────────┬────────┘
         │
    ┌────┴────────────────┐
    │                     │
    ▼                     ▼
┌─────────┐         ┌──────────┐
│ Frontend│         │ Backend  │
│ (Vue 3) │         │(Laravel) │
│  Nginx  │         │  PHP-FPM │
└─────────┘         └──────────┘
                         │
                         ▼
                    ┌──────────┐
                    │ SQLite   │
                    │ Database │
                    └──────────┘
```

## API Endpoints

- `POST /api/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```

- `POST /api/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/user` - Get authenticated user (requires Bearer token)
- `POST /api/logout` - Logout user (requires Bearer token)

## Continuous Integration

The project includes GitHub Actions that automatically run E2E tests on commits to the master branch. Check the `.github/workflows/e2e-tests.yml` file for details.

## Support

For issues or questions, please check the main README.md file or open an issue on GitHub.
