# ---- deps + build (Next standalone) ----
FROM node:22-alpine AS web-build
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/
COPY apps/bot/package.json ./apps/bot/
COPY apps/web ./apps/web
COPY tsconfig.base.json tsconfig.json ./
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @rae/shared build && pnpm --filter @rae/web build

# ---- run ----
FROM node:22-alpine AS web
RUN addgroup -S rae && adduser -S rae -G rae
WORKDIR /app
ENV NODE_ENV=production
COPY --from=web-build /app/apps/web/.next/standalone ./
COPY --from=web-build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-build /app/apps/web/public ./apps/web/public
USER rae
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/ | grep -q . || exit 1
CMD ["node", "apps/web/server.js"]
