# Stage 1: Build dependencies and Prisma
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source and generate Prisma client
COPY . .
RUN npx prisma generate

# Stage 2: Production image
FROM node:20-slim

WORKDIR /app

# Copy built app and dependencies
COPY --from=builder /app /app

# Reinstall production dependencies only
RUN npm ci --omit=dev || npm install --omit=dev

EXPOSE 3000
CMD ["node", "--experimental-json-modules", "src/index.js"]
