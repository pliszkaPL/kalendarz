# Frontend Dockerfile - Vue.js 3 SPA
# Multi-stage build

# Build stage
FROM node:20.18.1-alpine3.21 AS build

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build for production
RUN npm run build

# Production stage
FROM nginx:1.27.3-alpine3.20

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
