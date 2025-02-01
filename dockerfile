# STAGE 1: Builder
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build




# STAGE 2: Production
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy the production dependencies and build from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose Next.js default port
EXPOSE 3000



# Start the application
CMD ["npm", "run", "start"]
