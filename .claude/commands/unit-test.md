---
description: Generate unit tests for a given source file. Detects Angular or NestJS context automatically. Usage: /unit-test <file-path>
---

Generate a complete unit test spec file for $ARGUMENTS.

**Steps**:
1. Read the target file at $ARGUMENTS
2. Detect context: Angular (component/service/pipe) or NestJS (service/controller/guard)
3. Identify all public methods and observable outputs
4. Write a `*.spec.ts` alongside the source file

## Angular component tests (Jasmine)
- `TestBed.configureTestingModule({ imports: [ComponentUnderTest, ...deps] })`
- Test: renders correctly, input properties, output events, conditional template blocks, error states
- Mock services with `jasmine.createSpyObj` or `TestBed.inject` + `spyOn`

## Angular service tests (Jasmine)
- Use `HttpClientTestingModule` for HTTP services
- Use `HttpTestingController` to match requests and flush mock responses
- Test: success response, error handling, request params

## NestJS service tests (Jest)
- `Test.createTestingModule({ providers: [Service, { provide: getModelToken(Entity.name), useValue: mockModel }] })`
- Mock model: `{ create: jest.fn(), find: jest.fn(), findById: jest.fn(), ... }`
- Test: happy path, NotFoundException, validation, DB errors

## NestJS controller tests (Jest)
- Provide mocked service via `{ provide: Service, useValue: { method: jest.fn() } }`
- Test: correct delegation to service, HTTP status codes

**Coverage target**: ≥80% branches, functions, lines
**Output**: complete spec file, no explanation needed
