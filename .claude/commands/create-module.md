---
description: Scaffold a complete NestJS module with controller, service, schema and DTOs. Usage: /create-module <entity-name>
---

Create a complete NestJS module for the Advance Group backend.

**Input**: $ARGUMENTS — entity name in kebab-case (e.g. "user", "blog-post")

**Create these files** in `backend/src/modules/<entity>/`:

1. **`<entity>.module.ts`** — imports MongooseModule.forFeature, declares controller + service
2. **`schemas/<entity>.schema.ts`** — Mongoose schema with `@Schema({ timestamps: true })`, typed with `HydratedDocument<Entity>`
3. **`dto/create-<entity>.dto.ts`** — class-validator decorators on every field
4. **`dto/update-<entity>.dto.ts`** — `PartialType(Create<Entity>Dto)` from `@nestjs/mapped-types`
5. **`<entity>.service.ts`** — `create`, `findAll`, `findOne`, `update`, `remove` methods
6. **`<entity>.controller.ts`** — REST endpoints `POST /`, `GET /`, `GET /:id`, `PUT /:id`, `DELETE /:id`
7. **`<entity>.service.spec.ts`** — unit tests with mocked Mongoose model; ≥80% coverage

**After creating files**:
- Import the new module in `backend/src/app.module.ts`
- Report all files created and the import line added
