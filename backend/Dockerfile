# Backend Dockerfile - Laravel 12 API
# PHP 8.4 with SQLite support
# Multi-stage build: base -> dev -> prod

# =============================================================================
# Base stage - common dependencies
# =============================================================================
FROM php:8.4.2-cli-alpine3.21 AS base

# Install system dependencies
RUN apk add --no-cache \
    sqlite \
    sqlite-dev \
    bash \
    curl \
    git \
    unzip \
    libzip-dev \
    oniguruma-dev \
    linux-headers \
    && docker-php-ext-install pdo pdo_sqlite zip mbstring pcntl

# Set PHP configuration
RUN echo "memory_limit = 512M" > /usr/local/etc/php/conf.d/memory.ini \
    && echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=128" >> /usr/local/etc/php/conf.d/opcache.ini

# Install Composer
COPY --from=composer:2.8.4 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# =============================================================================
# Development stage - includes dev dependencies (for testing)
# =============================================================================
FROM base AS dev

# Copy composer files
COPY composer.json composer.lock ./

# Install ALL dependencies (including dev)
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .

# Generate autoloader
RUN composer dump-autoload --optimize \
    && composer run-script post-autoload-dump

# Set permissions
RUN mkdir -p /var/www/html/storage/framework/{sessions,views,cache} \
    && mkdir -p /var/www/html/bootstrap/cache \
    && mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod 664 /var/www/html/database/database.sqlite

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["php", "-S", "0.0.0.0:8000", "-t", "/var/www/html/public"]

# =============================================================================
# Production stage - no dev dependencies
# =============================================================================
FROM base AS prod

# Copy composer files
COPY composer.json composer.lock ./

# Install production dependencies only
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application files
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize \
    && composer run-script post-autoload-dump

# Set permissions
RUN mkdir -p /var/www/html/storage/framework/{sessions,views,cache} \
    && mkdir -p /var/www/html/bootstrap/cache \
    && mkdir -p /var/www/html/database \
    && touch /var/www/html/database/database.sqlite \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database \
    && chmod 664 /var/www/html/database/database.sqlite

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["php", "-S", "0.0.0.0:8000", "-t", "/var/www/html/public"]
