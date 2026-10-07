# ---- base: workspace deps ----
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/
COPY apps/bot/package.json ./apps/bot/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# ---- build bot + its workspace deps ----
FROM base AS bot-build
COPY apps/bot ./apps/bot
COPY tsconfig.base.json tsconfig.json ./
RUN pnpm --filter @rae/bot build

# ---- run ----
FROM node:22-alpine AS bot
RUN addgroup -S rae && adduser -S rae -G rae
WORKDIR /app
# node_modules + packages together: pnpm symlinks @rae/* into packages/.
COPY --from=bot-build /app/node_modules ./node_modules
COPY --from=bot-build /app/packages ./packages
COPY --from=bot-build /app/apps/bot/dist ./dist
COPY apps/bot/package.json ./
USER rae
ENV NODE_ENV=production
# Control port is internal-only: bound to compose network, never published.
EXPOSE 4550
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- --header="x-rae-bot-secret: $RAE_BOT_INTERNAL_SECRET" http://127.0.0.1:4550/health | grep -q '"status":"ok"' || exit 1
CMD ["node", "dist/index.js"]
