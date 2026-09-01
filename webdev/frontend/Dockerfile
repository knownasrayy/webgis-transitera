FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the application source code
COPY . .

# Expose Next.js port
EXPOSE 3030

# Start development server with hot-reload
CMD ["npm", "run", "dev"]
