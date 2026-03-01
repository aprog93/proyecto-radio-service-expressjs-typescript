# AGENTS.md - Sistema de Gestión de Proyecto (Backend)

## Project Overview
**Proyecto Radio Cesar** - Backend API para plataforma de radio comunitaria.
**Workspace:** `/home/aprog93/Documents/workspace/proyecto-radio-cesar/service/`
**Stack:** Express + Prisma + PostgreSQL + TypeScript + Vitest

---

## 🎯 Sistema de Skills (Ingenieros Especializados)

El AGENTS.md actúa como **Project Manager (PM)** que delega tareas a los siguientes engineers especializados:

### 🔧 Skill: `express-api`
**Especialista en:** Endpoints REST, middlewares, autenticación, validación
- Gestión de rutas Express
- Middlewares de autenticación (JWT)
- Validación de input (Zod)
- Manejo de errores

### 🗄️ Skill: `database`
**Especialista en:** Prisma, PostgreSQL, migraciones, queries complejas
- Modelos de base de datos
- Migraciones y seeds
- Consultas optimizadas
- Transactions

### 🎵 Skill: `azuracast`
**Especialista en:** Integración con API de AzuraCast
- Proxy de endpoints públicos
- Tipos TypeScript para AzuraCast
- Caché de respuestas
- Manejo de streams

### 🧪 Skill: `testing`
**Especialista en:** Vitest, mocks, testing de integración
- Tests unitarios
- Mocks de API externas
- Coverage y reportes
- E2E con Playwright

### 📝 Skill: `documentation`
**Especialista en:** OpenAPI/Swagger, JSDoc, comentarios
- Specs OpenAPI
- Swagger UI
- Documentación de tipos

### 🐳 Skill: `devops`
**Especialista en:** Docker, CI/CD, despliegue
- Dockerfiles
- docker-compose
- Variables de entorno

---

## 📋 Áreas de Responsabilidad

| Área | Skill Asignado | Archivos Clave |
|------|---------------|----------------|
| Rutas API REST | `express-api` | `src/routes/*.ts` |
| Base de datos | `database` | `prisma/schema.prisma` |
| AzuraCast | `azuracast` | `src/services/azuracast.ts` |
| Tests | `testing` | `src/__tests__/**/*.ts` |
| Docs | `documentation` | `src/config/openapi-spec.ts` |
| Docker | `devops` | `Dockerfile`, `docker-compose.yml` |

---

## 🚀 Commands de Desarrollo

### Install dependencies
```bash
cd service && pnpm install
```

### Development
```bash
cd service && pnpm dev
# Servidor en http://localhost:3000
```

### Build
```bash
cd service && pnpm build
# Output: dist/
```

### Tests
```bash
cd service && pnpm test
# Vitest: 43 tests passing
cd service && pnpm test:coverage
# Coverage report
```

### Lint
```bash
cd service && pnpm lint
# ESLint + TypeScript
```

### Docker
```bash
# PostgreSQL
docker run -d --name radio-postgres -e POSTGRES_PASSWORD=radio123 -e POSTGRES_DB=radio_cesar -p 5433:5432 postgres:16-alpine

# Backend
docker build -t radio-cesar-backend .
docker run -d -p 3000:3000 --env-file .env radio-cesar-backend
```

---

## 📐 Estructura de Código

```
src/
├── config/
│   ├── env.ts           # Variables de entorno
│   ├── prisma.ts       # Prisma client
│   ├── swagger.ts      # Swagger UI setup
│   └── openapi-spec.ts # OpenAPI spec completo
├── routes/
│   ├── auth.ts         # /api/auth/*
│   ├── users.ts        # /api/users/*
│   ├── blogs.ts        # /api/blogs/*
│   ├── news.ts         # /api/news/*
│   ├── events.ts       # /api/events/*
│   ├── products.ts     # /api/products/*
│   ├── admin.ts        # /api/admin/*
│   └── station.ts      # /api/station/* (AzuraCast)
├── services/
│   ├── auth.ts         # Lógica de autenticación
│   └── azuracast.ts    # Proxy API AzuraCast
├── lib/
│   ├── cache.ts        # Caché en memoria
│   └── helpers.ts      # Utilidades
├── types/
│   ├── api.ts          # Tipos respuesta API
│   ├── azuracast.ts    # Tipos AzuraCast
│   └── database.ts     # Tipos Prisma
└── __tests__/
    ├── routes/         # Tests de rutas
    ├── services/       # Tests de servicios
    ├── fixtures/      # Datos de test
    └── mocks/         # Mocks
```

---

## 📚 Endpoints AzuraCast (API Pública)

### Implementados (22 endpoints)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/station/status` | Estado del sistema |
| GET | `/api/station/time` | Hora del servidor |
| GET | `/api/station/nowplaying-global` | Now Playing global |
| GET | `/api/station/now-playing` | Ahora reproduciendo |
| GET | `/api/station/now-playing/art` | Carátula actual |
| GET | `/api/station/stations` | Listado de estaciones |
| GET | `/api/station/info` | Info de estación |
| GET | `/api/station/media/:mediaId/art` | Carátula de media |
| GET | `/api/station/history` | Historial de reproducción |
| GET | `/api/station/ondemand` | Contenido on-demand |
| GET | `/api/station/ondemand/:id` | Item on-demand específico |
| GET | `/api/station/ondemand/:id/download` | Descarga on-demand |
| GET | `/api/station/podcasts` | Lista de podcasts |
| GET | `/api/station/podcasts/:id` | Podcast específico |
| GET | `/api/station/podcasts/:id/episodes` | Episodios de podcast |
| GET | `/api/station/podcasts/:id/episodes/:epId` | Episodio específico |
| GET | `/api/station/podcast-art/:id` | Carátula de podcast |
| GET | `/api/station/episode-art/:podcastId/:episodeId` | Carátula de episodio |
| GET | `/api/station/episode-media/:podcastId/:episodeId` | Media de episodio |
| GET | `/api/station/schedule` | Programación semanal |
| GET | `/api/station/streamers` | Lista de DJs/streamers |
| GET | `/api/station/streamer-art/:id` | Avatar de streamer |
| GET | `/api/station/listeners` | Oyentes actuales |

---

## 🧪 Estándares de Código

### TypeScript
- **Strict mode:** Habilitado (strict: true en tsconfig.json)
- **Sin `any`:** No se permite el tipo `any` en código fuente (excluyendo archivos generados y tests)
- **Interfaces:** Para objetos (no prefix `I`)
- **Types:** Para uniones/primitivos
- **Explicit returns:** Obligatorio en funciones

### Imports
```typescript
// External → Internal → Relative
import { Router, Request, Response } from 'express';
import { success, error } from '../types/api.js';
import { env } from '../config/env.js';
```

### Tests
- **Framework:** Vitest
- **Naming:** `*.test.ts` o `*.spec.ts`
- **Mocking:** Mocks en `__tests__/mocks/`
- **Coverage:** Mínimo 80% en servicios críticos

### Documentación
- **JSDoc:** Funciones complejas
- **OpenAPI:** Todos los endpoints
- **Swagger UI:** `/api/docs`

---

## 🎯 Tareas Activas

### Fase 5: Integración Completa de AzuraCast
1. [x] Implementar endpoints faltantes de AzuraCast
2. [x] Agregar tipos TypeScript para nuevos endpoints
3. [x] Actualizar documentación OpenAPI
4. [x] Crear tests para cada endpoint
5. [x] Verificar funcionamiento

---

## 📞 Uso del Sistema de Skills

Para delegar una tarea, especifica:
```
Skill requerido: [express-api|azuracast|database|testing|documentation|devops]
Tarea: [descripción específica]
Prioridad: [high|medium|low]
```

Ejemplo:
```
@skill[azuracast] Implementar endpoint /api/station/schedule que haga proxy 
a la API de AzuraCast y retorne la programación semanal.
```

---

## 📖 Referencias

- [AzuraCast API Docs](https://www.azuracast.com/api/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Vitest](https://vitest.dev/)
- [Swagger](https://swagger.io/)
