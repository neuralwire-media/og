# ==============================================================================
# Stage 1: Builder
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install build tools for native addons if needed
RUN apk add --no-cache libc6-compat

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application sources and assets
COPY tsconfig.json ./
COPY assets ./assets
COPY src ./src

# Build TypeScript to dist/
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# ==============================================================================
# Stage 2: Production Runner
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

# Create a non-privileged user and group for security
RUN addgroup -g 10001 -S nodejs && \
    adduser -S nodejs -u 10001 -G nodejs

# Copy dependencies and build artifacts from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/assets ./assets
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nodejs

# Expose standard microservice port
EXPOSE 3000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start service
CMD ["node", "dist/index.js"]
