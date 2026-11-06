# Multi-stage Dockerfile for UMKM Next.js 16 + Docker

# Stage 1: Base
FROM node:26-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends openssl curl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm i -g pnpm@latest
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile --config.minimumReleaseAge=0 || (pnpm approve-builds --all && pnpm install --config.minimumReleaseAge=0)

# Stage 3: Development
FROM deps AS dev
WORKDIR /app
COPY . .
ENV NODE_ENV=development
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["pnpm", "dev"]

# Stage 4: Builder
FROM deps AS builder
WORKDIR /app
COPY . .
ENV NODE_ENV=production
RUN pnpm prisma generate
RUN pnpm build

# Stage 5: Migrator
FROM deps AS migrator
WORKDIR /app
COPY . .
RUN chmod +x ./scripts/*.sh 2>/dev/null || true
CMD ["sh", "./scripts/migrate.sh"]

# Stage 6: Production Runner
FROM node:26-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update && apt-get install -y --no-install-recommends openssl curl ca-certificates && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Ensure uploads directory exists and is owned by nextjs
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
