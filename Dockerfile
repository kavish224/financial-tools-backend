# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies
RUN npm install
# Generate Prisma client
RUN npx prisma generate

# Copy entire codebase into container
COPY . .

# Expose the backend port (update if not 5000)
EXPOSE 3000

# Start the app in production mode
CMD ["node", "--experimental-json-modules", "src/index.js"]
