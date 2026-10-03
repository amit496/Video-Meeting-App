## File and folder tree

backend/
├── .agents/
│   └── skills/
│       ├── prisma-cli/
│       │   ├── references/
│       │   │   ├── agent-safety.md
│       │   │   ├── complete.md
│       │   │   ├── db-execute.md
│       │   │   ├── db-pull.md
│       │   │   ├── db-push.md
│       │   │   ├── db-seed.md
│       │   │   ├── debug.md
│       │   │   ├── dev.md
│       │   │   ├── format.md
│       │   │   ├── generate.md
│       │   │   ├── init.md
│       │   │   ├── mcp.md
│       │   │   ├── migrate-deploy.md
│       │   │   ├── migrate-dev.md
│       │   │   ├── migrate-diff.md
│       │   │   ├── migrate-reset.md
│       │   │   ├── migrate-resolve.md
│       │   │   ├── migrate-status.md
│       │   │   ├── studio.md
│       │   │   └── validate.md
│       │   └── SKILL.md
│       ├── prisma-client-api/
│       │   ├── references/
│       │   │   ├── client-methods.md
│       │   │   ├── constructor.md
│       │   │   ├── filters.md
│       │   │   ├── model-queries.md
│       │   │   ├── query-options.md
│       │   │   ├── raw-queries.md
│       │   │   ├── relations.md
│       │   │   └── transactions.md
│       │   └── SKILL.md
│       ├── prisma-compute/
│       │   ├── references/
│       │   │   ├── app-deploy-cli.md
│       │   │   ├── compute-config.md
│       │   │   ├── create-prisma.md
│       │   │   ├── frameworks.md
│       │   │   ├── sdk-api.md
│       │   │   └── troubleshooting.md
│       │   └── SKILL.md
│       ├── prisma-database-setup/
│       │   ├── references/
│       │   │   ├── cockroachdb.md
│       │   │   ├── mongodb.md
│       │   │   ├── mysql.md
│       │   │   ├── postgresql.md
│       │   │   ├── prisma-client-setup.md
│       │   │   ├── prisma-postgres.md
│       │   │   ├── sqlite.md
│       │   │   └── sqlserver.md
│       │   └── SKILL.md
│       ├── prisma-driver-adapter-implementation/
│       │   └── SKILL.md
│       ├── prisma-mongodb-upgrade/
│       │   ├── references/
│       │   │   ├── client-api-mapping.md
│       │   │   ├── decision-stay-or-migrate.md
│       │   │   ├── migrations-mapping.md
│       │   │   ├── schema-contract-mapping.md
│       │   │   └── verify-cutover-checklist.md
│       │   └── SKILL.md
│       ├── prisma-postgres/
│       │   ├── references/
│       │   │   ├── console-and-connections.md
│       │   │   ├── create-db-cli.md
│       │   │   ├── management-api-sdk.md
│       │   │   └── management-api.md
│       │   └── SKILL.md
│       ├── prisma-postgres-setup/
│       │   ├── references/
│       │   │   ├── api-basics.md
│       │   │   ├── auth.md
│       │   │   ├── endpoints.md
│       │   │   └── prisma7-client.md
│       │   └── SKILL.md
│       └── prisma-upgrade-v7/
│           ├── references/
│           │   ├── accelerate-users.md
│           │   ├── driver-adapters.md
│           │   ├── env-variables.md
│           │   ├── esm-support.md
│           │   ├── prisma-config.md
│           │   ├── removed-features.md
│           │   └── schema-changes.md
│           └── SKILL.md
├── .claude/
│   └── skills/ (contents not expanded)
├── .windsurf/
│   └── skills/ (contents not expanded)
├── node_modules/ (installed dependencies; contents not expanded)
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
│   │   └── prisma/
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
│   ├── socket.js
│   └── test-db.js
├── .env
├── .gitignore
├── BACKEND_STRUCTURE.md
├── package-lock.json
├── package.json
├── prisma7.config.ts
└── skills-lock.json
