---
description: Review a file for Clean Code violations and suggest fixes. Usage: /clean-code-review <file-path>
---

Perform a Clean Code review of the file at $ARGUMENTS.

**Read the file first**, then evaluate against these principles:

## Naming
- [ ] Variables, functions, and classes have intention-revealing names
- [ ] No abbreviations unless universally known (e.g., `id`, `url`)
- [ ] Boolean names start with `is`, `has`, `can`, `should`
- [ ] Functions named as verbs (`getUser`, `calculateTotal`)

## Functions
- [ ] Functions do ONE thing (≤20 lines is a signal, not a rule)
- [ ] No more than 3 parameters — suggest object parameter if more needed
- [ ] No side effects beyond stated purpose
- [ ] No flag arguments (boolean params that change function behavior)

## Comments
- [ ] Code is self-documenting — comments explain WHY not WHAT
- [ ] No commented-out code
- [ ] No misleading or outdated comments

## Error handling
- [ ] No swallowed exceptions
- [ ] Errors are handled at the right abstraction level
- [ ] No `any` type used to bypass type errors

## DRY / Structure
- [ ] No duplicated logic (extract to shared utility)
- [ ] No magic numbers — use named constants
- [ ] Proper separation of concerns

**Output format**:
```
## Clean Code Review: <filename>

### ✅ Passes
- (list what's good)

### ⚠️ Issues
1. Line X: <issue> → <suggested fix>

### Refactored snippet (if needed)
(show only the changed section)
```
