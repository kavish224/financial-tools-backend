# Use official Node.js LTS image
FROM node:20

# Create app directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies
RUN npm install
# Generate Prisma client
# Copy entire codebase into container
COPY . .

RUN npx prisma generate


# Expose the backend port (update if not 5000)
EXPOSE 3000

# Start the app in production mode
CMD ["node", "--experimental-json-modules", "src/index.js"]
