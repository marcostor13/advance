---
description: Review a file for SOLID principle violations and suggest fixes. Usage: /solid-review <file-path>
---

Perform a SOLID principles review of the file at $ARGUMENTS.

**Read the file first**, then evaluate:

## S — Single Responsibility Principle
- Does this class/module have only ONE reason to change?
- Are unrelated concerns (e.g., data access + business logic + formatting) mixed?

## O — Open/Closed Principle
- Can behavior be extended without modifying existing code?
- Are conditionals (`if/switch`) on type/role that could be replaced with polymorphism?

## L — Liskov Substitution Principle
- Can subtypes replace their base types without breaking behavior?
- Do overrides strengthen preconditions or weaken postconditions?

## I — Interface Segregation Principle
- Are interfaces narrow and focused?
- Do implementers depend on methods they don't use?

## D — Dependency Inversion Principle
- Do high-level modules depend on abstractions, not concretions?
- Is NestJS `inject()` / DI used correctly?
- Are services imported directly instead of injected?

**Output format**:
```
## SOLID Review: <filename>

### ✅ Compliant
- (list principles that are respected)

### ❌ Violations
**[Principle]** Line X:
- Problem: <description>
- Solution: <concrete refactoring suggestion>
- Code: (show minimal example of the fix)
```
