# Stage 1: Build dependencies and Prisma client
FROM node:20 AS builder

WORKDIR /app

# Install OpenSSL for Prisma engine compatibility
RUN apt-get update && apt-get install -y openssl

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source and generate Prisma client
COPY . .
RUN npx prisma generate

# Stage 2: Production Image
FROM node:20-slim

# Install OpenSSL again for runtime
RUN apt-get update && apt-get install -y openssl

# Create non-root user for security
RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Ensure logs directory exists and is writable
RUN mkdir -p /app/logs && chown -R appuser:appuser /app/logs

# Use non-root user
USER appuser

EXPOSE 3000

CMD ["node", "--experimental-json-modules", "src/index.js"]
