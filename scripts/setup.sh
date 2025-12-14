#!/usr/bin/env bash
# Quick setup script for Kalendarz MVP
# This script will setup the entire project from scratch

set -e

echo "==================================="
echo "Kalendarz MVP - Quick Setup"
echo "==================================="
echo ""

# Check required tools
echo "Checking required tools..."
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed"
    exit 1
fi
echo "✓ PHP $(php -v | head -1 | awk '{print $2}')"

# Check SQLite extension
if ! php -m | grep -qi sqlite; then
    echo "❌ PHP SQLite extension is not installed"
    echo ""
    echo "Install it with:"
    echo "  Debian/Ubuntu: sudo apt-get install php8.4-sqlite3 php8.4-pdo"
    echo "  macOS: brew install php@8.4"
    echo ""
    exit 1
fi
echo "✓ PHP SQLite extension"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✓ Node.js $(node -v)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✓ npm $(npm -v)"

echo ""
echo "All required tools are installed!"
echo ""

# Install Composer if not present
if [ ! -f backend/composer.phar ]; then
    echo "Installing Composer..."
    bash scripts/install-composer.sh
    echo ""
fi

# Install backend dependencies
echo "Installing backend dependencies..."
php backend/composer.phar install --no-interaction --prefer-dist --quiet
echo "✓ Backend dependencies installed"
echo ""

# Setup .env
if [ ! -f backend/.env ]; then
    echo "Setting up backend .env..."
    cp backend/.env.example backend/.env
    cd backend && php artisan key:generate --force --quiet
    cd ..
    echo "✓ Backend .env configured"
    echo ""
fi

# Setup database
if [ ! -f backend/database/database.sqlite ]; then
    echo "Setting up database..."
    touch backend/database/database.sqlite
    cd backend && php artisan migrate --force --quiet
    cd ..
    echo "✓ Database migrated"
    echo ""
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install --silent
cd ..
echo "✓ Frontend dependencies installed"
echo ""

echo "==================================="
echo "✓ Setup Complete!"
echo "==================================="
echo ""
echo "Next steps:"
echo "  1. Start development servers: make dev"
echo "  2. Run tests: make test"
echo "  3. Check status: make validate"
echo ""
echo "Backend will be available at: http://127.0.0.1:8000"
echo "Frontend will be available at: http://127.0.0.1:5173"
echo ""
