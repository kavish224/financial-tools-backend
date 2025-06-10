# Stage 1: Build dependencies and Prisma client
FROM node:20 AS builder

WORKDIR /app

# Install only locked versions of dependencies
COPY package*.json ./
RUN npm install

# Copy app source and generate Prisma client
COPY . .
RUN npx prisma generate

# Stage 2: Production Image
FROM node:20-slim

# Create non-root user for better security
RUN useradd --user-group --create-home --shell /bin/false appuser

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app /app

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Use non-root user
USER appuser

EXPOSE 3000

# Change this if your entry point is different
CMD ["node", "--experimental-json-modules", "src/index.js"]
