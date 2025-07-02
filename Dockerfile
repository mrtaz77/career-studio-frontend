# Stage 1: Build the Vite app
FROM node:24.2-alpine3.22 AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Copy source code
COPY vite.config.ts index.html tailwind.config.ts postcss.config.js tsconfig.json tsconfig.app.json ./
COPY src/ ./src
COPY public/ ./public

# Create build script that reads secrets and builds
RUN --mount=type=secret,id=firebase_api_key \
    --mount=type=secret,id=firebase_auth_domain \
    --mount=type=secret,id=firebase_project_id \
    --mount=type=secret,id=firebase_storage_bucket \
    --mount=type=secret,id=firebase_messaging_sender_id \
    --mount=type=secret,id=firebase_app_id \
    --mount=type=secret,id=firebase_measurement_id \
    --mount=type=secret,id=api_base_url \
    VITE_FIREBASE_API_KEY="$(cat /run/secrets/firebase_api_key)" \
    VITE_FIREBASE_AUTH_DOMAIN="$(cat /run/secrets/firebase_auth_domain)" \
    VITE_FIREBASE_PROJECT_ID="$(cat /run/secrets/firebase_project_id)" \
    VITE_FIREBASE_STORAGE_BUCKET="$(cat /run/secrets/firebase_storage_bucket)" \
    VITE_FIREBASE_MESSAGING_SENDER_ID="$(cat /run/secrets/firebase_messaging_sender_id)" \
    VITE_FIREBASE_APP_ID="$(cat /run/secrets/firebase_app_id)" \
    VITE_FIREBASE_MEASUREMENT_ID="$(cat /run/secrets/firebase_measurement_id)" \
    VITE_API_BASE_URL="$(cat /run/secrets/api_base_url)" \
    npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Add non-root user and fix permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /run && \
    mkdir -p /var/cache/nginx/client_temp && \
    chown -R appuser:appgroup /run /var/cache/nginx

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R appuser:appgroup /usr/share/nginx/html

USER appuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]