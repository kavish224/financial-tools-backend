# Stage 1: Build dependencies and Prisma
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .
RUN npx prisma generate

# Stage 2: Production image
FROM node:20-slim

WORKDIR /app

# Copy only what's needed
COPY --from=builder /app /app
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "--experimental-json-modules", "src/index.js"]
