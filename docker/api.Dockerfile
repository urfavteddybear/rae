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

# ---- build api + its workspace deps ----
FROM base AS api-build
COPY apps/api ./apps/api
COPY tsconfig.base.json tsconfig.json ./
RUN pnpm --filter @rae/api build

# ---- run ----
FROM node:22-alpine AS api
RUN addgroup -S rae && adduser -S rae -G rae
WORKDIR /app
# node_modules + packages together: pnpm symlinks @rae/* into packages/.
COPY --from=api-build /app/node_modules ./node_modules
COPY --from=api-build /app/packages ./packages
COPY --from=api-build /app/apps/api/dist ./dist
COPY apps/api/package.json ./
USER rae
ENV NODE_ENV=production
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:4000/health | grep -q '"status":"ok"' || exit 1
CMD ["node", "dist/index.js"]
