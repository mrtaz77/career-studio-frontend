# Stage 1: Build the Vite app
FROM node:24.2-alpine3.22 AS builder

WORKDIR /app

# Accept build-time Firebase + API envs
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_API_BASE_URL

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
    VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json ./
RUN npm install --ignore-scripts

COPY . .
RUN npm run build

# Stage 2: Serve with nginx, as a non-root user
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
