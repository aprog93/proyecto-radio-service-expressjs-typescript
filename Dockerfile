# =============================================================================
# Radio Cesar Backend - Dockerfile
# Base: node:20-slim
# =============================================================================

FROM node:20-slim

WORKDIR /app

# Instalar dependencias del sistema para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de configuración
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY src ./src/

# Generar Prisma Client
RUN echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev" > .env && \
    pnpm exec prisma generate

# Build TypeScript
RUN pnpm run build

# Crear usuario no-root
RUN groupadd -g 1001 nodejs || true && \
    useradd -u 1001 -g nodejs -m radio || true

# Permisos
RUN chown -R radio:nodejs /app

USER radio

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/index.js"]
