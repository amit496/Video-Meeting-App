# Backend File and Folder Structure

Backend path: `D:\\video-meeting-app\\backend`

backend/
├── .agents/
│   └── skills/
│       ├── prisma-cli/
│       │   ├── references/ (Prisma CLI workflow guides)
│       │   └── SKILL.md
│       ├── prisma-client-api/
│       │   ├── references/ (Prisma Client API guides)
│       │   └── SKILL.md
│       ├── prisma-compute/
│       │   ├── references/ (Prisma Compute guides)
│       │   └── SKILL.md
│       ├── prisma-database-setup/
│       │   ├── references/ (database setup guides)
│       │   └── SKILL.md
│       ├── prisma-driver-adapter-implementation/
│       │   └── SKILL.md
│       ├── prisma-mongodb-upgrade/
│       │   ├── references/ (upgrade guides)
│       │   └── SKILL.md
│       ├── prisma-postgres/
│       │   ├── references/ (PostgreSQL guides)
│       │   └── SKILL.md
│       ├── prisma-postgres-setup/
│       │   ├── references/ (PostgreSQL setup guides)
│       │   └── SKILL.md
│       └── prisma-upgrade-v7/
│           ├── references/ (Prisma 7 upgrade guides)
│           └── SKILL.md
├── .claude/ (agent/tool configuration folder; inspect locally for its contents)
├── .windsurf/ (agent/tool configuration folder; inspect locally for its contents)
├── prisma/
│   ├── migrations/
│   │   ├── 20260909130753_init/
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   └── auth/
│   │       └── auth.controller.js
│   ├── generated/
│   │   └── prisma/ (generated Prisma Client TypeScript files)
│   │       ├── internal/
│   │       │   ├── class.ts
│   │       │   ├── prismaNamespace.ts
│   │       │   └── prismaNamespaceBrowser.ts
│   │       ├── models/
│   │       │   ├── Meeting.ts
│   │       │   ├── Message.ts
│   │       │   ├── Participant.ts
│   │       │   └── User.ts
│   │       ├── browser.ts
│   │       ├── client.ts
│   │       ├── commonInputTypes.ts
│   │       ├── enums.ts
│   │       └── models.ts
│   ├── lib/
│   │   └── prisma.js
│   ├── middleware/
│   │   └── auth/
│   │       └── auth.middleware.js
│   ├── routes/
│   │   └── auth/
│   │       └── auth.routes.js
│   ├── validators/
│   │   └── auth/
│   │       └── auth.validator.js
│   ├── app.js
│   ├── server.js
│   ├── socket.js (currently empty)
│   └── test-db.js
├── .env (local secrets; do not share or commit)
├── .gitignore
├── package-lock.json
├── package.json
├── prisma7.config.ts
└── skills-lock.json
```

## Main source folders

- `src/controllers/` — HTTP request handlers and business logic; currently auth controller.
- `src/routes/` — Express route definitions; currently register/login routes.
- `src/validators/` — Zod request schemas; currently auth schemas.
- `src/middleware/` — Express middleware; currently JWT authentication middleware.
- `src/lib/` — shared infrastructure clients; currently Prisma client.
- `src/generated/prisma/` — generated Prisma Client TypeScript output; do not edit manually.
- `prisma/schema.prisma` — PostgreSQL data models and relations.
- `prisma/migrations/` — database migration history.
- `src/app.js` — Express app and route/middleware registration.
- `src/server.js` — HTTP server startup.
- `src/socket.js` — reserved for Socket.IO (empty at present).
- `src/test-db.js` — small PostgreSQL/Prisma connection check.
- `prisma7.config.ts` — Prisma schema, migration and datasource configuration.
- `skills-lock.json`, `.agents/skills/` — local Prisma agent skill documentation; not application runtime code.

Excluded installed folder
`node_modules/` contains installed npm packages and is omitted from this source tree.
